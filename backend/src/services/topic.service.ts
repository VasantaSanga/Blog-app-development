/**
 * Topic Service
 * Business logic for topic operations
 */

import { Prisma, Difficulty } from '@prisma/client';
import prisma from '../config/prisma.js';
import type { CreateTopicInput, UpdateTopicInput } from '../types/index.js';

class TopicService {
  /**
   * Get all topics with filtering
   */
  async getTopics(options: {
    category?: string;
    difficulty?: string;
    search?: string;
  }) {
    const where: Prisma.TopicWhereInput = { isActive: true };

    if (options.category) {
      where.categoryId = options.category;
    }

    if (options.difficulty) {
      where.difficulty = options.difficulty.toUpperCase();
    }

    if (options.search) {
      where.OR = [
        { title: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const topics = await prisma.topic.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true, color: true, icon: true },
        },
      },
      orderBy: [{ usageCount: 'desc' }, { createdAt: 'desc' }],
    });

    return topics;
  }

  /**
   * Get topic by ID
   */
  async getTopic(id: string) {
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true, color: true, icon: true },
        },
      },
    });

    if (!topic) {
      throw { statusCode: 404, message: 'Topic not found' };
    }

    return topic;
  }

  /**
   * Get random topics
   */
  async getRandomTopics(count: number = 5) {
    const allTopics = await prisma.topic.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: { id: true, name: true, slug: true, color: true, icon: true },
        },
      },
    });

    // Shuffle and take random items
    const shuffled = allTopics.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Create topic
   */
  async createTopic(input: CreateTopicInput) {
    const topic = await prisma.topic.create({
      data: {
        title: input.title,
        description: input.description || '',
        categoryId: input.category,
        difficulty: (input.difficulty?.toUpperCase() as Difficulty) || 'INTERMEDIATE',
        suggestedTags: input.suggestedTags || [],
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true, color: true, icon: true },
        },
      },
    });

    return topic;
  }

  /**
   * Update topic
   */
  async updateTopic(id: string, input: UpdateTopicInput) {
    const updateData: Prisma.TopicUpdateInput = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.category !== undefined) updateData.categoryId = input.category;
    if (input.difficulty !== undefined) updateData.difficulty = input.difficulty.toUpperCase();
    if (input.suggestedTags !== undefined) updateData.suggestedTags = input.suggestedTags;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;

    const topic = await prisma.topic.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true, slug: true, color: true, icon: true },
        },
      },
    });

    return topic;
  }

  /**
   * Delete topic
   */
  async deleteTopic(id: string) {
    await prisma.topic.delete({
      where: { id },
    });
  }
}

export const topicService = new TopicService();
export default topicService;
