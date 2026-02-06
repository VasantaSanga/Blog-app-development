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
import { motion, AnimatePresence } from 'framer-motion';
import TopicCard from '../components/Common/TopicCard';
import { topicAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Topic, Category } from '../types';
import { ScrollReveal, staggerContainer, fadeInUp } from '../components/Common/Animations';

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
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 4,
          borderRadius: 4,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha(theme.palette.secondary.dark, 0.15)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.08)} 100%)`,
        }}
      >
        {/* Animated background */}
        <Box
          component={motion.div}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 15,
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
            opacity: 0.4,
            background: `radial-gradient(circle at 30% 50%, ${alpha('#6366f1', 0.2)} 0%, transparent 40%),
                         radial-gradient(circle at 70% 80%, ${alpha('#ec4899', 0.2)} 0%, transparent 40%)`,
            backgroundSize: '200% 200%',
            pointerEvents: 'none',
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              position: 'relative',
            }}
          >
            Blog Topic Ideas
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', mb: 4, position: 'relative' }}
          >
            Need inspiration? Browse our curated collection of blog topic ideas or create your own.
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ position: 'relative' }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                startIcon={<Shuffle />}
                onClick={handleGetRandom}
              >
                Surprise Me
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleWriteCustom}
              >
                Write Custom Topic
              </Button>
            </motion.div>
          </Stack>
        </motion.div>
      </Paper>

      {/* Selected Topic Action - Placed at top for visibility */}
      <AnimatePresence>
        {selectedTopic && (
          <Paper
            ref={selectedTopicRef}
            component={motion.div}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
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
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                startIcon={<AutoAwesome />}
                onClick={() => handleWriteWithTopic(true)}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderColor: 'secondary.main',
                  '&:hover': {
                    borderColor: 'secondary.dark',
                    bgcolor: 'secondary.dark',
                    color: 'white',
                  },
                }}
              >
                Generate by AI
              </Button>
            </motion.div>
          </Paper>
        )}
      </AnimatePresence>

      {/* Filters */}
      <ScrollReveal direction="up" delay={0.1}>
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
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
              </motion.div>
            </Grid>
          </Grid>
        </Paper>
      </ScrollReveal>

      {/* Topics Grid */}
      <Grid 
        container 
        spacing={3}
        component={motion.div}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
                </motion.div>
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
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <motion.div
                  variants={fadeInUp}
                  layout
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <TopicCard
                    topic={topic}
                    onClick={handleSelectTopic}
                    selected={selectedTopic?.id === topic.id}
                  />
                </motion.div>
              </Grid>
            ))}
      </Grid>

      {/* Empty State */}
      <AnimatePresence>
        {!loading && filteredTopics.length === 0 && (
          <Paper
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            sx={{
              p: 6,
              textAlign: 'center',
              bgcolor: 'background.elevated',
              borderRadius: 3,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            </motion.div>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No topics found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or search query
            </Typography>
          </Paper>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default Topics;
