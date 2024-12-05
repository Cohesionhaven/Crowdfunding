import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../hooks/useWeb3';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Loader2 } from 'lucide-react';
import { CampaignFormData } from '../../types/campaign';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

export const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const { createCampaign } = useWeb3();
  const { isConnected } = useSelector((state: RootState) => state.wallet);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    description: '',
    goalAmount: '',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    imageUrl: '',
    category: 'other',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Detailed Logging
    console.group('Campaign Creation Debug');
    console.log('Form Data:', formData);
    console.log('Is Wallet Connected:', isConnected);
    console.log('Goal Amount:', formData.goalAmount);
    console.log('Deadline:', formData.deadline);
    console.groupEnd();

    // Validation Checks
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Explicit Type Conversion
      const goalAmountInWei = ethers.parseEther(formData.goalAmount.toString());
      const deadlineTimestamp = Math.floor(formData.deadline.getTime() / 1000);

      console.log('Processed Parameters:', {
        title: formData.title,
        description: formData.description,
        goalAmountInWei: goalAmountInWei.toString(),
        deadlineTimestamp,
        category: formData.category
      });

      const result = await createCampaign(
        formData.title,
        formData.description,
        goalAmountInWei.toString(),
        deadlineTimestamp,
        formData.category
      );

      console.log('Campaign Creation Result:', result);
      toast.success('Campaign Created Successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Detailed Campaign Creation Error:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        name: error.name
      });
      toast.error(error.message || 'Campaign creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Additional Validation Function

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Create a New Campaign</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Goal Amount (ETH)</label>
          <input
            type="number"
            name="goalAmount"
            value={formData.goalAmount}
            onChange={handleChange}
            required
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline.toISOString().split('T')[0]}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a category</option>
            <option value="technology">Technology</option>
            <option value="art">Art</option>
            <option value="music">Music</option>
            <option value="film">Film</option>
            <option value="games">Games</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Creating Campaign...
            </>
          ) : (
            'Create Campaign'
          )}
        </button>
      </form>
    </div>
  );
};