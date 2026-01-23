/**
 * Database Seed Script
 * Seeds initial categories and topics
 */

import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

interface CategoryData {
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface TopicData {
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  suggestedTags: string[];
}

const categories: CategoryData[] = [
  {
    name: 'Technology',
    description: 'Tech news, programming, and digital innovation',
    color: '#3b82f6',
    icon: 'computer',
  },
  {
    name: 'Lifestyle',
    description: 'Personal development, health, and daily life',
    color: '#10b981',
    icon: 'self_improvement',
  },
  {
    name: 'Business',
    description: 'Entrepreneurship, marketing, and finance',
    color: '#f59e0b',
    icon: 'business',
  },
  {
    name: 'Travel',
    description: 'Adventures, destinations, and travel tips',
    color: '#8b5cf6',
    icon: 'flight',
  },
  {
    name: 'Food & Recipes',
    description: 'Cooking, recipes, and culinary adventures',
    color: '#ef4444',
    icon: 'restaurant',
  },
  {
    name: 'Science',
    description: 'Scientific discoveries and research',
    color: '#06b6d4',
    icon: 'science',
  },
];

const topicsByCategory: Record<string, TopicData[]> = {
  Technology: [
    {
      title: 'Building Your First REST API with Node.js and Express',
      description:
        'A comprehensive guide to creating a REST API from scratch using Node.js and Express framework.',
      difficulty: 'BEGINNER',
      suggestedTags: ['nodejs', 'express', 'api', 'backend'],
    },
    {
      title: 'Understanding TypeScript: A Complete Guide for JavaScript Developers',
      description:
        'Learn how TypeScript enhances JavaScript development with static typing and better tooling.',
      difficulty: 'INTERMEDIATE',
      suggestedTags: ['typescript', 'javascript', 'programming'],
    },
    {
      title: 'The Future of AI in Web Development',
      description:
        'Explore how artificial intelligence is transforming the way we build and interact with websites.',
      difficulty: 'INTERMEDIATE',
      suggestedTags: ['ai', 'web development', 'future tech'],
    },
    {
      title: 'Docker for Beginners: Containerizing Your Applications',
      description:
        'Learn the basics of Docker and how to containerize your applications for consistent deployments.',
      difficulty: 'BEGINNER',
      suggestedTags: ['docker', 'devops', 'containers'],
    },
    {
      title: 'Microservices vs Monolithic Architecture: Making the Right Choice',
      description:
        'Compare microservices and monolithic architectures to determine the best approach for your project.',
      difficulty: 'ADVANCED',
      suggestedTags: ['architecture', 'microservices', 'system design'],
    },
  ],
  Lifestyle: [
    {
      title: '10 Morning Habits That Will Transform Your Productivity',
      description:
        'Discover morning routines and habits that successful people use to maximize their daily productivity.',
      difficulty: 'BEGINNER',
      suggestedTags: ['productivity', 'habits', 'morning routine'],
    },
    {
      title: 'The Art of Minimalism: Decluttering Your Life',
      description:
        'Learn how minimalism can bring more joy and focus to your life by removing excess.',
      difficulty: 'BEGINNER',
      suggestedTags: ['minimalism', 'lifestyle', 'organization'],
    },
    {
      title: 'Work-Life Balance in the Remote Work Era',
      description:
        'Strategies for maintaining boundaries and balance while working from home.',
      difficulty: 'INTERMEDIATE',
      suggestedTags: ['remote work', 'work-life balance', 'wellness'],
    },
  ],
  Business: [
    {
      title: 'Starting a Side Business While Working Full-Time',
      description:
        'A practical guide to launching and growing a side business without quitting your day job.',
      difficulty: 'INTERMEDIATE',
      suggestedTags: ['entrepreneurship', 'side hustle', 'business'],
    },
    {
      title: 'Digital Marketing Strategies for Small Businesses',
      description:
        'Effective and budget-friendly digital marketing tactics for small business owners.',
      difficulty: 'BEGINNER',
      suggestedTags: ['marketing', 'small business', 'digital marketing'],
    },
    {
      title: 'Understanding Venture Capital: A Founder Guide',
      description:
        'Everything startup founders need to know about raising venture capital funding.',
      difficulty: 'ADVANCED',
      suggestedTags: ['venture capital', 'startups', 'funding'],
    },
  ],
  Travel: [
    {
      title: 'Budget Travel: Exploring Europe on $50 a Day',
      description:
        'Tips and tricks for experiencing the best of Europe without breaking the bank.',
      difficulty: 'BEGINNER',
      suggestedTags: ['budget travel', 'europe', 'travel tips'],
    },
    {
      title: 'Solo Travel: A Complete Safety Guide',
      description:
        'Essential safety tips and advice for those traveling alone for the first time.',
      difficulty: 'INTERMEDIATE',
      suggestedTags: ['solo travel', 'safety', 'travel guide'],
    },
    {
      title: 'Hidden Gems: Off-the-Beaten-Path Destinations',
      description:
        'Discover lesser-known travel destinations that offer unique and authentic experiences.',
      difficulty: 'INTERMEDIATE',
      suggestedTags: ['travel', 'hidden gems', 'adventure'],
    },
  ],
  'Food & Recipes': [
    {
      title: 'Meal Prep 101: A Week of Healthy Eating Made Easy',
      description:
        'Learn how to plan and prepare a full week of nutritious meals in just a few hours.',
      difficulty: 'BEGINNER',
      suggestedTags: ['meal prep', 'healthy eating', 'recipes'],
    },
    {
      title: 'The Science of Baking: Understanding the Chemistry',
      description:
        'Explore the scientific principles behind baking and how to use them for better results.',
      difficulty: 'ADVANCED',
      suggestedTags: ['baking', 'science', 'cooking tips'],
    },
    {
      title: 'Plant-Based Cooking for Beginners',
      description:
        'Simple and delicious plant-based recipes for those new to vegetarian and vegan cooking.',
      difficulty: 'BEGINNER',
      suggestedTags: ['plant-based', 'vegan', 'vegetarian', 'recipes'],
    },
  ],
  Science: [
    {
      title: 'Climate Change: Understanding the Science Behind It',
      description:
        'A clear explanation of the science behind climate change and its global impact.',
      difficulty: 'INTERMEDIATE',
      suggestedTags: ['climate change', 'environment', 'science'],
    },
    {
      title: 'The Human Brain: Fascinating Facts and Discoveries',
      description:
        'Explore recent neuroscience discoveries and what they reveal about the human mind.',
      difficulty: 'INTERMEDIATE',
      suggestedTags: ['neuroscience', 'brain', 'psychology'],
    },
    {
      title: 'Space Exploration: What the Next Decade Holds',
      description:
        'A look at upcoming space missions and the future of human space exploration.',
      difficulty: 'BEGINNER',
      suggestedTags: ['space', 'nasa', 'exploration', 'astronomy'],
    },
  ],
};

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...\n');

