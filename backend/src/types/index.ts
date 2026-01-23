/**
 * Type definitions for the Blog Application
 */

import { Request } from 'express';
import { User } from '@prisma/client';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: UserPayload;
}

// User payload in JWT token
export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Auth types
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Blog types
export interface CreateBlogInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category?: string | null;
  tags?: string[];
  status?: 'draft' | 'published';
  basedOnTopic?: string | null;
}

export interface UpdateBlogInput {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  category?: string | null;
  tags?: string[];
  status?: 'draft' | 'published';
}

// Category types
export interface CreateCategoryInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

// Topic types
export interface CreateTopicInput {
  title: string;
  description?: string;
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  suggestedTags?: string[];
}

export interface UpdateTopicInput {
  title?: string;
  description?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  suggestedTags?: string[];
  isActive?: boolean;
}

// Comment types
export interface CreateCommentInput {
  content: string;
  blogId: string;
  parentCommentId?: string | null;
}

export interface UpdateCommentInput {
  content: string;
}

// Pagination types
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API Response types
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}
