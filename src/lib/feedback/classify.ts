import type { Category, RawFeedbackItem, Sentiment } from "./types";

const BUG = /\b(bug|broken|crash(?:ed|ing)?|error|fails?|doesn'?t work|not working|glitch)\b/i;
const FEATURE = /\b(feature request|wish|would love|please add|missing|should (?:have|add)|need(?:s)? a)\b/i;
const QUESTION = /\?|\bhow (?:do|to)\b|\bcan (?:i|you)\b|\bany(?:one|body) know\b/i;
const PRAISE = /\b(love|amazing|awesome|great|fantastic|excellent|best|recommend)\b/i;
const COMPLAINT = /\b(hate|terrible|awful|worst|disappointed|frustrat(?:ed|ing)|annoying|slow|expensive)\b/i;

const NEG = /\b(hate|terrible|awful|worst|broken|crash|bug|disappointed|frustrat|annoying|slow|useless|garbage|sucks?)\b/i;
const POS = /\b(love|amazing|awesome|great|fantastic|excellent|best|recommend|perfect|smooth|fast)\b/i;

export function classifyItem(item: RawFeedbackItem): {
  category: Category;
  sentiment: Sentiment;
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

  return { category, sentiment };
}