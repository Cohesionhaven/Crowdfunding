import { Campaign } from '../types/campaign';

const CAMPAIGNS_STORAGE_KEY = 'campaigns';

export const campaignService = {
  saveCampaigns(campaigns: Campaign[]) {
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
  },

  getCampaigns(): Campaign[] {
    const stored = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}; 