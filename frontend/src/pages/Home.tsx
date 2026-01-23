/**
 * Home Page
 * Displays featured blogs and latest posts
 */

import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Stack,
  Skeleton,
  Paper,
  alpha,
} from '@mui/material';
import { Edit, TrendingUp, ArrowForward } from '@mui/icons-material';
import BlogCard from '../components/Blog/BlogCard';
import { blogAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Blog, Category } from '../types';

interface BlogParams {
  limit: number;
  category?: string;
}

function Home() {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const [blogsRes, categoriesRes] = await Promise.all([
        blogAPI.getAll({ limit: 9 }),
        categoryAPI.getAll(),
      ]);
      setBlogs(blogsRes.data.data.blogs || []);
      setCategories(categoriesRes.data.data.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const params: BlogParams = { limit: 9 };
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      const response = await blogAPI.getAll(params);
      setBlogs(response.data.data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          py: { xs: 6, md: 10 },
          px: { xs: 3, md: 6 },
          mb: 6,
          borderRadius: 4,
          overflow: 'hidden',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.3)} 0%, ${alpha(theme.palette.secondary.dark, 0.2)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.15)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 30% 50%, ${alpha('#6366f1', 0.1)} 0%, transparent 50%),
                         radial-gradient(circle at 70% 80%, ${alpha('#ec4899', 0.1)} 0%, transparent 50%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              mb: 2,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
            }}
          >
            Write. Publish. Inspire.
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Share your stories with the world. Beautiful writing experience, powerful publishing tools.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            {isAuthenticated ? (
              <Button
                component={RouterLink}
                to="/editor"
                variant="contained"
                size="large"
                startIcon={<Edit />}
                sx={{ px: 4, py: 1.5 }}
              >
                Start Writing
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Get Started Free
              </Button>
            )}
            <Button
              component={RouterLink}
              to="/topics"
              variant="outlined"
              size="large"
              startIcon={<TrendingUp />}
              sx={{ px: 4, py: 1.5 }}
            >
              Explore Topics
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Categories Filter */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          <Chip
            label="All"
            onClick={() => setSelectedCategory(null)}
            variant={selectedCategory === null ? 'filled' : 'outlined'}
            color="primary"
            sx={{ fontWeight: 500 }}
          />
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 500,
                ...(selectedCategory === category.id && {
                  bgcolor: category.color,
                  color: '#fff',
                  '&:hover': {
                    bgcolor: category.color,
                  },
                }),
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Section Title */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontFamily: '"Crimson Pro", serif' }}>
          Latest Stories
        </Typography>
      </Box>

      {/* Blog Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={300}
                  sx={{ borderRadius: 4 }}
                />
              </Grid>
            ))
          : blogs.map((blog, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={blog.id}
                sx={{
                  animation: 'fadeIn 0.5s ease-out forwards',
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                }}
              >
                <BlogCard blog={blog} />
              </Grid>
            ))}
      </Grid>

      {/* Empty State */}
      {!loading && blogs.length === 0 && (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.elevated',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No blogs published yet
          </Typography>
          {isAuthenticated && (
            <Button
              component={RouterLink}
              to="/editor"
              variant="contained"
              startIcon={<Edit />}
            >
              Write the first blog
            </Button>
          )}
        </Paper>
      )}

      {/* View More */}
      {blogs.length >= 9 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            component={RouterLink}
            to="/search"
            endIcon={<ArrowForward />}
            sx={{ fontSize: '1rem' }}
          >
            View All Blogs
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Home;
