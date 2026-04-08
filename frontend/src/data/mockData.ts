// Platform stats — pulled from backend/blockchain at runtime.
// These are the honest launch values. Real counts will replace them via API.

export const PLATFORM_STATS = {
  totalReports: 0,
  resolvedReports: 0,
  activeReports: 0,
  escalatedReports: 0,
  totalDonations: "0",
  totalDonationsUSD: "0",
  activeDAOMembers: 0,
  totalVotes: 0,
  countriesServed: 0,
  organizationsInvestigated: 0,
  averageResolutionTime: "—",
  successRate: "—",
  communityTrustScore: "—"
};

// No seeded reports — this list is populated from the backend API.
export const RECENT_REPORTS: {
  id: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  country: string;
  submittedAt: string;
  votesFor: number;
  votesAgainst: number;
  estimatedImpact: string;
  isSponsored: boolean;
  resolvedAt?: string;
}[] = [];

// Populated from the backend API — no seeded donors.
export const TOP_DONORS: {
  id: string;
  displayName: string;
  tier: string;
  totalDonated: string;
  reportsSponsored: number;
  joinedAt: string;
  isAnonymous: boolean;
}[] = [];

// Populated from the DAO smart contract — no seeded proposals.
export const DAO_PROPOSALS: {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  endsAt: string;
  proposer: string;
}[] = [];

export const DONATION_TIERS = [
  {
    name: "Supporter",
    minAmount: 1,
    maxAmount: 10,
    benefits: [
      "Community member badge",
      "Access to public reports",
      "Voting rights in DAO"
    ],
    color: "from-accent-dark to-accent-mid",
    icon: "👥"
  },
  {
    name: "Advocate", 
    minAmount: 11,
    maxAmount: 50,
    benefits: [
      "All Supporter benefits",
      "Priority support",
      "Early access to features",
      "Enhanced voting weight"
    ],
    color: "from-green-500 to-green-600",
    icon: "🗣️"
  },
  {
    name: "Guardian",
    minAmount: 51,
    maxAmount: 100,
    benefits: [
      "All Advocate benefits",
      "Sponsor 5 reports monthly",
      "Access to detailed analytics",
      "Community moderator privileges"
    ],
    color: "from-accent-dark to-accent-mid", 
    icon: "🛡️"
  },
  {
    name: "Champion",
    minAmount: 100,
    maxAmount: null,
    benefits: [
      "All Guardian benefits",
      "Unlimited report sponsorship",
      "Direct line to development team",
      "Platform governance influence",
      "Recognition on leaderboard"
    ],
    color: "from-yellow-500 to-orange-500",
    icon: "👑"
  }
];

export const IMPACT_METRICS = [
  {
    title: "Corruption Cases Exposed",
    value: "0",
    change: null,
    trend: "up",
    description: "Cases that led to investigations"
  },
  {
    title: "Funds Recovered",
    value: "$0",
    change: null,
    trend: "up",
    description: "Estimated funds recovered through reports"
  },
  {
    title: "Organizations Reformed",
    value: "0",
    change: null,
    trend: "up",
    description: "Organizations that implemented changes"
  },
  {
    title: "Whistleblowers Protected",
    value: "0",
    change: null,
    trend: "up",
    description: "Anonymous reports submitted safely"
  }
];

// Populated from the backend API — no seeded coverage data.
export const GLOBAL_COVERAGE: { country: string; reports: number; flag: string }[] = [];

// No fabricated testimonials — real ones will appear here once submitted by actual users.
export const TESTIMONIALS: {
  id: string;
  text: string;
  role: string;
  country: string;
  verified: boolean;
}[] = [];

// Marketing copy for different sections
export const MARKETING_COPY = {
  hero: {
    title: "Speak Safely, Stay Secure",
    subtitle: "The world's first blockchain-powered anonymous whistleblowing platform with zero-knowledge privacy protection",
    cta: "Submit Anonymous Report"
  },
  stats: {
    title: "Making Real Impact",
    subtitle: "Our community is creating transparency and accountability worldwide"
  },
  features: {
    title: "Why Choose SpeakSafe?",
    subtitle: "Advanced technology meets social responsibility"
  }
};

// Returns live stats — call backend API to get real values.
export const getRealtimeStats = () => {
  return { ...PLATFORM_STATS };
};

// Function to get trending reports
export const getTrendingReports = () => {
  return RECENT_REPORTS.sort((a, b) => (b.votesFor - b.votesAgainst) - (a.votesFor - a.votesAgainst));
};
