// ================= //
// Tracked Companies //
// ================= //

// The companies `scripts/sync-companies.ts` fetches data for. Each name must
// match its folder name exactly in the source repo — spacing and punctuation
// included (e.g. "J.P. Morgan", "X" for the company formerly known as Twitter):
//   https://github.com/liquidslr/leetcode-company-wise-problems
//
// To track a new company: add its exact folder name here, then run
//   pnpm --filter @leetbytes/problems run sync:companies
// and review the diff to company-tags.generated.ts before committing.
export const TRACKED_COMPANIES: string[] = [
  "Adobe",
  "Airbnb",
  "Amazon",
  "Apple",
  "Atlassian",
  "Bloomberg",
  "Coinbase",
  "Databricks",
  "DoorDash",
  "Dropbox",
  "eBay",
  "Expedia",
  "Goldman Sachs",
  "Google",
  "IBM",
  "Instacart",
  "Intel",
  "Intuit",
  "J.P. Morgan",
  "LinkedIn",
  "Meta",
  "Microsoft",
  "Netflix",
  "Nvidia",
  "Oracle",
  "Palantir Technologies",
  "PayPal",
  "Pinterest",
  "Qualcomm",
  "Roblox",
  "Robinhood",
  "Salesforce",
  "Samsung",
  "SAP",
  "ServiceNow",
  "Shopify",
  "Snap",
  "Snowflake",
  "Spotify",
  "Stripe",
  "Tesla",
  "TikTok",
  "Twilio",
  "Uber",
  "Visa",
  "Walmart Labs",
  "Wayfair",
  "X",
  "Yahoo",
  "Yelp",
  "Zillow",
];
