import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Campaign } from '../../types/campaign';
import { campaignService } from '../../services/campaignService';

const initialState = {
  campaigns: campaignService.getCampaigns(),
  loading: false,
  error: null as string | null,
};

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.push(action.payload);
      campaignService.saveCampaigns(state.campaigns);
    },
    setCampaigns: (state, action: PayloadAction<Campaign[]>) => {
      state.campaigns = action.payload;
      campaignService.saveCampaigns(state.campaigns);
    },
    // ... other reducers
  },
});

export const { addCampaign } = campaignSlice.actions;
export default campaignSlice.reducer; 