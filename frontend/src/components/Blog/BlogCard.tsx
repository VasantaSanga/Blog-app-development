/**
 * Blog Card Component
 * Displays blog preview in list views with smooth animations
 */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import { AccessTime, Visibility, Favorite } from '@mui/icons-material';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Blog } from '../../types';
import { getImageUrl } from '../../utils/imageUtils';

// Default cover image for blogs without a custom image
const DEFAULT_COVER_IMAGE = `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/image-1768993313911-666459579.jpg`;

interface BlogCardProps {
  blog: Blog;
  variant?: 'default' | 'compact';
}

function BlogCard({ blog, variant = 'default' }: BlogCardProps) {
  const {
    title,
    slug,
    excerpt,
    coverImage,
    author,
    category,
    tags,
    readingTime,
    views,
    likeCount,
    publishedAt,
    createdAt,
    status,
  } = blog;

  const isCompact = variant === 'compact';
  const isDraft = status === 'DRAFT';
  
  // Use default image if no cover image is provided, and format URL properly
  const displayImage = getImageUrl(coverImage || DEFAULT_COVER_IMAGE);

  return (
    <Card
      component={RouterLink}
      to={`/blog/${slug}`}
      sx={{
        display: 'flex',
        flexDirection: isCompact ? 'row' : 'column',
        textDecoration: 'none',
        height: '100%',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
          opacity: 0,
          transition: 'opacity 0.4s ease',
          zIndex: 0,
          pointerEvents: 'none',
        },
        '&:hover': {
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 20px 60px rgba(99, 102, 241, 0.2), 0 8px 20px rgba(0, 0, 0, 0.3)'
              : '0 20px 60px rgba(99, 102, 241, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08)',
          '&::before': {
            opacity: 1,
          },
          '& .blog-image': {
            transform: 'scale(1.08)',
          },
          '& .blog-title': {
            color: 'primary.main',
          },
        },
      }}
    >
      {/* Cover Image - Always show (use default if not provided) */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: isCompact ? 200 : '100%',
          minWidth: isCompact ? 200 : 'auto',
          height: isCompact ? 150 : 200,
        }}
      >
        <CardMedia
          component="img"
          image={displayImage}
          alt={title}
          className="blog-image"
          sx={{
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
        {category && (
          <Chip
            label={category.name}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: category.color || 'primary.main',
              color: '#fff',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        )}
      </Box>

      <CardContent 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: 0, // Important for flexbox to work properly
        }}
      >
        {/* Title */}
        <Typography
          variant={isCompact ? 'h6' : 'h5'}
          component="h2"
          className="blog-title"
          sx={{
            fontFamily: '"Crimson Pro", serif',
            fontWeight: 600,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: 'text.primary',
            transition: 'color 0.3s ease',
            flexShrink: 0, // Prevent title from shrinking
          }}
        >
          {title}
        </Typography>

        {/* Excerpt - Fixed height container */}
        {!isCompact && (
          <Box sx={{ flex: '1 1 auto', minHeight: 0, mb: 2 }}>
            {excerpt ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.6,
                  minHeight: '4.8em', // Fixed height for 3 lines (1.6 * 3)
                }}
              >
                {excerpt}
              </Typography>
            ) : (
              <Box sx={{ minHeight: '4.8em' }} /> // Spacer when no excerpt
            )}
          </Box>
        )}

        {/* Tags - Fixed height container */}
        {!isCompact && (
          <Box sx={{ flexShrink: 0, mb: 2, minHeight: tags && tags.length > 0 ? 32 : 0 }}>
            {tags && tags.length > 0 && (
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                {tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: '0.7rem',
                      height: 24,
                      borderRadius: 1,
                    }}
                  />
                ))}
              </Stack>
            )}
          </Box>
        )}

        {/* Meta info - Always at bottom */}
        <Box sx={{ mt: 'auto', flexShrink: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {/* Author */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={author?.avatar}
                sx={{ width: 28, height: 28, fontSize: '0.75rem' }}
              >
                {author?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.2 }}>
                  {author?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(publishedAt || createdAt), 'MMM d, yyyy')}
                </Typography>
              </Box>
            </Box>

            {/* Stats */}
            <Stack direction="row" spacing={1.5} sx={{ color: 'text.secondary' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime sx={{ fontSize: 16 }} />
                <Typography variant="caption">{readingTime} min</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Visibility sx={{ fontSize: 16 }} />
                <Typography variant="caption">{views || 0}</Typography>
              </Box>
              {likeCount && likeCount > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Favorite sx={{ fontSize: 16 }} />
                  <Typography variant="caption">{likeCount}</Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Status badge */}
          {isDraft ? (
            <Chip
              label="Draft"
              size="small"
              color="warning"
              sx={{ mt: 1 }}
            />
          ) : (
            <Chip
              label="Published"
              size="small"
              color="success"
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default BlogCard;
