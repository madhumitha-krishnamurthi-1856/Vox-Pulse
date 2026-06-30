import type {
  Category,
  Impact,
  RawFeedbackItem,
  Sentiment,
  Severity,
} from "./types";

const BUG = /\b(bug|broken|crash(?:ed|ing)?|error|fails?|doesn'?t work|not working|glitch)\b/i;
const FEATURE = /\b(feature request|wish|would love|please add|missing|should (?:have|add)|need(?:s)? a)\b/i;
const QUESTION = /\?|\bhow (?:do|to)\b|\bcan (?:i|you)\b|\bany(?:one|body) know\b/i;
const PRAISE = /\b(love|amazing|awesome|great|fantastic|excellent|best|recommend)\b/i;
const COMPLAINT = /\b(hate|terrible|awful|worst|disappointed|frustrat(?:ed|ing)|annoying|slow|expensive)\b/i;

const NEG = /\b(hate|terrible|awful|worst|broken|crash|bug|disappointed|frustrat|annoying|slow|useless|garbage|sucks?)\b/i;
const POS = /\b(love|amazing|awesome|great|fantastic|excellent|best|recommend|perfect|smooth|fast)\b/i;

const CRITICAL = /\b(security|breach|data ?loss|outage|down|cannot (?:log ?in|access)|charged twice|fraud|urgent|broken|crash(?:ed|ing)?|deleted|locked out)\b/i;
const HIGH_IMPACT = /\b(love|best|amazing|recommend|game[- ]changer|favorite|fantastic|switched to|life[- ]?saver)\b/i;

export function classifyItem(item: RawFeedbackItem): {
  category: Category;
  sentiment: Sentiment;
  severity: Severity | null;
  impact: Impact | null;
  reason: string;
} {
  const text = `${item.title} ${item.snippet}`;

  let category: Category = "other";
  if (BUG.test(text)) category = "bug";
  else if (FEATURE.test(text)) category = "feature_request";
  else if (PRAISE.test(text)) category = "praise";
  else if (COMPLAINT.test(text)) category = "complaint";
  else if (QUESTION.test(text)) category = "question";

  let sentiment: Sentiment = "neutral";
  const hasPos = POS.test(text);
  const hasNeg = NEG.test(text);
  if (hasPos && !hasNeg) sentiment = "positive";
  else if (hasNeg && !hasPos) sentiment = "negative";
  else if (category === "praise") sentiment = "positive";
  else if (category === "bug" || category === "complaint") sentiment = "negative";

  let severity: Severity | null = null;
  let impact: Impact | null = null;
  let reason = "";

  if (sentiment === "negative") {
    if (CRITICAL.test(text) || category === "bug") {
      severity = CRITICAL.test(text) ? "critical" : "major";
    } else {
      severity = "minor";
    }
    reason =
      severity === "critical"
        ? "Mentions outage, security, or blocking failure — escalate immediately."
        : severity === "major"
        ? "Reproducible defect or strong complaint — schedule a fix."
        : "Minor friction or dissatisfaction — track for trends.";
  } else if (sentiment === "positive") {
    impact = HIGH_IMPACT.test(text) ? "high" : "low";
    reason =
      impact === "high"
        ? "Strong advocacy signal — surface to marketing & sales."
        : "Mild positive — useful for sentiment baseline.";
  } else {
    reason =
      category === "question"
        ? "Open question from the community — opportunity for support."
        : "Neutral mention — useful for volume tracking.";
  }

  return { category, sentiment, severity, impact, reason };
}