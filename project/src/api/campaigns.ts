import { prisma } from '../lib/db';
import { Request, Response } from 'express';

export async function createCampaign(req: Request, res: Response) {
  try {
    const { title, description, goalAmount, deadline, imageUrl, category, creatorAddress, contractAddress, transactionHash, creatorId } = req.body;
    
    // Validate the data
    if (!title || !description || !goalAmount || !deadline || !creatorAddress || !contractAddress || !transactionHash || !creatorId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Store in database
    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        goalAmount,
        deadline: new Date(Number(deadline)),
        imageUrl,
        category,
        creatorAddress,
        contractAddress,
        transactionHash,
        status: 'active',
        creatorId,
      },
    });

    return res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    return res.status(500).json({ error: 'Failed to create campaign' });
  }
} 