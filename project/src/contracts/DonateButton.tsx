import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface DonateButtonProps {
  campaignId: string;
}

export const DonateButton: React.FC<DonateButtonProps> = ({ campaignId }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { donateToCampaign } = useWeb3();
  const { isConnected } = useSelector((state: RootState) => state.wallet);

  const handleDonate = async () => {
    if (!amount || !isConnected) return;

    try {
      setIsLoading(true);
      await donateToCampaign(campaignId, amount);
      setAmount('');
    } catch (error) {
      console.error('Error donating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">Connect your wallet to support this campaign</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in ETH"
        label="Donation Amount"
        disabled={isLoading}
        min="0"
        step="0.01"
      />
      <Button
        onClick={handleDonate}
        disabled={!amount || isLoading}
        isLoading={isLoading}
        className="w-full"
      >
        Support Campaign
      </Button>
    </div>
  );
};