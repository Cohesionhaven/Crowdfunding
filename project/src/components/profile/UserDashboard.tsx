import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { CampaignCard } from '../campaigns/CampaignCard';
import { Wallet, TrendingUp, Users } from 'lucide-react';
import { ethers } from 'ethers';

export const UserDashboard: React.FC = () => {
  const { user } = useUser();

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${user?.id}/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: !!user?.id,
  });

  const { data: campaigns, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['user-campaigns', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${user?.id}/campaigns`);
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      return response.json();
    },
    enabled: !!user?.id,
  });

  if (isLoadingStats || isLoadingCampaigns) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Raised</p>
                <p className="text-2xl font-bold">
                  {ethers.formatEther(stats?.totalRaised || '0')} ETH
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold">{stats?.activeCampaigns || 0}</p>
              </div>
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold">{stats?.totalDonations || 0}</p>
              </div>
              <Wallet className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Your Campaigns</h2>
        </CardHeader>
        <CardContent>
          {campaigns?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">
              You haven't created any campaigns yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};