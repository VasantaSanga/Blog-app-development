/**
 * Frontend Type Definitions
 */

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  blogCount?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  blogCount?: number;
}

// Topic types
export interface Topic {
  id: string;
  title: string;
  description?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  suggestedTags: string[];
  usageCount?: number;
  category: Category;
}

// Blog types
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED';
  readingTime: number;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: Pick<User, 'id' | 'name' | 'avatar' | 'bio'>;
  category?: Category | null;
  likeCount?: number;
  commentCount?: number;
  likes?: string[];
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category?: string | null;
  tags?: string[];
  status?: 'draft' | 'published';
  basedOnTopic?: string | null;
}

export interface UpdateBlogData {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  category?: string | null;
  tags?: string[];
  status?: 'draft' | 'published';
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  author: Pick<User, 'id' | 'name' | 'avatar'>;
  replies?: Comment[];
  likeCount: number;
  likes: string[];
  parentCommentId?: string | null;
}

export interface CreateCommentData {
  content: string;
  blogId: string;
  parentCommentId?: string | null;
}

// API Response types
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
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

// Theme types
export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

// Auth Context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

// Tag type
export interface Tag {
  name: string;
  count: number;
}
