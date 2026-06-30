export type SourceId = "reddit" | "twitter" | "g2" | "capterra" | "trustpilot";

export type Timeframe = "day" | "week" | "month" | "year" | "all";

export type Category =
  | "bug"
  | "feature_request"
  | "praise"
  | "complaint"
  | "question"
  | "other";

export type Sentiment = "positive" | "neutral" | "negative";

export interface RawFeedbackItem {
  source: SourceId;
  url: string;
  title: string;
  snippet: string;
}

export interface FeedbackItem extends RawFeedbackItem {
  id: string;
  category: Category;
  sentiment: Sentiment;
}

export interface Scorecard {
  total: number;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  topCategory: Category | null;
  bySource: Record<SourceId, number>;
}

export interface FetchFeedbackResult {
  items: FeedbackItem[];
  scorecard: Scorecard;
  errors: Partial<Record<SourceId, string>>;
}

export const SOURCE_LABELS: Record<SourceId, string> = {
  reddit: "Reddit",
  twitter: "Twitter / X",
  g2: "G2",
  capterra: "Capterra",
  trustpilot: "Trustpilot",
};

export const SOURCE_DOMAINS: Record<SourceId, string> = {
  reddit: "reddit.com",
  twitter: "twitter.com",
  g2: "g2.com",
  capterra: "capterra.com",
  trustpilot: "trustpilot.com",
};

export const ALL_SOURCES: SourceId[] = [
  "reddit",
  "twitter",
  "g2",
  "capterra",
  "trustpilot",
];

export const CATEGORY_LABELS: Record<Category, string> = {
  bug: "Bugs",
  feature_request: "Feature requests",
  praise: "Praise",
  complaint: "Complaints",
  question: "Questions",
  other: "Other",
};