/**
 * Comment Service
 * Business logic for comment operations
 */

import prisma from '../config/prisma.js';
import type { CreateCommentInput, UpdateCommentInput } from '../types/index.js';

class CommentService {
  /**
   * Get comments for a blog
   */
  async getBlogComments(blogId: string) {
    const comments = await prisma.comment.findMany({
      where: {
        blogId,
        parentCommentId: null,
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        replies: {
          include: {
            author: {
              select: { id: true, name: true, avatar: true },
            },
            _count: {
              select: { likes: true },
            },
            likes: {
              select: { userId: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { likes: true },
        },
        likes: {
          select: { userId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return comments.map((comment) => ({
      ...comment,
      likeCount: comment._count.likes,
      likes: comment.likes.map((l) => l.userId),
      _count: undefined,
      replies: comment.replies.map((reply) => ({
        ...reply,
        likeCount: reply._count.likes,
        likes: reply.likes.map((l) => l.userId),
        _count: undefined,
      })),
    }));
  }

  /**
   * Create comment
   */
  async createComment(authorId: string, input: CreateCommentInput) {
    // Verify blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: input.blogId },
    });

    if (!blog) {
      throw { statusCode: 404, message: 'Blog not found' };
    }

    // Verify parent comment exists if replying
    if (input.parentCommentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: input.parentCommentId },
      });

      if (!parentComment) {
        throw { statusCode: 404, message: 'Parent comment not found' };
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: input.content,
        blogId: input.blogId,
        authorId,
        parentCommentId: input.parentCommentId || null,
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    return { ...comment, likeCount: 0, likes: [] };
  }

  /**
   * Update comment
   */
  async updateComment(commentId: string, authorId: string, input: UpdateCommentInput) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw { statusCode: 404, message: 'Comment not found' };
    }

    if (comment.authorId !== authorId) {
      throw { statusCode: 403, message: 'Not authorized to update this comment' };
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: input.content,
        isEdited: true,
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    return {
      ...updatedComment,
      likeCount: updatedComment._count.likes,
      _count: undefined,
    };
  }

  /**
   * Delete comment
   */
  async deleteComment(commentId: string, authorId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw { statusCode: 404, message: 'Comment not found' };
    }

    if (comment.authorId !== authorId) {
      throw { statusCode: 403, message: 'Not authorized to delete this comment' };
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
  }

  /**
   * Toggle like on comment
   */
  async toggleLike(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw { statusCode: 404, message: 'Comment not found' };
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_commentId: { userId, commentId },
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
        data: { userId, commentId },
      });
      liked = true;
    }

    const likeCount = await prisma.like.count({
      where: { commentId },
    });

    return { liked, likeCount };
  }
}

export const commentService = new CommentService();
export default commentService;
