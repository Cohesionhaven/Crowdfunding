import React, { useState } from 'react';
import { useWeb3 } from '../../hooks/useWeb3';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Wallet, CreditCard, Banknote } from 'lucide-react';

interface PaymentOptionsProps {
  campaignId: string;
  onSuccess?: () => void;
}

type PaymentMethod = 'crypto' | 'paypal' | 'upi';

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({ campaignId, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('crypto');
  const [upiId, setUpiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { donateToCampaign } = useWeb3();
  const { isConnected } = useSelector((state: RootState) => state.wallet);

  const handlePayment = async () => {
    if (!amount) return;
    
    setIsLoading(true);
    try {
      switch (selectedMethod) {
        case 'crypto':
          if (!isConnected) {
            throw new Error('Please connect your wallet first');
          }
          await donateToCampaign(campaignId, amount);
          break;
          
        case 'paypal':
          // Initialize PayPal payment
          window.open(`https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${campaignId}&amount=${amount}&currency_code=USD`);
          break;
          
        case 'upi':
          if (!upiId) {
            throw new Error('Please enter UPI ID');
          }
          // Generate UPI payment link
          const upiLink = `upi://pay?pa=${upiId}&pn=Campaign%20Donation&am=${amount}&cu=INR`;
          window.location.href = upiLink;
          break;
      }
      
      onSuccess?.();
      setAmount('');
      setUpiId('');
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Button
            type="button"
            variant={selectedMethod === 'crypto' ? 'primary' : 'outline'}
            onClick={() => setSelectedMethod('crypto')}
            className="flex flex-col items-center p-4"
          >
            <Wallet className="h-6 w-6 mb-2" />
            <span>Crypto</span>
          </Button>
          
          <Button
            type="button"
            variant={selectedMethod === 'paypal' ? 'primary' : 'outline'}
            onClick={() => setSelectedMethod('paypal')}
            className="flex flex-col items-center p-4"
          >
            <CreditCard className="h-6 w-6 mb-2" />
            <span>PayPal</span>
          </Button>
          
          <Button
            type="button"
            variant={selectedMethod === 'upi' ? 'primary' : 'outline'}
            onClick={() => setSelectedMethod('upi')}
            className="flex flex-col items-center p-4"
          >
            <Banknote className="h-6 w-6 mb-2" />
            <span>UPI</span>
          </Button>
        </div>

        <div className="space-y-4">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Amount in ${selectedMethod === 'crypto' ? 'ETH' : 'USD'}`}
            label="Donation Amount"
            min="0"
            step="0.01"
          />

          {selectedMethod === 'upi' && (
            <Input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="Enter UPI ID"
              label="UPI ID"
            />
          )}

          <Button
            onClick={handlePayment}
            disabled={!amount || (selectedMethod === 'upi' && !upiId) || isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Donate Now'}
          </Button>
        </div>

        {selectedMethod === 'crypto' && !isConnected && (
          <p className="text-sm text-center text-gray-600">
            Please connect your wallet to make a crypto donation
          </p>
        )}
      </CardContent>
    </Card>
  );
};