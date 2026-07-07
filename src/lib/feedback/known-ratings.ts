export interface ProductRatings {
  g2: number | null;
  capterra: number | null;
  trustpilot: number | null;
  g2ReviewCount: number | null;
  capterraReviewCount: number | null;
  trustpilotReviewCount: number | null;
  g2Url: string;
  capterraUrl: string;
  trustpilotUrl: string;
}

// Scores are out of 5. Update periodically from each platform's product page.
export const KNOWN_RATINGS: Record<string, ProductRatings> = {
  "Zoho Mail": {
    g2: 4.4,
    capterra: 4.5,
    trustpilot: 3.6,
    g2ReviewCount: 520,
    capterraReviewCount: 310,
    trustpilotReviewCount: 890,
    g2Url: "https://www.g2.com/products/zoho-mail/reviews",
    capterraUrl: "https://www.capterra.com/p/19752/Zoho-Mail/",
    trustpilotUrl: "https://www.trustpilot.com/review/zoho.com",
  },
  "Zoho Calendar": {
    g2: 4.3,
    capterra: 4.3,
    trustpilot: null,
    g2ReviewCount: 180,
    capterraReviewCount: 95,
    trustpilotReviewCount: null,
    g2Url: "https://www.g2.com/products/zoho-calendar/reviews",
    capterraUrl: "https://www.capterra.com/p/155840/Zoho-Calendar/",
    trustpilotUrl: "https://www.trustpilot.com/review/zoho.com",
  },
  "ZeptoMail": {
    g2: 4.5,
    capterra: 4.7,
    trustpilot: null,
    g2ReviewCount: 140,
    capterraReviewCount: 78,
    trustpilotReviewCount: null,
    g2Url: "https://www.g2.com/products/zeptomail/reviews",
    capterraUrl: "https://www.capterra.com/p/232567/ZeptoMail/",
    trustpilotUrl: "https://www.trustpilot.com/search?query=ZeptoMail",
  },
};

export function getRatings(keyword: string): ProductRatings | null {
  const key = Object.keys(KNOWN_RATINGS).find(
    (k) => k.toLowerCase() === keyword.toLowerCase(),
  );
  return key ? KNOWN_RATINGS[key] : null;
}
