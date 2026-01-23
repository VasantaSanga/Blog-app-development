/**
 * Blog Card Component
 * Displays blog preview in list views
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
import { Blog } from '../../types';

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
  
  // Use default image if no cover image is provided
  const displayImage = coverImage || DEFAULT_COVER_IMAGE;

  return (
    <Card
      component={RouterLink}
      to={`/blog/${slug}`}
      sx={{
        display: 'flex',
        flexDirection: isCompact ? 'row' : 'column',
        textDecoration: 'none',
        height: '100%',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 12px 40px rgba(0, 0, 0, 0.4)'
              : '0 12px 40px rgba(0, 0, 0, 0.1)',
          '& .blog-image': {
            transform: 'scale(1.05)',
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
            transition: 'transform 0.3s ease',
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

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Title */}
        <Typography
          variant={isCompact ? 'h6' : 'h5'}
          component="h2"
          sx={{
            fontFamily: '"Crimson Pro", serif',
            fontWeight: 600,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>

        {/* Excerpt */}
        {!isCompact && excerpt && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
            }}
          >
            {excerpt}
          </Typography>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && !isCompact && (
          <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
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

        {/* Meta info */}
        <Box sx={{ mt: 'auto' }}>
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
              {views > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Visibility sx={{ fontSize: 16 }} />
                  <Typography variant="caption">{views}</Typography>
                </Box>
              )}
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
