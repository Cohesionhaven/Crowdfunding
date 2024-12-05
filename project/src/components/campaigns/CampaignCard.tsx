import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Calendar, Target } from 'lucide-react';
import { ethers } from 'ethers';

interface CampaignCardProps {
  campaign: {
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
    imageUrl?: string;
    creator?: string;
  };
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <Link to={`/campaign/${campaign.id}`}>
      <Card>
        <img
          src={campaign.imageUrl || '/default-campaign-image.jpg'}
          alt={campaign.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
              {campaign.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(campaign.deadline).toLocaleDateString()}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">{campaign.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
          
          <div className="space-y-3">
            <Progress value={parseFloat(campaign.raisedAmount)} max={parseFloat(campaign.goalAmount)} />
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Target className="w-4 h-4 mr-1" />
                <span>{ethers.formatEther(campaign.goalAmount)} ETH goal</span>
              </div>
              <span className="font-medium text-indigo-600">
                {ethers.formatEther(campaign.raisedAmount)} ETH raised
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};