// SpeakSafe Intelligent Chatbot Service
// Provides contextual answers about the platform with smart fallback responses

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  category?: string;
}

export interface ChatbotResponse {
  text: string;
  category: string;
  confidence: number;
  suggestedActions?: Array<{
    label: string;
    action: string;
  }>;
}

class ChatbotService {
  private knowledgeBase = {
    // Platform Overview
    platform: {
      keywords: ['what is', 'about', 'speaksafe', 'platform', 'overview', 'purpose'],
      responses: [
        "SpeakSafe is an anonymous whistleblowing platform that uses blockchain technology and zero-knowledge proofs to protect your identity while reporting corruption, fraud, and misconduct.",
        "We're a decentralized platform that ensures complete anonymity for whistleblowers through advanced cryptographic technology.",
        "SpeakSafe combines blockchain security with community governance to create the safest way to expose wrongdoing."
      ]
    },

    // Privacy & Security
    privacy: {
      keywords: ['anonymous', 'privacy', 'secure', 'identity', 'protection', 'safe', 'confidential'],
      responses: [
        "Your identity is protected through zero-knowledge proofs - we can verify your report without knowing who you are. Your personal information never touches our servers.",
        "We use end-to-end encryption and blockchain technology to ensure your reports are tamper-proof while keeping you completely anonymous.",
        "Our privacy-first design means even we can't identify you. Your anonymity is mathematically guaranteed."
      ]
    },

    // How It Works
    howItWorks: {
      keywords: ['how', 'work', 'process', 'submit', 'report', 'steps'],
      responses: [
        "Simply fill out our secure form, and your report is encrypted and stored on the blockchain. Our DAO community reviews and escalates important cases while your identity remains protected.",
        "1) Submit your report anonymously 2) Community reviews for validity 3) Verified reports get escalated to authorities 4) You stay completely protected throughout.",
        "Our process is simple: Report → Community Review → Escalation → Action. Your anonymity is preserved at every step."
      ]
    },

    // Donations & Community
    donations: {
      keywords: ['donate', 'donation', 'sponsor', 'community', 'fund', 'support', 'contribute'],
      responses: [
        "Community donations help sponsor free reports for people without crypto access. Every donation strengthens our mission to fight corruption globally.",
        "You can donate MATIC tokens to sponsor anonymous reports. This helps people without blockchain knowledge still access our platform safely.",
        "Our community sponsorship model ensures everyone can report corruption, regardless of their technical or financial situation."
      ]
    },

    // DAO Governance
    dao: {
      keywords: ['dao', 'governance', 'community', 'voting', 'decision', 'review'],
      responses: [
        "Our DAO (Decentralized Autonomous Organization) allows the community to democratically review reports and decide on escalations, ensuring no single entity controls the process.",
        "Community members vote on report validity and escalation decisions. This decentralized approach prevents censorship and ensures fair treatment.",
        "The DAO governance model means decisions are made collectively by the community, not by any central authority."
      ]
    },

    // Legal & Compliance
    legal: {
      keywords: ['legal', 'law', 'compliance', 'rights', 'whistleblower', 'protection'],
      responses: [
        "We provide comprehensive information about whistleblower rights in different regions and maintain full legal compliance across jurisdictions.",
        "Our platform includes detailed legal resources and connects you with whistleblower protection information for your region.",
        "We're designed to work within legal frameworks globally while providing maximum protection for reporters."
      ]
    },

    // Technical Questions
    technical: {
      keywords: ['blockchain', 'crypto', 'wallet', 'technical', 'zero-knowledge', 'encryption'],
      responses: [
        "We use Polygon blockchain for fast, low-cost transactions and zero-knowledge proofs for anonymous authentication. No technical knowledge required to use the platform.",
        "Our technical stack includes React frontend, Polygon blockchain, IPFS storage, and advanced cryptography - but it's all hidden behind a simple interface.",
        "The platform handles all the complex blockchain interactions automatically. You just need to fill out a form like any other website."
      ]
    },

    // Getting Started
    gettingStarted: {
      keywords: ['start', 'begin', 'first', 'new', 'help', 'guide'],
      responses: [
        "Getting started is easy! Just click 'Submit Report' and fill out our secure form. No registration or personal information required.",
        "New to the platform? Start by reading our 'How It Works' guide, then submit your first report through our simple form.",
        "Welcome! You can begin reporting immediately - no account needed. Just use our secure submission form and your report will be protected."
      ]
    }
  };

