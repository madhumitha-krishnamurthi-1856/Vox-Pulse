import type {
  Category,
  Impact,
  RawFeedbackItem,
  Sentiment,
  Severity,
} from "./types";

const BUG = /\b(bug|broken|crash(?:ed|ing)?|error|fails?|doesn'?t work|not working|glitch|freezes?|hangs?)\b/i;
const FEATURE = /\b(feature request|wish|would love|please add|missing|should (?:have|add)|need(?:s)? a)\b/i;
const QUESTION = /\?|\bhow (?:do|to)\b|\bcan (?:i|you)\b|\bany(?:one|body) know\b/i;
const PRAISE = /\b(love|amazing|awesome|great|fantastic|excellent|best|recommend|reliable|intuitive|seamless)\b/i;
const COMPLAINT = /\b(hate|terrible|awful|worst|disappointed|frustrat(?:ed|ing)|annoying|slow|expensive|unreliable|overpriced)\b/i;

const NEG = /\b(hate|terrible|awful|worst|broken|crash|bug|disappoint|frustrat|annoying|slow|useless|garbage|sucks?|unreliable|overpriced|way too expensive|keeps? (?:crashing|failing)|support is (?:bad|terrible|nonexistent))\b/i;
const POS = /\b(love|amazing|awesome|great|fantastic|excellent|best|recommend|perfect|smooth|fast|reliable|intuitive|seamless|easy to use|works (?:great|well|perfectly)|no issues|highly recommend)\b/i;
const NEGATED_POS = /\b(?:not|never|doesn'?t|don'?t|won'?t|isn'?t|aren'?t|hardly|barely)\s+(?:love|great|amazing|good|recommend|perfect|fast|smooth|reliable|work(?:s|ing)?)\b/i;

const CRITICAL = /\b(security|breach|data ?loss|outage|down|cannot (?:log ?in|access)|charged twice|fraud|locked out|deleted (?:all )?(?:my )?(?:data|emails?|events?))\b/i;
const HIGH_IMPACT = /\b(love|best|amazing|recommend|game[- ]changer|favorite|fantastic|switched to|life[- ]?saver|highly recommend)\b/i;

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
  const hasPos = POS.test(text) && !NEGATED_POS.test(text);
  const hasNeg = NEG.test(text) || NEGATED_POS.test(text);
  if (hasPos && !hasNeg) sentiment = "positive";
  else if (hasNeg && !hasPos) sentiment = "negative";
  else if (category === "praise") sentiment = "positive";
  else if (category === "bug" || category === "complaint") sentiment = "negative";

  let severity: Severity | null = null;
  let impact: Impact | null = null;
  let reason = "";

  if (sentiment === "negative") {
    if (CRITICAL.test(text)) {
      severity = "critical";
    } else if (BUG.test(text) || category === "bug" || category === "complaint") {
      severity = "major";
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