/**
 * Topic Card Component
 * Displays a blog topic idea for selection with animations
 */

import React, { ReactElement } from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, alpha } from '@mui/material';
import { TrendingUp, School, EmojiEvents } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Topic } from '../../types';

interface DifficultyConfig {
  color: 'success' | 'warning' | 'error';
  icon: ReactElement;
  label: string;
}

const difficultyConfig: Record<string, DifficultyConfig> = {
  BEGINNER: { color: 'success', icon: <School fontSize="small" />, label: 'Beginner' },
  INTERMEDIATE: { color: 'warning', icon: <TrendingUp fontSize="small" />, label: 'Intermediate' },
  ADVANCED: { color: 'error', icon: <EmojiEvents fontSize="small" />, label: 'Advanced' },
  // Also support lowercase for backwards compatibility
  beginner: { color: 'success', icon: <School fontSize="small" />, label: 'Beginner' },
  intermediate: { color: 'warning', icon: <TrendingUp fontSize="small" />, label: 'Intermediate' },
  advanced: { color: 'error', icon: <EmojiEvents fontSize="small" />, label: 'Advanced' },
};

interface TopicCardProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
  selected: boolean;
}

function TopicCard({ topic, onClick, selected }: TopicCardProps) {
  const difficulty = difficultyConfig[topic.difficulty] || difficultyConfig.INTERMEDIATE;

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(topic)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        border: 2,
        borderColor: selected ? 'primary.main' : 'transparent',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: (theme) => 
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          opacity: 0,
          transition: 'opacity 0.4s ease',
          zIndex: 0,
        },
        '&:hover': {
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 20px 60px rgba(99, 102, 241, 0.2), 0 8px 20px rgba(0, 0, 0, 0.3)'
              : '0 20px 60px rgba(99, 102, 241, 0.12), 0 8px 20px rgba(0, 0, 0, 0.06)',
          borderColor: selected ? 'primary.main' : 'primary.light',
          '&::before': {
            opacity: 1,
          },
          '& .topic-title': {
            color: 'primary.main',
          },
        },
        ...(selected && {
          boxShadow: (theme) =>
            `0 0 0 2px ${theme.palette.primary.main}, 0 10px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
        }),
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
        }}
      >
        {/* Category & Difficulty */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexShrink: 0 }}>
          {topic.category && (
            <Chip
              label={topic.category.name}
              size="small"
              sx={{
                bgcolor: topic.category.color || 'primary.main',
                color: '#fff',
                fontWeight: 500,
              }}
            />
          )}
          <Chip
            icon={difficulty.icon}
            label={difficulty.label}
            size="small"
            color={difficulty.color}
            variant="outlined"
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          className="topic-title"
          sx={{
            fontFamily: '"Crimson Pro", serif',
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.3,
            transition: 'color 0.3s ease',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexShrink: 0,
            minHeight: '3.2em', // Fixed height for 2 lines (1.6 * 2)
          }}
        >
          {topic.title}
        </Typography>

        {/* Description - Fixed height container */}
        <Box sx={{ flex: '1 1 auto', minHeight: 0, mb: 2 }}>
          {topic.description ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.5,
                minHeight: '3em', // Fixed height for 2 lines (1.5 * 2)
              }}
            >
              {topic.description}
            </Typography>
          ) : (
            <Box sx={{ minHeight: '3em' }} /> // Spacer when no description
          )}
        </Box>

        {/* Suggested Tags - Fixed height container */}
        <Box sx={{ flexShrink: 0, mb: 2, minHeight: topic.suggestedTags && topic.suggestedTags.length > 0 ? 28 : 0 }}>
          {topic.suggestedTags && topic.suggestedTags.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
              {topic.suggestedTags.slice(0, 4).map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 22 }}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Usage count - Always at bottom */}
        <Box sx={{ mt: 'auto', flexShrink: 0 }}>
          {topic.usageCount && topic.usageCount > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Used {topic.usageCount} times
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default TopicCard;
