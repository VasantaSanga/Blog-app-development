/**
 * Blog View Page
 * Displays full blog content with comments
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  IconButton,
  Divider,
  Button,
  Tooltip,
  Paper,
  alpha,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  BookmarkBorder,
  AccessTime,
  Visibility,
  ArrowBack,
  Edit,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import BlogContent from '../components/Blog/BlogContent';
import CommentSection from '../components/Blog/CommentSection';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Blog } from '../types';
import { getImageUrl } from '../utils/imageUtils';

// Default cover image for blogs without a custom image (same as BlogCard)
const DEFAULT_COVER_IMAGE = `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/image-1768993313911-666459579.jpg`;

function BlogView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchBlog = async () => {
    if (!slug) {
      navigate('/');
      return;
    }
    try {
      const response = await blogAPI.getBySlug(slug);
      const blogData = response.data.data.blog;
      setBlog(blogData);
      setLiked(user?.id ? blogData.likes?.includes(user.id) ?? false : false);
    } catch (error: unknown) {
      console.error('Error fetching blog:', error);
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 404) {
        navigate('/');
        toast.error('Blog not found');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to like this blog');
      return;
    }

    if (!blog) return;

    try {
      const response = await blogAPI.toggleLike(blog.id);
      setLiked(response.data.data.liked);
      setBlog((prev) => prev ? {
        ...prev,
        likeCount: response.data.data.likeCount,
      } : null);
    } catch (error) {
      toast.error('Failed to like blog');
    }
  };

  const handleShare = async () => {
    if (!blog) return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url,
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading blog..." />;
  }

  if (!blog) {
    return null;
  }

  const isAuthor = user?.id === blog.author?.id;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back
      </Button>

      {/* Cover Image - Always show (use default if not provided) */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 250, md: 400 },
          borderRadius: 4,
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <img
          src={getImageUrl(blog.coverImage || DEFAULT_COVER_IMAGE)}
          alt={blog.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Category & Edit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        {blog.category && (
          <Chip
            label={blog.category.name}
            sx={{
              bgcolor: blog.category.color || 'primary.main',
              color: '#fff',
              fontWeight: 500,
            }}
          />
        )}
        {isAuthor && (
          <Button
            component={RouterLink}
            to={`/editor/${blog.id}`}
            startIcon={<Edit />}
            size="small"
          >
            Edit
          </Button>
        )}
      </Box>

      {/* Title */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', md: '3rem' },
          fontWeight: 700,
          lineHeight: 1.2,
          mb: 3,
        }}
      >
        {blog.title}
      </Typography>

      {/* Author Info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={blog.author?.avatar}
            sx={{ width: 48, height: 48 }}
          >
            {blog.author?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {blog.author?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(new Date(blog.publishedAt || blog.createdAt), 'MMMM d, yyyy')}
            </Typography>
          </Box>
        </Box>

        {/* Stats */}
        <Stack direction="row" spacing={2} sx={{ color: 'text.secondary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" />
            <Typography variant="body2">{blog.readingTime} min read</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Visibility fontSize="small" />
            <Typography variant="body2">{blog.views || 0} views</Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Blog Content */}
      <BlogContent content={blog.content} />

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mt: 4, flexWrap: 'wrap', gap: 1 }}>
          {blog.tags.map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              component={RouterLink}
              to={`/search?tag=${tag}`}
              clickable
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      )}

      {/* Action Buttons */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 2,
          mt: 4,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
          borderRadius: 3,
        }}
      >
        <Tooltip title={liked ? 'Unlike' : 'Like'}>
          <IconButton onClick={handleLike} color={liked ? 'error' : 'default'}>
            {liked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>
        <Typography variant="body2" color="text.secondary">
          {blog.likeCount || 0}
        </Typography>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Tooltip title="Share">
          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bookmark">
          <IconButton>
            <BookmarkBorder />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Author Bio */}
      {blog.author?.bio && (
        <Paper
          sx={{
            p: 3,
            mt: 4,
            bgcolor: 'background.elevated',
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={blog.author?.avatar}
              sx={{ width: 56, height: 56 }}
            >
              {blog.author?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Written by
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {blog.author?.name}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {blog.author?.bio}
          </Typography>
        </Paper>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Comments */}
      <CommentSection blogId={blog.id} />
    </Box>
  );
}

export default BlogView;