  // Create categories
  console.log('📁 Creating categories...');
  const categoryMap: Record<string, string> = {};

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(cat.name, { lower: true, strict: true }) },
      update: {},
      create: {
        name: cat.name,
        slug: slugify(cat.name, { lower: true, strict: true }),
        description: cat.description,
        color: cat.color,
        icon: cat.icon,
      },
    });
    categoryMap[cat.name] = category.id;
    console.log(`  ✓ ${cat.name}`);
  }

  // Create topics
  console.log('\n📝 Creating topics...');
  let topicCount = 0;

  for (const [categoryName, topics] of Object.entries(topicsByCategory)) {
    const categoryId = categoryMap[categoryName];

    for (const topic of topics) {
      await prisma.topic.upsert({
        where: {
          title_categoryId: {
            title: topic.title,
            categoryId,
          },
        },
        update: {},
        create: {
          title: topic.title,
          description: topic.description,
          difficulty: topic.difficulty,
          suggestedTags: topic.suggestedTags,
          categoryId,
        },
      });
      topicCount++;
    }
    console.log(`  ✓ ${categoryName}: ${topics.length} topics`);
  }

  console.log(`
  ╔══════════════════════════════════════════════╗
  ║     ✅ Seed completed successfully!          ║
  ╠══════════════════════════════════════════════╣
  ║  Categories: ${categories.length.toString().padEnd(31)}║
  ║  Topics:     ${topicCount.toString().padEnd(31)}║
  ╚══════════════════════════════════════════════╝
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
