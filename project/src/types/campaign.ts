export interface Campaign {
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
  creator: string;
  imageUrl?: string;
}

export interface CampaignFormData {
  title: string;
  description: string;
  goalAmount: string;
  deadline: Date;
  imageUrl: string;
  category: 
    | 'technology' 
    | 'art' 
    | 'music' 
    | 'film' 
    | 'games' 
    | 'other';
}