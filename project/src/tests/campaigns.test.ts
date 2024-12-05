import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prisma } from '../lib/db';
import { createCampaign } from '../api/campaigns';
import { Response } from 'express';

describe('Campaign Features', () => {
  let testUserId: string;
  let mockCampaign: any;

  beforeEach(async () => {
    // Clear database in correct order
    await prisma.donation.deleteMany();  // Delete donations first
    await prisma.campaign.deleteMany();
    await prisma.user.deleteMany();

    // Create test user first
    const user = await prisma.user.create({
      data: {
        clerkId: `test-clerk-${Date.now()}`,
      }
    });
    testUserId = user.id;

    // Setup mock campaign with correct user ID
    mockCampaign = {
      title: 'Test Campaign',
      description: 'Test Description',
      goalAmount: '1000',
      deadline: new Date(Date.now() + 86400000),
      imageUrl: 'https://test.com/image.jpg',
      category: 'Technology',
      creatorAddress: '0x123...',
      contractAddress: '0x456...',
      transactionHash: '0x789...',
      creatorId: testUserId // Use the actual user ID
    };
  });

  it('should create a new campaign', async () => {
    const campaign = await prisma.campaign.create({
      data: mockCampaign
    });
    expect(campaign).toBeDefined();
    expect(campaign.title).toBe(mockCampaign.title);
  });

  it('should retrieve campaign details', async () => {
    const created = await prisma.campaign.create({
      data: mockCampaign
    });

    const found = await prisma.campaign.findUnique({
      where: { id: created.id }
    });

    expect(found).toBeDefined();
    expect(found?.title).toBe(mockCampaign.title);
  });

  it('should create a campaign using createCampaign function', async () => {
    const request = {
      body: {
        ...mockCampaign,
        creatorId: testUserId
      },
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    } as any;

    const mockJson = vi.fn();
    const mockStatus = vi.fn().mockReturnThis();
    const response = {
      json: mockJson,
      status: mockStatus
    } as unknown as Response;

    await createCampaign(request, response);

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalled();
    const [campaignData] = mockJson.mock.calls[0];
    expect(campaignData.title).toBe(mockCampaign.title);
  });
}); 