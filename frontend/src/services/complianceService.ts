// GDPR and compliance service for SpeakSafe
export interface ConsentData {
  cookies: boolean;
  dataProcessing: boolean;
  analytics: boolean;
  timestamp: string;
}

export interface PrivacySettings {
  dataRetention: number; // days
  anonymousReporting: boolean;
  encryptionLevel: 'standard' | 'high';
}

const complianceService = {
  // Cookie consent management
  getCookieConsent: (): ConsentData | null => {
    const consent = localStorage.getItem('speaksafe_consent');
    return consent ? JSON.parse(consent) : null;
  },

  setCookieConsent: (consent: ConsentData): void => {
    localStorage.setItem('speaksafe_consent', JSON.stringify(consent));
  },

  // Privacy settings
  getPrivacySettings: (): PrivacySettings => {
    const settings = localStorage.getItem('speaksafe_privacy_settings');
    return settings ? JSON.parse(settings) : {
      dataRetention: 365,
      anonymousReporting: true,
      encryptionLevel: 'high'
    };
  },

  setPrivacySettings: (settings: PrivacySettings): void => {
    localStorage.setItem('speaksafe_privacy_settings', JSON.stringify(settings));
  },

  // GDPR data deletion request
  requestDataDeletion: async (userIdentifier: string): Promise<boolean> => {
    try {
      // This would call the backend API to initiate data deletion
      console.log('Requesting data deletion for:', userIdentifier);
      // Placeholder for actual API call
      return true;
    } catch (error) {
      console.error('Data deletion request failed:', error);
      return false;
    }
  },

  // Check if user has given required consents
  hasRequiredConsents: (): boolean => {
    const consent = complianceService.getCookieConsent();
    return consent !== null && consent.dataProcessing;
  },

  // Clear all local data (for privacy)
  clearAllLocalData: (): void => {
    localStorage.removeItem('speaksafe_consent');
    localStorage.removeItem('speaksafe_privacy_settings');
    localStorage.removeItem('speaksafe_user_data');
    sessionStorage.clear();
  }
};

export default complianceService;
