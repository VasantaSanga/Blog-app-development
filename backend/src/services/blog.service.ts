/**
 * Blog Service
 * Business logic for blog operations
 */

import slugify from 'slugify';
import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import type { CreateBlogInput, UpdateBlogInput } from '../types/index.js';

class BlogService {
  /**
   * Generate unique slug
   */
  private generateSlug(title: string): string {
    const baseSlug = slugify(title, { lower: true, strict: true });
    return `${baseSlug}-${Date.now().toString(36)}`;
  }

  /**
   * Calculate reading time
   */
  private calculateReadingTime(content: string): number {
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  }

  /**
   * Generate excerpt from content
   */
  private generateExcerpt(content: string, maxLength = 300): string {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.substring(0, maxLength) + (plainText.length > maxLength ? '...' : '');
  }

  /**
   * Get all published blogs with pagination
   */
  async getBlogs(options: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    author?: string;
    search?: string;
  }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BlogWhereInput = { status: 'PUBLISHED' };

    if (options.category) {
      where.categoryId = options.category;
    }

    if (options.tag) {
      where.tags = { has: options.tag.toLowerCase() };
    }

    if (options.author) {
      where.authorId = options.author;
    }

    if (options.search) {
      where.OR = [
        { title: { contains: options.search, mode: 'insensitive' } },
        { content: { contains: options.search, mode: 'insensitive' } },
        { excerpt: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, avatar: true },
          },
          category: {
            select: { id: true, name: true, slug: true, color: true },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);

    return {
      blogs: blogs.map((blog) => ({
        ...blog,
        likeCount: blog._count.likes,
        commentCount: blog._count.comments,
        _count: undefined,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get blog by slug
   */
  async getBlogBySlug(slug: string, userId?: string) {
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, bio: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
        likes: {
          select: { userId: true },
        },
      },
    });

    if (!blog) {
      throw { statusCode: 404, message: 'Blog not found' };
    }

    // Only allow viewing published blogs (unless author)
    if (blog.status !== 'PUBLISHED') {
      if (!userId || userId !== blog.authorId) {
        throw { statusCode: 404, message: 'Blog not found' };
      }
    }

    return {
      ...blog,
      likeCount: blog._count.likes,
      commentCount: blog._count.comments,
      likes: blog.likes.map((l) => l.userId),
      _count: undefined,
    };
  }

  /**
   * Get blog by ID
   */
  async getBlogById(id: string, userId?: string) {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    if (!blog) {
      throw { statusCode: 404, message: 'Blog not found' };
    }

    // Only allow owner to fetch unpublished blogs
    if (blog.status !== 'PUBLISHED' && (!userId || userId !== blog.authorId)) {
      throw { statusCode: 404, message: 'Blog not found' };
    }

    return {
      ...blog,
      likeCount: blog._count.likes,
      commentCount: blog._count.comments,
      _count: undefined,
    };
  }

  /**
   * Track unique blog view
   */
  async trackView(blogId: string, userId?: string, ipAddress?: string) {
    try {
      if (userId) {
        const existingView = await prisma.blogView.findUnique({
          where: { blogId_userId: { blogId, userId } },
        });

        if (!existingView) {
          await prisma.blogView.create({
            data: { blogId, userId },
          });
          await prisma.blog.update({
            where: { id: blogId },
            data: { views: { increment: 1 } },
          });
        }
      } else if (ipAddress && ipAddress !== 'unknown') {
        const existingView = await prisma.blogView.findUnique({
          where: { blogId_ipAddress: { blogId, ipAddress } },
        });

        if (!existingView) {
          await prisma.blogView.create({
            data: { blogId, ipAddress },
          });
          await prisma.blog.update({
            where: { id: blogId },
            data: { views: { increment: 1 } },
          });
        }
      }
    } catch (error: unknown) {
      // Ignore duplicate key errors
      const prismaError = error as { code?: string };
      if (prismaError.code !== 'P2002') {
        console.error('Error tracking view:', error);
      }
    }
  }

  /**
   * Get user's blogs
   */
  async getMyBlogs(
    userId: string,
    options: { page?: number; limit?: number; status?: string }
  ) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BlogWhereInput = { authorId: userId };

    if (options.status) {
      where.status = options.status.toUpperCase();
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true, color: true },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);

    return {
      blogs: blogs.map((blog) => ({
        ...blog,
        likeCount: blog._count.likes,
        commentCount: blog._count.comments,
        _count: undefined,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create blog
   */
  async createBlog(authorId: string, input: CreateBlogInput) {
    const blog = await prisma.blog.create({
      data: {
        title: input.title,
        slug: this.generateSlug(input.title),
        content: input.content,
        excerpt: input.excerpt || this.generateExcerpt(input.content),
        coverImage: input.coverImage || '',
        tags: input.tags || [],
        status: input.status?.toUpperCase() === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
        readingTime: this.calculateReadingTime(input.content),
        authorId,
        categoryId: input.category || null,
        topicId: input.basedOnTopic || null,
        publishedAt: input.status === 'published' ? new Date() : null,
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    });

    // Increment topic usage
    if (input.basedOnTopic) {
      await prisma.topic.update({
        where: { id: input.basedOnTopic },
        data: { usageCount: { increment: 1 } },
      });
    }

    return blog;
  }

  /**
   * Update blog
   */
  async updateBlog(blogId: string, authorId: string, input: UpdateBlogInput) {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw { statusCode: 404, message: 'Blog not found' };
    }

    if (blog.authorId !== authorId) {
      throw { statusCode: 403, message: 'Not authorized to update this blog' };
    }

    const updateData: Prisma.BlogUpdateInput = {};

    if (input.title) {
      updateData.title = input.title;
      updateData.slug = this.generateSlug(input.title);
    }

    if (input.content) {
      updateData.content = input.content;
      updateData.readingTime = this.calculateReadingTime(input.content);
      if (!input.excerpt) {
        updateData.excerpt = this.generateExcerpt(input.content);
      }
    }

    if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
    if (input.coverImage !== undefined) updateData.coverImage = input.coverImage;
    if (input.category !== undefined) updateData.categoryId = input.category || null;
    if (input.tags !== undefined) updateData.tags = input.tags;

    if (input.status) {
      updateData.status = input.status.toUpperCase();
      if (input.status === 'published' && !blog.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    });

    return updatedBlog;
  }

  /**
   * Auto-save blog
   */
  async autoSaveBlog(blogId: string, authorId: string, input: UpdateBlogInput) {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw { statusCode: 404, message: 'Blog not found' };
    }

    if (blog.authorId !== authorId) {
      throw { statusCode: 403, message: 'Not authorized to update this blog' };
    }

    const updateData: Prisma.BlogUpdateInput = { lastAutoSaved: new Date() };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.content !== undefined) {
      updateData.content = input.content;
      updateData.readingTime = this.calculateReadingTime(input.content);
    }
    if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
    if (input.coverImage !== undefined) updateData.coverImage = input.coverImage;
    if (input.category !== undefined) updateData.categoryId = input.category || null;
    if (input.tags !== undefined) updateData.tags = input.tags;

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: updateData,
    });

    return { lastAutoSaved: updatedBlog.lastAutoSaved };
  }

  /**
   * Publish blog
   */
  async publishBlog(blogId: string, authorId: string) {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw { statusCode: 404, message: 'Blog not found' };
    }

    if (blog.authorId !== authorId) {
      throw { statusCode: 403, message: 'Not authorized to publish this blog' };
    }

    if (!blog.title || !blog.content) {
      throw { statusCode: 400, message: 'Blog must have a title and content to publish' };
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    });