  private fallbackResponses = [
    "I'm here to help with questions about SpeakSafe! Could you rephrase your question or ask about our privacy features, reporting process, or community governance?",
    "I'd love to help you with that! I specialize in questions about anonymous reporting, blockchain security, and our DAO governance. What would you like to know?",
    "That's an interesting question! While I focus on SpeakSafe platform features, I can help you understand our privacy protection, donation system, or legal compliance. What aspect interests you most?",
    "I'm designed to help with SpeakSafe-related questions. I can explain our anonymous reporting process, community features, or security measures. What would you like to learn about?",
    "Great question! I'm your SpeakSafe assistant and I'm best at explaining our platform features, privacy protection, and how to get started. How can I help you with the platform?"
  ];

  private greetings = [
    "Hello! I'm your SpeakSafe assistant. I can help you understand our anonymous reporting platform, privacy features, and community governance. What would you like to know?",
    "Hi there! Welcome to SpeakSafe. I'm here to answer questions about secure whistleblowing, our blockchain technology, and how to protect your identity while reporting. How can I help?",
    "Welcome! I'm the SpeakSafe AI assistant. I can explain our anonymous reporting process, community donations, DAO governance, and privacy features. What interests you most?"
  ];

  // Analyze user input and find the best response
  analyzeQuery(userInput: string): ChatbotResponse {
    const input = userInput.toLowerCase().trim();
    
    // Handle greetings
    if (this.isGreeting(input)) {
      return {
        text: this.getRandomItem(this.greetings),
        category: 'greeting',
        confidence: 0.9,
        suggestedActions: [
          { label: "How does it work?", action: "how does speaksafe work" },
          { label: "Is it anonymous?", action: "how anonymous is the platform" },
          { label: "Submit a report", action: "how to submit report" }
        ]
      };
    }

    // Find best matching category
    let bestMatch = { category: '', confidence: 0 };
    
    for (const [category, data] of Object.entries(this.knowledgeBase)) {
      const confidence = this.calculateConfidence(input, data.keywords);
      if (confidence > bestMatch.confidence) {
        bestMatch = { category, confidence };
      }
    }

    // Return appropriate response based on confidence
    if (bestMatch.confidence > 0.3) {
      const categoryData = this.knowledgeBase[bestMatch.category as keyof typeof this.knowledgeBase];
      return {
        text: this.getRandomItem(categoryData.responses),
        category: bestMatch.category,
        confidence: bestMatch.confidence,
        suggestedActions: this.getSuggestedActions(bestMatch.category)
      };
    }

    // Fallback response for unknown queries
    return {
      text: this.getRandomItem(this.fallbackResponses),
      category: 'fallback',
      confidence: 0.1,
      suggestedActions: [
        { label: "Platform Overview", action: "what is speaksafe" },
        { label: "Privacy & Security", action: "how secure is speaksafe" },
        { label: "How to Report", action: "how to submit anonymous report" },
        { label: "Community Support", action: "how does donation system work" }
      ]
    };
  }

  private isGreeting(input: string): boolean {
    const greetingWords = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    return greetingWords.some(greeting => input.includes(greeting));
  }

  private calculateConfidence(input: string, keywords: string[]): number {
    let matches = 0;
    let totalKeywords = keywords.length;
    
    for (const keyword of keywords) {
      if (input.includes(keyword)) {
        matches++;
      }
    }
    
    return matches / totalKeywords;
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getSuggestedActions(category: string): Array<{label: string; action: string}> {
    const actionMap: Record<string, Array<{label: string; action: string}>> = {
      platform: [
        { label: "How does it work?", action: "how does the reporting process work" },
        { label: "Is it secure?", action: "how secure and anonymous is speaksafe" }
      ],
      privacy: [
        { label: "Submit a report", action: "how to submit anonymous report" },
        { label: "Learn about DAO", action: "what is dao governance" }
      ],
      howItWorks: [
        { label: "Start reporting", action: "how to get started with reporting" },
        { label: "Community features", action: "how does community governance work" }
      ],
      donations: [
        { label: "How to donate", action: "how to donate to support platform" },
        { label: "Sponsor reports", action: "how does report sponsorship work" }
      ]
    };

    return actionMap[category] || [
      { label: "Learn more", action: "tell me more about speaksafe" },
      { label: "Get started", action: "how to get started" }
    ];
  }

  // Generate a chat message
  createMessage(text: string, isBot: boolean = false, category?: string): ChatMessage {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      isBot,
      timestamp: new Date(),
      category
    };
  }

  // Process user message and return bot response
  async processMessage(userMessage: string): Promise<ChatMessage> {
    // Simulate thinking time for more natural interaction
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const response = this.analyzeQuery(userMessage);
    return this.createMessage(response.text, true, response.category);
  }
}

const chatbotService = new ChatbotService();
export default chatbotService;
