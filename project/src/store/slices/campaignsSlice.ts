import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goalAmount: string;
  deadline: Date;
  category: string;
  creatorAddress: string;
  contractAddress: string;
  transactionHash: string;
  status: string;
  raisedAmount: string;
  creator?: string;
  imageUrl?: string;
}

interface CampaignsState {
  campaigns: Campaign[];
  loading: boolean;
  error: null | string;
}

const initialState: CampaignsState = {
  campaigns: [],
  loading: false,
  error: null
};

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.push(action.payload);
    }
  }
});

export const { addCampaign } = campaignsSlice.actions;
export default campaignsSlice.reducer;