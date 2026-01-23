/**
 * Category Service
 * Business logic for category operations
 */

import slugify from 'slugify';
import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import type { CreateCategoryInput, UpdateCategoryInput } from '../types/index.js';

class CategoryService {
  /**
   * Get all categories
   */
  async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { blogs: { where: { status: 'PUBLISHED' } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories.map((cat) => ({
      ...cat,
      blogCount: cat._count.blogs,
      _count: undefined,
    }));
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { blogs: { where: { status: 'PUBLISHED' } } },
        },
      },
    });

    if (!category) {
      throw { statusCode: 404, message: 'Category not found' };
    }

    return {
      ...category,
      blogCount: category._count.blogs,
      _count: undefined,
    };
  }

  /**
   * Create category
   */
  async createCategory(input: CreateCategoryInput) {
    const category = await prisma.category.create({
      data: {
        name: input.name,
        slug: slugify(input.name, { lower: true, strict: true }),
        description: input.description || '',
        color: input.color || '#6366f1',
        icon: input.icon || 'article',
      },
    });

    return category;
  }

  /**
   * Update category
   */
  async updateCategory(id: string, input: UpdateCategoryInput) {
    const updateData: Prisma.CategoryUpdateInput = {};

    if (input.name) {
      updateData.name = input.name;
      updateData.slug = slugify(input.name, { lower: true, strict: true });
    }
    if (input.description !== undefined) updateData.description = input.description;
    if (input.color) updateData.color = input.color;
    if (input.icon) updateData.icon = input.icon;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return category;
  }

  /**
   * Delete category
   */
  async deleteCategory(id: string) {
    await prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryService = new CategoryService();
export default categoryService;
