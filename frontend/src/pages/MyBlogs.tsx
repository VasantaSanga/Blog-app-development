/**
 * My Blogs Page
 * Manage user's drafts and published blogs
 */

import React, { useState, useEffect, MouseEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Button,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Publish,
  Unpublished,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import BlogCard from '../components/Blog/BlogCard';
import { blogAPI } from '../services/api';
import { Blog } from '../types';

function MyBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const status = tabValue === 0 ? undefined : tabValue === 1 ? 'published' : 'draft';
      const response = await blogAPI.getMyBlogs({ status, limit: 50 });
      setBlogs(response.data.data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>, blog: Blog) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedBlog(blog);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedBlog(null);
  };

  const handleEdit = () => {
    if (selectedBlog) navigate(`/editor/${selectedBlog.id}`);
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedBlog) navigate(`/blog/${selectedBlog.slug}`);
    handleMenuClose();
  };

  const handlePublish = async () => {
    if (!selectedBlog) return;
    try {
      await blogAPI.publish(selectedBlog.id);
      toast.success('Blog published!');
      fetchBlogs();
    } catch (error: unknown) {
      console.error('Publish error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to publish blog');
    }
    handleMenuClose();
  };

  const handleUnpublish = async () => {
    if (!selectedBlog) return;
    try {
      await blogAPI.unpublish(selectedBlog.id);
      toast.success('Blog reverted to draft');
      fetchBlogs();
    } catch (error: unknown) {
      console.error('Unpublish error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to unpublish blog');
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBlog) return;
    try {
      await blogAPI.delete(selectedBlog.id);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch (error: unknown) {
      console.error('Delete error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete blog');
    }
    setDeleteDialogOpen(false);
    handleMenuClose();
  };

  const BlogCardWithMenu = ({ blog }: { blog: Blog }) => (
    <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <BlogCard blog={blog} />
      <IconButton
        size="small"
        onClick={(e) => handleMenuOpen(e, blog)}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'background.paper',
          boxShadow: 1,
          '&:hover': {
            bgcolor: 'background.paper',
          },
        }}
      >
        <MoreVert fontSize="small" />
      </IconButton>
    </Box>
  );

  // Count based on actual status (uppercase from DB)
  const draftCount = blogs.filter((b) => b.status === 'DRAFT').length;
  const publishedCount = blogs.filter((b) => b.status === 'PUBLISHED').length;

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
        <Typography variant="h3" sx={{ fontFamily: '"Crimson Pro", serif' }}>
          My Blogs
        </Typography>
        <Button
          component={RouterLink}
          to="/editor"
          variant="contained"
          startIcon={<Add />}
        >
          New Blog
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                All
                <Chip label={blogs.length} size="small" />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Published
                <Chip label={publishedCount} size="small" color="success" />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Drafts
                <Chip label={draftCount} size="small" color="warning" />
              </Box>
            }
          />
        </Tabs>
      </Box>

      {/* Blog Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
              </Grid>
            ))
          : blogs.map((blog) => (
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
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <BlogCardWithMenu blog={blog} />
                </Box>
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
            {tabValue === 2
              ? 'No drafts yet'
              : tabValue === 1
              ? 'No published blogs yet'
              : 'No blogs yet'}
          </Typography>
          <Button
            component={RouterLink}
            to="/editor"
            variant="contained"
            startIcon={<Add />}
          >
            Create Your First Blog
          </Button>
        </Paper>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 180 },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        {selectedBlog?.status === 'PUBLISHED' && (
          <MenuItem onClick={handleView}>
            <Visibility fontSize="small" sx={{ mr: 1 }} />
            View
          </MenuItem>
        )}
        {selectedBlog?.status === 'DRAFT' ? (
          <MenuItem onClick={handlePublish}>
            <Publish fontSize="small" sx={{ mr: 1 }} />
            Publish
          </MenuItem>
        ) : (
          <MenuItem onClick={handleUnpublish}>
            <Unpublished fontSize="small" sx={{ mr: 1 }} />
            Unpublish
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{selectedBlog?.title}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyBlogs;
