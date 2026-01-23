/**
 * Blog Editor Page
 * Create and edit blogs with rich text editor and auto-save
 */

import React, { useState, useEffect, useCallback, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
} from '@mui/material';
import {
  Publish,
  Save,
  Image as ImageIcon,
  Close,
  ArrowBack,
  Check,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import TipTapEditor from '../components/Editor/TipTapEditor';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { blogAPI, categoryAPI, uploadAPI } from '../services/api';
import { Category } from '../types';

function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(id);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef('');
  const hasCreatedDraft = useRef(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // UI state
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error' | null>(null);
  const [blogId, setBlogId] = useState<string | null>(id || null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  // Fetch categories and blog data on mount
  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Apply topic data from navigation state
  useEffect(() => {
    if (location.state?.suggestedTitle && !isEditing) {
      setTitle(location.state.suggestedTitle);
      if (location.state.suggestedTags) {
        setTags(location.state.suggestedTags);
      }
      if (location.state.categoryId) {
        setCategory(location.state.categoryId);
      }
    }
  }, [location.state, isEditing]);

  const fetchInitialData = async () => {
    try {
      const categoriesRes = await categoryAPI.getAll();
      setCategories(categoriesRes.data.data.categories);

      if (isEditing && id) {
        // Fetch the specific blog by ID
        try {
          const blogRes = await blogAPI.getById(id);
          const blog = blogRes.data.data.blog;
          setTitle(blog.title);
          setContent(blog.content);
          setExcerpt(blog.excerpt || '');
          setCoverImage(blog.coverImage || '');
          setCategory(blog.category?.id || '');
          setTags(blog.tags || []);
          lastSavedContentRef.current = blog.content;
          hasCreatedDraft.current = true;
        } catch (error) {
          console.error('Error fetching blog:', error);
          toast.error('Blog not found');
          navigate('/my-blogs');
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!blogId || !title.trim() || content === lastSavedContentRef.current) {
      return;
    }

    setAutoSaveStatus('saving');
    try {
      await blogAPI.autoSave(blogId, {
        title,
        content,
        excerpt,
        coverImage,
        category: category || null,
        tags,
      });
      lastSavedContentRef.current = content;
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus(null), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
    }
  }, [blogId, title, content, excerpt, coverImage, category, tags]);

  // Trigger auto-save on content change
  useEffect(() => {
    if (blogId && content) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer (save after 3 seconds of inactivity)
      autoSaveTimerRef.current = setTimeout(autoSave, 3000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, autoSave, blogId]);

  // Handle cover image upload
  const handleCoverImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      const response = await uploadAPI.uploadImage(file);
      setCoverImage(response.data.data.url);
      toast.success('Cover image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    }

    event.target.value = '';
  };

  // Handle tag input
  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Save as draft
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!content.trim()) {
      toast.error('Please write some content');
      return;
    }

    // Prevent duplicate draft creation
    if (hasCreatedDraft.current && !blogId) {
      toast.info('Draft already being saved...');
      return;
    }

    setSaving(true);
    hasCreatedDraft.current = true;

    try {
      const data = {
        title,
        content,
        excerpt,
        coverImage,
        category: category || null,
        tags,
        status: 'draft' as const,
      };

      if (blogId) {
        // Update existing blog
        await blogAPI.update(blogId, data);
        toast.success('Draft saved');
      } else {
        // Create new blog
        const response = await blogAPI.create(data);
        const newBlogId = response.data.data.blog.id;
        setBlogId(newBlogId);
        // Update URL without navigation to prevent re-render
        window.history.replaceState(null, '', `/editor/${newBlogId}`);
        toast.success('Draft created');
      }
      lastSavedContentRef.current = content;
    } catch (error) {
      console.error('Save draft error:', error);
      toast.error('Failed to save draft');
      hasCreatedDraft.current = false;
    } finally {
      setSaving(false);
    }
  };

  // Publish blog
  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!content.trim()) {
      toast.error('Please write some content');
      return;
    }

    setPublishing(true);
    try {
      let currentBlogId = blogId;

      if (!currentBlogId) {
        // Create blog first
        const createRes = await blogAPI.create({
          title,
          content,
          excerpt,
          coverImage,
          category: category || null,
          tags,
          status: 'draft' as const,
        });
        currentBlogId = createRes.data.data.blog.id;
        setBlogId(currentBlogId);
      } else {
        // Update blog first
        await blogAPI.update(currentBlogId, {
          title,
          content,
          excerpt,
          coverImage,
          category: category || null,
          tags,
        });
      }

      // Publish
      const publishRes = await blogAPI.publish(currentBlogId);
      toast.success('Blog published successfully!');
      navigate(`/blog/${publishRes.data.data.blog.slug}`);
    } catch (error: unknown) {
      console.error('Publish error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to publish blog');
    } finally {
      setPublishing(false);
      setPublishDialogOpen(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value);
  };

  if (loading) {
    return <LoadingSpinner message="Loading editor..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight={600}>
            {isEditing ? 'Edit Blog' : 'Create Blog'}
          </Typography>
          
          {/* Auto-save status */}
          {autoSaveStatus && (
            <Chip
              size="small"
              icon={autoSaveStatus === 'saved' ? <Check /> : undefined}
              label={
                autoSaveStatus === 'saving'
                  ? 'Saving...'
                  : autoSaveStatus === 'saved'
                  ? 'Saved'
                  : 'Save failed'
              }
              color={autoSaveStatus === 'error' ? 'error' : 'default'}
              sx={{ animation: 'fadeIn 0.3s ease' }}
            />
          )}
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={saving ? <CircularProgress size={18} /> : <Save />}
            onClick={handleSaveDraft}
            disabled={saving || publishing}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            startIcon={publishing ? <CircularProgress size={18} color="inherit" /> : <Publish />}
            onClick={() => setPublishDialogOpen(true)}
            disabled={saving || publishing}
          >
            Publish
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {/* Main Editor */}
        <Grid item xs={12} lg={8}>
          {/* Title */}
          <TextField
            fullWidth
            placeholder="Enter your blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                fontFamily: '"Crimson Pro", serif',
                fontWeight: 600,
                lineHeight: 1.3,
              },
            }}
            sx={{ mb: 4 }}
          />

          {/* Editor */}
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your story..."
          />
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 3,
              bgcolor: 'background.elevated',
              borderRadius: 3,
              position: { lg: 'sticky' },
              top: { lg: 100 },
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Post Settings
            </Typography>

            {/* Cover Image */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Cover Image
              </Typography>
              {coverImage ? (
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={coverImage}
                    alt="Cover"
                    style={{
                      width: '100%',
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setCoverImage('')}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  fullWidth
                  sx={{ height: 100 }}
                >
                  Upload Cover
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                  />
                </Button>
              )}
            </Box>

            {/* Category */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                value={category}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Tags */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <TextField
                fullWidth
                placeholder="Add tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                size="small"
                sx={{ mb: 1 }}
              />
              <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    onDelete={() => removeTag(tag)}
                  />
                ))}
              </Stack>
            </Box>

            {/* Excerpt */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Excerpt (optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Brief description of your blog..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                size="small"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Publish Confirmation Dialog */}
      <Dialog open={publishDialogOpen} onClose={() => setPublishDialogOpen(false)}>
        <DialogTitle>Publish Blog</DialogTitle>
        <DialogContent>
          <Typography>
            Are you ready to publish "{title || 'Untitled'}"? Published blogs will be visible to everyone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePublish}
            disabled={publishing}
            startIcon={publishing ? <CircularProgress size={18} color="inherit" /> : <Publish />}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BlogEditor;
