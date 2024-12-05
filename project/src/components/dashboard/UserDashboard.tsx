import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Campaign } from '../../types/campaign';
import { CampaignCard } from '../campaigns/CampaignCard';
import { Loader2 } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { campaigns } = useSelector((state: RootState) => state.campaigns);
  const { address } = useSelector((state: RootState) => state.wallet);

  const userCampaigns = address 
    ? campaigns.filter(campaign => 
        campaign.creator?.toLowerCase() === address.toLowerCase()
      )
    : [];

  if (!address) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Please connect your wallet to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Campaigns</h2>
        {userCampaigns.length === 0 ? (
          <p className="text-gray-600">You haven't created any campaigns yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};