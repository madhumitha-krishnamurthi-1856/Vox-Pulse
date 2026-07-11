export type SourceId =
  | "reddit"
  | "g2"
  | "capterra"
  | "trustpilot"
  | "bluesky"
  | "hackernews";

export type Timeframe = "day" | "week" | "month" | "year" | "all";

export type Category =
  | "bug"
  | "feature_request"
  | "praise"
  | "complaint"
  | "question"
  | "other";

export type Sentiment = "positive" | "neutral" | "negative";

export type Severity = "critical" | "major" | "minor";
export type Impact = "high" | "low";

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
  severity: Severity | null;
  impact: Impact | null;
  reason: string;
}

export interface Scorecard {
  total: number;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  topCategory: Category | null;
  bySource: Record<SourceId, number>;
  score: number;
  trend: "rising" | "falling" | "stable";
  delta: number;
  themes: { category: Category; count: number }[];
}

export interface FetchFeedbackResult {
  items: FeedbackItem[];
  scorecard: Scorecard;
  errors: Partial<Record<SourceId, string>>;
  creditsUsed: number;
  creditsRemaining: number | null;
}

export const SOURCE_LABELS: Record<SourceId, string> = {
  reddit: "Reddit",
  g2: "G2",
  capterra: "Capterra",
  trustpilot: "Trustpilot",
  bluesky: "Bluesky",
  hackernews: "Hacker News",
};

export const SOURCE_DOMAINS: Record<SourceId, string> = {
  reddit: "reddit.com",
  g2: "g2.com",
  capterra: "capterra.com",
  trustpilot: "trustpilot.com",
  bluesky: "bsky.app",
  hackernews: "news.ycombinator.com",
};

export const ALL_SOURCES: SourceId[] = [
  "reddit",
  "g2",
  "capterra",
  "trustpilot",
  "bluesky",
  "hackernews",
];

export const CATEGORY_LABELS: Record<Category, string> = {
  bug: "Bugs",
  feature_request: "Feature requests",
  praise: "Praise",
  complaint: "Complaints",
  question: "Questions",
  other: "Other",
};