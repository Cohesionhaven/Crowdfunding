import { prisma } from '../lib/db';
import { Request, Response } from 'express';

export async function createDonation(req: Request, res: Response) {
  try {
    const { amount, campaignId, donorId, txHash } = req.body;
    
    if (!amount || !campaignId || !donorId || !txHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create the donation
      const donation = await tx.donation.create({
        data: {
          amount,
          campaignId,
          donorId,
          txHash
        }
      });

      // Update campaign's raised amount
      const campaign = await tx.campaign.update({
        where: { id: campaignId },
        data: {
          raisedAmount: String(Number(amount))
        }
      });

      return { donation, campaign };
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating donation:', error);
    return res.status(500).json({ error: 'Failed to create donation' });
  }
} 