/**
 * Topic Card Component
 * Displays a blog topic idea for selection
 */

import React, { ReactElement } from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack } from '@mui/material';
import { TrendingUp, School, EmojiEvents } from '@mui/icons-material';
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
      onClick={() => onClick(topic)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        transition: 'all 0.3s ease',
        border: 2,
        borderColor: selected ? 'primary.main' : 'transparent',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 12px 40px rgba(0, 0, 0, 0.4)'
              : '0 12px 40px rgba(0, 0, 0, 0.1)',
          borderColor: selected ? 'primary.main' : 'primary.light',
        },
      }}
    >
      <CardContent>
        {/* Category & Difficulty */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
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
          sx={{
            fontFamily: '"Crimson Pro", serif',
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.3,
          }}
        >
          {topic.title}
        </Typography>

        {/* Description */}
        {topic.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {topic.description}
          </Typography>
        )}

        {/* Suggested Tags */}
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

        {/* Usage count */}
        {topic.usageCount && topic.usageCount > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Used {topic.usageCount} times
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default TopicCard;
