export interface Campaign {
  id: string;
  title: string;
  description: string;
  goalAmount: string;
  deadline: Date;
  category: CategoryType;
  creatorAddress: string;
  contractAddress: string;
  transactionHash: string;
  status: 'active' | 'completed' | 'failed';
  raised: string;
  donors: string[];
  imageUrl?: string;
}

export type CategoryType = "technology" | "art" | "music" | "film" | "games" | "other";

export interface CampaignFormData {
  title: string;
  description: string;
  goalAmount: string;
  deadline: Date;
  imageUrl: string;
  category: CategoryType | "";
}