import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useDispatch } from 'react-redux';
import { setWalletAddress, setChainId } from '../store/slices/walletSlice';
import { CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS } from '../contracts/CrowdfundingContract';
import { addCampaign } from '../store/slices/campaignsSlice';

export const useWeb3 = () => {
  const dispatch = useDispatch();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        const contract = new ethers.Contract(
          CROWDFUNDING_CONTRACT_ADDRESS,
          CROWDFUNDING_ABI,
          provider
        );
        setContract(contract);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          dispatch(setWalletAddress(accounts[0] || null));
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId: string) => {
          dispatch(setChainId(parseInt(chainId)));
          window.location.reload();
        });
      }
    };

    initWeb3();
  }, [dispatch]);

  const connectWallet = async () => {
    if (!provider) return;
    try {
      const accounts = await window.ethereum?.request({
        method: 'eth_requestAccounts',
      });
      dispatch(setWalletAddress(accounts?.[0]));
      const chainId = await window.ethereum?.request({
        method: 'eth_chainId',
      });
      dispatch(setChainId(parseInt(chainId)));
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const donateToCampaign = async (campaignId: string, amount: string) => {
    if (!contract || !provider) throw new Error('Web3 not initialized');

    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer) as any;
      
      const tx = await contractWithSigner.donate(campaignId, {
        value: ethers.parseEther(amount)
      });
      
      return await tx.wait();
    } catch (error) {
      console.error('Error donating to campaign:', error);
      throw error;
    }
  };

  const createCampaign = async (title: string, description: string, goal: string, durationInDays: number, category: string) => {
    if (!window.ethereum) throw new Error('No Ethereum provider found');

    // Validate input parameters
    if (!title || !description || !goal || !durationInDays || !category) {
      throw new Error('Missing required parameters for campaign creation');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Debug contract setup
      console.log('Contract setup:', {
        address: CROWDFUNDING_CONTRACT_ADDRESS,
        abi: CROWDFUNDING_ABI,
        params: { title, description, goal, durationInDays, category }
      });

      // Create contract instance
      const contractInstance = new ethers.Contract(
        CROWDFUNDING_CONTRACT_ADDRESS,
        CROWDFUNDING_ABI,
        signer
      );

      if (!contractInstance || !contractInstance.createCampaign) {
        throw new Error('Contract not properly initialized');
      }

      // Format parameters
      const campaignParams = {
        title: title.trim(),
        description: description.trim(),
        goalAmount: ethers.parseEther(goal.toString()),
        duration: Math.floor(durationInDays * 24 * 60 * 60),
        category: category.trim()
      };

      console.log('Sending transaction with params:', campaignParams);

      // Send transaction
      const tx = await contractInstance.createCampaign(
        campaignParams.title,
        campaignParams.description,
        campaignParams.goalAmount,
        campaignParams.duration,
        campaignParams.category,
        { gasLimit: 3000000 }
      );

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Add campaign to Redux store
      const newCampaign = {
        id: receipt.hash,
        title: campaignParams.title,
        description: campaignParams.description,
        goalAmount: goal,
        deadline: new Date(Date.now() + (durationInDays * 24 * 60 * 60 * 1000)),
        category: campaignParams.category,
        creatorAddress: await signer.getAddress(),
        creator: await signer.getAddress(),
        contractAddress: CROWDFUNDING_CONTRACT_ADDRESS,
        transactionHash: receipt.hash,
        status: 'active',
        raisedAmount: '0',
        imageUrl: '/default-campaign-image.jpg'
      };

      dispatch(addCampaign(newCampaign));
      return receipt;
    } catch (error: any) {
      console.error('Contract Error:', {
        message: error.message,
        code: error.code,
        data: error.data
      });
      throw new Error('Failed to create campaign: ' + (error.message || error));
    }
  };

  return {
    provider,
    contract,
    connectWallet,
    donateToCampaign,
    createCampaign
  };
};