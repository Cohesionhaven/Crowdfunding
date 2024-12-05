import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../hooks/useWeb3';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { Loader2 } from 'lucide-react';
import { CampaignFormData, CategoryType } from '../../types/campaign';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { addCampaign } from '../../store/slices/campaignSlice';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

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
        category: formData.category as CategoryType
      }));
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Campaign Creation Error:', error);
      toast.error(error.message || 'Campaign creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Create a New Campaign
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={cn(
              "mt-1 w-full",
              "bg-white dark:bg-gray-700",
              "text-gray-900 dark:text-white",
              "border-gray-300 dark:border-gray-600"
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className={cn(
              "mt-1 w-full",
              "bg-white dark:bg-gray-700",
              "text-gray-900 dark:text-white",
              "border-gray-300 dark:border-gray-600"
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Goal Amount (ETH)
          </label>
          <Input
            type="number"
            name="goalAmount"
            value={formData.goalAmount}
            onChange={handleChange}
            required
            step="0.01"
            className={cn(
              "mt-1 w-full",
              "bg-white dark:bg-gray-700",
              "text-gray-900 dark:text-white",
              "border-gray-300 dark:border-gray-600"
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <Input
            type="date"
            name="deadline"
            value={formData.deadline.toISOString().split('T')[0]}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className={cn(
              "mt-1 w-full",
              "bg-white dark:bg-gray-700",
              "text-gray-900 dark:text-white",
              "border-gray-300 dark:border-gray-600"
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <Select value={formData.category} onValueChange={(value: CategoryType) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className={cn(
              "mt-1 w-full",
              "bg-white dark:bg-gray-700",
              "text-gray-900 dark:text-white",
              "border-gray-300 dark:border-gray-600"
            )}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Campaign Image URL
          </label>
          <Input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className={cn(
              "mt-1 w-full",
              "bg-white dark:bg-gray-700",
              "text-gray-900 dark:text-white",
              "border-gray-300 dark:border-gray-600"
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full",
            "bg-indigo-600 hover:bg-indigo-700",
            "dark:bg-indigo-500 dark:hover:bg-indigo-600",
            "text-white font-medium"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
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

