/**
 * Search Page
 * Search and filter blogs
 */

import React, { useState, useEffect, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Paper,
  InputAdornment,
  Skeleton,
  Pagination,
  alpha,
  SelectChangeEvent,
} from '@mui/material';
import { Search as SearchIcon, Tag as TagIcon } from '@mui/icons-material';
import BlogCard from '../components/Blog/BlogCard';
import { blogAPI, categoryAPI } from '../services/api';
import { Blog, Category, Tag } from '../types';

interface BlogParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  tag?: string;
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedTag, page]);

  useEffect(() => {
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTag) params.set('tag', selectedTag);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedTag, setSearchParams]);

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        categoryAPI.getAll(),
        blogAPI.getTags(),
      ]);
      setCategories(categoriesRes.data.data.categories || []);
      setTags(tagsRes.data.data.tags || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params: BlogParams = { page, limit: 12 };
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedTag) params.tag = selectedTag;

      const response = await blogAPI.getAll(params);
      setBlogs(response.data.data.blogs || []);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handleTagChange = (event: SelectChangeEvent<string>) => {
    setSelectedTag(event.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
    setPage(1);
  };

  return (
    <Box>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 4,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <Typography variant="h3" sx={{ mb: 3, fontFamily: '"Crimson Pro", serif' }}>
          Explore Blogs
        </Typography>

        {/* Search Form */}
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            placeholder="Search for blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </form>

        {/* Filters */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="search-category-label">Category</InputLabel>
              <Select
                labelId="search-category-label"
                id="search-category-select"
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
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="search-tag-label">Tag</InputLabel>
              <Select
                labelId="search-tag-label"
                id="search-tag-select"
                value={selectedTag}
                onChange={handleTagChange}
                label="Tag"
              >
                <MenuItem value="">All Tags</MenuItem>
                {tags.map((tag) => (
                  <MenuItem key={tag.name} value={tag.name}>
                    #{tag.name} ({tag.count})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            {(searchQuery || selectedCategory || selectedTag) && (
              <Chip
                label="Clear Filters"
                onClick={clearFilters}
                onDelete={clearFilters}
                variant="outlined"
              />
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Results Info */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Searching...' : `${pagination.total} blogs found`}
        </Typography>

        {/* Active Filters */}
        <Stack direction="row" spacing={1}>
          {searchQuery && (
            <Chip
              size="small"
              label={`Search: "${searchQuery}"`}
              onDelete={() => setSearchQuery('')}
            />
          )}
          {selectedCategory && (
            <Chip
              size="small"
              label={`Category: ${categories.find((c) => c.id === selectedCategory)?.name}`}
              onDelete={() => setSelectedCategory('')}
            />
          )}
          {selectedTag && (
            <Chip
              size="small"
              icon={<TagIcon fontSize="small" />}
              label={selectedTag}
              onDelete={() => setSelectedTag('')}
            />
          )}
        </Stack>
      </Box>

      {/* Popular Tags */}
      {tags.length > 0 && !selectedTag && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Popular Tags:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {tags.slice(0, 10).map((tag) => (
              <Chip
                key={tag.name}
                label={`#${tag.name}`}
                size="small"
                variant="outlined"
                onClick={() => {
                  setSelectedTag(tag.name);
                  setPage(1);
                }}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Blog Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
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
                  display: 'flex',
                  flexDirection: 'column',
                  animation: 'fadeIn 0.5s ease-out forwards',
                  animationDelay: `${index * 0.05}s`,
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
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No blogs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Paper>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
}

export default Search;
