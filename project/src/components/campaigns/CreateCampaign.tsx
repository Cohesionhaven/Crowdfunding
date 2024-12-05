import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../hooks/useWeb3';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { Loader2 } from 'lucide-react';
import { CampaignFormData, CategoryType, Campaign } from '../../types/campaign';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { addCampaign } from '../../store/slices/campaignSlice';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/Select';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const { createCampaign } = useWeb3();
  const { isConnected } = useSelector((state: RootState) => state.wallet);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    description: '',
    goalAmount: '',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    imageUrl: '',
    category: 'other',
  });
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const goalAmountInWei = ethers.parseEther(formData.goalAmount.toString());
      const deadlineTimestamp = Math.floor(formData.deadline.getTime() / 1000);

      const result = await createCampaign(
        formData.title,
        formData.description,
        goalAmountInWei.toString(),
        deadlineTimestamp,
        formData.category
      );

      console.log('Campaign Creation Result:', result);
      toast.success('Campaign Created Successfully!');
      dispatch(addCampaign({
        ...formData,
        id: result.campaignId,
        creatorAddress: result.creator,
        contractAddress: result.campaignAddress,
        transactionHash: result.transactionHash,
        raised: '0',
        status: 'active' as const,
        donors: [],
        category: formData.category || 'other'
      } as Campaign));
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Campaign Creation Error:', error);
      toast.error(error.message || 'Campaign creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Create a New Campaign</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Campaign Title
          </label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Describe your campaign..."
          />
        </div>

        <div>
          <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Goal Amount (ETH)
          </label>
          <Input
            type="number"
            id="goalAmount"
            name="goalAmount"
            value={formData.goalAmount}
            onChange={handleChange}
            required
            step="0.01"
            className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <Input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline.toISOString().split('T')[0]}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <Select 
            value={formData.category} 
            onValueChange={(value: CategoryType) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select a category</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="art">Art</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="film">Film</SelectItem>
              <SelectItem value="games">Games</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Campaign Image URL
          </label>
          <Input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2 inline" />
              Creating Campaign...
            </>
          ) : (
            'Create Campaign'
          )}
        </Button>
      </form>
    </motion.div>
  );
};