    return updatedBlog;
  }

  /**
   * Unpublish blog
   */
  async unpublishBlog(blogId: string, authorId: string) {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw { statusCode: 404, message: 'Blog not found' };
    }

    if (blog.authorId !== authorId) {
      throw { statusCode: 403, message: 'Not authorized to unpublish this blog' };
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: { status: 'DRAFT' },
    });

    return updatedBlog;
  }

  /**
   * Delete blog
   */
  async deleteBlog(blogId: string, authorId: string) {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw { statusCode: 404, message: 'Blog not found' };
    }

    if (blog.authorId !== authorId) {
      throw { statusCode: 403, message: 'Not authorized to delete this blog' };
    }

    await prisma.blog.delete({
      where: { id: blogId },
    });
  }

  /**
   * Toggle like
   */
  async toggleLike(blogId: string, userId: string) {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw { statusCode: 404, message: 'Blog not found' };
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_blogId: { userId, blogId },
      },
    });

    let liked: boolean;

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      liked = false;
    } else {
      await prisma.like.create({
        data: { userId, blogId },
      });
      liked = true;
    }

    const likeCount = await prisma.like.count({
      where: { blogId },
    });

    return { liked, likeCount };
  }

  /**
   * Get all tags
   */
  async getAllTags() {
    const blogs = await prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    blogs.forEach((blog) => {
      blog.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const tags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);

    return tags;
  }
}

export const blogService = new BlogService();
export default blogService;
