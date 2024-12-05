import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '../lib/db';
import { createDonation } from '../api/donations';
import { Response } from 'express';

describe('Donation Features', () => {
  let testUserId: string;
  let testCampaignId: string;
  let mockDonation: any;

  beforeEach(async () => {
    const timestamp = Date.now();
    
    // Clear in correct order
    await prisma.donation.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.user.deleteMany();
    
    // Create test user first
    const user = await prisma.user.create({
      data: {
        clerkId: `test-clerk-${timestamp}`
      }
    });
    testUserId = user.id;

    // Create test campaign with valid creatorId
    const campaign = await prisma.campaign.create({
      data: {
        title: 'Test Campaign',
        description: 'Test Description',
        goalAmount: '1000',
        deadline: new Date(Date.now() + 86400000),
        imageUrl: 'https://test.com/image.jpg',
        category: 'Technology',
        creatorAddress: '0x123...',
        contractAddress: '0x456...',
        transactionHash: '0x789...',
        creatorId: testUserId,
        status: 'active'
      }
    });
    testCampaignId = campaign.id;
    
    // Setup mock donation with valid IDs
    mockDonation = {
      amount: '100',
      campaignId: testCampaignId,
      donorId: testUserId,
      txHash: `0xabc-${timestamp}`
    };
  });

  it('should create a donation', async () => {
    const donation = await prisma.donation.create({
      data: mockDonation
    });

    expect(donation).toBeDefined();
    expect(donation.amount).toBe(mockDonation.amount);
  });

  it('should update campaign raised amount after donation', async () => {
    const request = {
      body: mockDonation,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    } as any;

    const response = {
      status: () => response,
      json: (data: any) => data
    } as unknown as Response;

    const result = await createDonation(request, response);
    
    const campaign = await prisma.campaign.findUnique({
      where: { id: mockDonation.campaignId }
    });

    expect(campaign?.raisedAmount).toBe(mockDonation.amount);
  });
}); 