/**
 * API Service
 * Axios instance with interceptors for API calls
 */

import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { Blog, Category, Topic, Comment, CreateBlogData, UpdateBlogData, CreateCommentData, Tag } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Blog API query params
interface BlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  status?: string;
}

// API Response types
interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}

interface PaginatedData<T> {
  blogs?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Blog API functions
export const blogAPI = {
  getAll: (params?: BlogQueryParams): Promise<AxiosResponse<ApiResponse<PaginatedData<Blog>>>> => 
    api.get('/blogs', { params }),
  
  getBySlug: (slug: string): Promise<AxiosResponse<ApiResponse<{ blog: Blog }>>> => 
    api.get(`/blogs/${slug}`),
  
  getById: (id: string): Promise<AxiosResponse<ApiResponse<{ blog: Blog }>>> => 
    api.get(`/blogs/id/${id}`),
  
  getMyBlogs: (params?: BlogQueryParams): Promise<AxiosResponse<ApiResponse<PaginatedData<Blog>>>> => 
    api.get('/blogs/user/my-blogs', { params }),
  
  create: (data: CreateBlogData): Promise<AxiosResponse<ApiResponse<{ blog: Blog }>>> => 
    api.post('/blogs', data),
  
  update: (id: string, data: UpdateBlogData): Promise<AxiosResponse<ApiResponse<{ blog: Blog }>>> => 
    api.put(`/blogs/${id}`, data),
  
  autoSave: (id: string, data: UpdateBlogData): Promise<AxiosResponse<ApiResponse<{ lastAutoSaved: string }>>> => 
    api.put(`/blogs/${id}/autosave`, data),
  
  publish: (id: string): Promise<AxiosResponse<ApiResponse<{ blog: Blog }>>> => 
    api.put(`/blogs/${id}/publish`),
  
  unpublish: (id: string): Promise<AxiosResponse<ApiResponse<{ blog: Blog }>>> => 
    api.put(`/blogs/${id}/unpublish`),
  
  delete: (id: string): Promise<AxiosResponse<ApiResponse<null>>> => 
    api.delete(`/blogs/${id}`),
  
  toggleLike: (id: string): Promise<AxiosResponse<ApiResponse<{ liked: boolean; likeCount: number }>>> => 
    api.put(`/blogs/${id}/like`),
  
  getTags: (): Promise<AxiosResponse<ApiResponse<{ tags: Tag[] }>>> => 
    api.get('/blogs/tags'),
};

// Topic API query params
interface TopicQueryParams {
  category?: string;
  difficulty?: string;
  search?: string;
}

// Topic API functions
export const topicAPI = {
  getAll: (params?: TopicQueryParams): Promise<AxiosResponse<ApiResponse<{ topics: Topic[] }>>> => 
    api.get('/topics', { params }),
  
  getById: (id: string): Promise<AxiosResponse<ApiResponse<{ topic: Topic }>>> => 
    api.get(`/topics/${id}`),
  
  getRandom: (count = 5): Promise<AxiosResponse<ApiResponse<{ topics: Topic[] }>>> => 
    api.get('/topics/random', { params: { count } }),
  
  create: (data: Omit<Topic, 'id' | 'category' | 'usageCount'> & { category: string }): Promise<AxiosResponse<ApiResponse<{ topic: Topic }>>> => 
    api.post('/topics', data),
};

// Category API functions
export const categoryAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<{ categories: Category[] }>>> => 
    api.get('/categories'),
  
  getBySlug: (slug: string): Promise<AxiosResponse<ApiResponse<{ category: Category }>>> => 
    api.get(`/categories/${slug}`),
  
  create: (data: Omit<Category, 'id' | 'slug' | 'blogCount'>): Promise<AxiosResponse<ApiResponse<{ category: Category }>>> => 
    api.post('/categories', data),
};

// Comment API functions
export const commentAPI = {
  getByBlog: (blogId: string): Promise<AxiosResponse<ApiResponse<{ comments: Comment[] }>>> => 
    api.get(`/comments/blog/${blogId}`),
  
  create: (data: CreateCommentData): Promise<AxiosResponse<ApiResponse<{ comment: Comment }>>> => 
    api.post('/comments', data),
  
  update: (id: string, content: string): Promise<AxiosResponse<ApiResponse<{ comment: Comment }>>> => 
    api.put(`/comments/${id}`, { content }),
  
  delete: (id: string): Promise<AxiosResponse<ApiResponse<null>>> => 
    api.delete(`/comments/${id}`),
  
  toggleLike: (id: string): Promise<AxiosResponse<ApiResponse<{ liked: boolean; likeCount: number }>>> => 
    api.put(`/comments/${id}/like`),
};

// Upload API functions
interface UploadResponse {
  url: string;
  filename: string;
  originalName: string;
  size: number;
}

export const uploadAPI = {
  uploadImage: (file: File): Promise<AxiosResponse<ApiResponse<UploadResponse>>> => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  deleteImage: (filename: string): Promise<AxiosResponse<ApiResponse<null>>> => 
    api.delete(`/upload/image/${filename}`),
};

// AI API functions
interface GenerateContentParams {
  title: string;
  tags?: string[];
  category?: string;
  tone?: 'professional' | 'casual' | 'technical' | 'creative';
}

export const aiAPI = {
  generateContent: (params: GenerateContentParams): Promise<AxiosResponse<ApiResponse<{ content: string }>>> =>
    api.post('/ai/generate', params),
  
  getStatus: (): Promise<AxiosResponse<ApiResponse<{ available: boolean }>>> =>
    api.get('/ai/status'),
};
