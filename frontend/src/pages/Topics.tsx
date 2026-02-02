/**
 * Topics Page
 * Browse and select predefined blog topic ideas
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Paper,
  InputAdornment,
  Skeleton,
  alpha,
  SelectChangeEvent,
} from '@mui/material';
import { Search, Shuffle, Edit, Category as CategoryIcon, AutoAwesome } from '@mui/icons-material';
import TopicCard from '../components/Common/TopicCard';
import { topicAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Topic, Category } from '../types';

interface TopicParams {
  category?: string;
  difficulty?: string;
}

function Topics() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  
  // Ref for the selected topic action panel
  const selectedTopicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedDifficulty]);

  // Scroll to selected topic panel when a topic is selected
  useEffect(() => {
    if (selectedTopic && selectedTopicRef.current) {
      selectedTopicRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedTopic]);

  const fetchInitialData = async () => {
    try {
      const [topicsRes, categoriesRes] = await Promise.all([
        topicAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      setTopics(topicsRes.data.data.topics || []);
      setCategories(categoriesRes.data.data.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const params: TopicParams = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      
      const response = await topicAPI.getAll(params);
      setTopics(response.data.data.topics || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleGetRandom = async () => {
    try {
      const response = await topicAPI.getRandom(5);
      setTopics(response.data.data.topics || []);
      toast.success('Showing random topic suggestions!');
    } catch (error) {
      console.error('Error fetching random topics:', error);
    }
  };

  const handleSelectTopic = (topic: Topic) => {
    if (selectedTopic?.id === topic.id) {
      setSelectedTopic(null);
    } else {
      setSelectedTopic(topic);
    }
  };

  const handleWriteWithTopic = (useAI: boolean = false) => {
    if (!isAuthenticated) {
      toast.info('Please login to start writing');
      navigate('/login');
      return;
    }

    if (!selectedTopic) return;

    // Navigate to editor with topic info in state
    navigate('/editor', {
      state: {
        topicId: selectedTopic.id,
        suggestedTitle: selectedTopic.title,
        suggestedTags: selectedTopic.suggestedTags,
        categoryId: selectedTopic.category?.id,
        categoryName: selectedTopic.category?.name,
        autoGenerate: useAI,
      },
    });
  };

  const handleWriteCustom = () => {
    if (!isAuthenticated) {
      toast.info('Please login to start writing');
      navigate('/login');
      return;
    }
    navigate('/editor');
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
  };

  const handleDifficultyChange = (event: SelectChangeEvent<string>) => {
    setSelectedDifficulty(event.target.value);
  };

  // Filter topics by search
  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 4,
          borderRadius: 4,
          textAlign: 'center',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha(theme.palette.secondary.dark, 0.15)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.08)} 100%)`,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Blog Topic Ideas
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
        >
          Need inspiration? Browse our curated collection of blog topic ideas or create your own.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            startIcon={<Shuffle />}
            onClick={handleGetRandom}
          >
            Surprise Me
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleWriteCustom}
          >
            Write Custom Topic
          </Button>
        </Stack>
      </Paper>

      {/* Selected Topic Action - Placed at top for visibility */}
      {selectedTopic && (
        <Paper
          ref={selectedTopicRef}
          sx={{
            p: 3,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
            borderRadius: 3,
            border: 2,
            borderColor: 'primary.main',
            boxShadow: (theme) => `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                boxShadow: (theme) => `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              },
              '50%': {
                boxShadow: (theme) => `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`,
              },
            },
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Selected Topic:
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {selectedTopic.title}
            </Typography>
            {selectedTopic.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {selectedTopic.description}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AutoAwesome />}
            onClick={() => handleWriteWithTopic(true)}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7b1fa2 30%, #512da8 90%)',
              },
            }}
          >
            Write About This Topic by AI
          </Button>
        </Paper>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 4, bgcolor: 'background.elevated', borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="topic-category-label">Category</InputLabel>
              <Select
                labelId="topic-category-label"
                id="topic-category-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="difficulty-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-label"
                id="difficulty-select"
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
                label="Difficulty"
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              onClick={() => {
                setSelectedCategory('');
                setSelectedDifficulty('');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Topics Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          : filteredTopics.map((topic, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={topic.id}
                sx={{
                  animation: 'fadeIn 0.5s ease-out forwards',
                  animationDelay: `${index * 0.05}s`,
                  opacity: 0,
                }}
              >
                <TopicCard
                  topic={topic}
                  onClick={handleSelectTopic}
                  selected={selectedTopic?.id === topic.id}
                />
              </Grid>
            ))}
      </Grid>

      {/* Empty State */}
      {!loading && filteredTopics.length === 0 && (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.elevated',
            borderRadius: 3,
          }}
        >
          <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No topics found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search query
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default Topics;
