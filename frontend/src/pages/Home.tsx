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
import { motion } from 'framer-motion';
import BlogCard from '../components/Blog/BlogCard';
import { blogAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Blog, Category } from '../types';
import { 
  ScrollReveal, 
  staggerContainer, 
  fadeInUp,
  scaleIn
} from '../components/Common/Animations';

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
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
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
        {/* Animated background particles */}
        <Box
          component={motion.div}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.5,
            background: `radial-gradient(circle at 20% 80%, ${alpha('#6366f1', 0.15)} 0%, transparent 30%),
                         radial-gradient(circle at 80% 20%, ${alpha('#ec4899', 0.15)} 0%, transparent 30%)`,
            backgroundSize: '200% 200%',
            pointerEvents: 'none',
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
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
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
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
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              {isAuthenticated ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Get Started Free
                  </Button>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
              </motion.div>
            </Stack>
          </motion.div>
        </Box>
      </Paper>

      {/* Categories Filter */}
      <ScrollReveal direction="up" delay={0.1}>
        <Box sx={{ mb: 4 }}>
          <Stack
            component={motion.div}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: 'center',
            }}
          >
            <motion.div variants={scaleIn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Chip
                label="All"
                onClick={() => setSelectedCategory(null)}
                variant={selectedCategory === null ? 'filled' : 'outlined'}
                color="primary"
                sx={{ fontWeight: 500, cursor: 'pointer' }}
              />
            </motion.div>
            {categories.map((category, _index) => (
              <motion.div 
                key={category.id} 
                variants={scaleIn}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  label={category.name}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    ...(selectedCategory === category.id && {
                      bgcolor: category.color,
                      color: '#fff',
                      '&:hover': {
                        bgcolor: category.color,
                      },
                    }),
                  }}
                />
              </motion.div>
            ))}
          </Stack>
        </Box>
      </ScrollReveal>

      {/* Section Title */}
      <ScrollReveal direction="up" delay={0.2}>
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
      </ScrollReveal>

      {/* Blog Grid */}
      <Grid 
        container 
        spacing={3}
        component={motion.div}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Skeleton
                    variant="rectangular"
                    height={300}
                    sx={{ borderRadius: 4 }}
                  />
                </motion.div>
              </Grid>
            ))
          : blogs.map((blog, _index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={blog.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
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
        <ScrollReveal direction="up">
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <motion.div 
              whileHover={{ scale: 1.05, x: 5 }} 
              whileTap={{ scale: 0.95 }}
              style={{ display: 'inline-block' }}
            >
              <Button
                component={RouterLink}
                to="/search"
                endIcon={<ArrowForward />}
                sx={{ fontSize: '1rem' }}
              >
                View All Blogs
              </Button>
            </motion.div>
          </Box>
        </ScrollReveal>
      )}
    </Box>
  );
}

export default Home;
