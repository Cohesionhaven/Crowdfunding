import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../store/store';
import { PaymentOptions } from '../payments/PaymentOptions';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Calendar, Target, User, Clock, Share2, Heart } from 'lucide-react';
import { ethers } from 'ethers';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';

export const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { campaigns } = useSelector((state: RootState) => state.campaigns);
  const campaign = campaigns.find(c => c.id === id);

  if (!campaign) {
    return (
      <motion.div
        className="flex justify-center items-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center text-gray-500">Campaign not found</div>
      </motion.div>
    );
  }

  const progress = parseFloat(campaign.raisedAmount) / parseFloat(campaign.goalAmount) * 100;
  const daysLeft = Math.max(0, Math.ceil((campaign.deadline * 1000 - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card>
        <motion.img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="w-full h-96 object-cover rounded-t-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
        
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <motion.span
              className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {campaign.category}
            </motion.span>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              {new Date(campaign.deadline * 1000).toLocaleDateString()}
            </div>
          </div>
          
          <motion.h1
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {campaign.title}
          </motion.h1>
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            Created by {campaign.creator}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              className="p-4 bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center text-gray-600 mb-2">
                <Target className="w-5 h-5 mr-2" />
                Goal Amount
              </div>
              <div className="text-2xl font-bold">
                {ethers.formatEther(campaign.goalAmount)} ETH
              </div>
            </motion.div>
            
            <motion.div
              className="p-4 bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center text-gray-600 mb-2">
                <Clock className="w-5 h-5 mr-2" />
                Time Remaining
              </div>
              <div className="text-2xl font-bold">
                {daysLeft} days left
              </div>
            </motion.div>
            
            <motion.div
              className="p-4 bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center text-gray-600 mb-2">
                <div className="w-5 h-5 mr-2">🎯</div>
                Progress
              </div>
              <div className="text-2xl font-bold">
                {Math.round(progress)}%
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <Progress 
              value={parseFloat(campaign.raisedAmount)} 
              max={parseFloat(campaign.goalAmount)}
              label="Campaign Progress"
              showPercentage
            />

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="backers">Backers</TabsTrigger>
              </TabsList>
              <TabsContent value="about">
                <motion.div
                  className="bg-gray-50 rounded-lg p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-xl font-semibold mb-4">About this campaign</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{campaign.description}</p>
                </motion.div>
              </TabsContent>
              <TabsContent value="updates">
                <motion.div
                  className="bg-gray-50 rounded-lg p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-xl font-semibold mb-4">Campaign Updates</h3>
                  <p className="text-gray-600">No updates yet. Check back soon!</p>
                </motion.div>
              </TabsContent>
              <TabsContent value="backers">
                <motion.div
                  className="bg-gray-50 rounded-lg p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-xl font-semibold mb-4">Campaign Backers</h3>
                  <p className="text-gray-600">Be the first to support this campaign!</p>
                </motion.div>
              </TabsContent>
            </Tabs>

            <motion.div
              className="bg-gray-50 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-4">Support this campaign</h3>
              <PaymentOptions campaignId={campaign.id} />
            </motion.div>

            <div className="flex justify-between items-center">
              <Button variant="outline" className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Save
              </Button>
              <Button variant="outline" className="flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

