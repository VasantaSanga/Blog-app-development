/**
 * Comment Section Component
 * Displays and manages blog comments
 */

import React, { useState, useEffect, useRef, FormEvent, MouseEvent } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  MoreVert,
  Reply,
  Edit,
  Delete,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { commentAPI } from '../../services/api';
import { Comment } from '../../types';

interface CommentSectionProps {
  blogId: string;
}

function CommentSection({ blogId }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  
  // Ref for the comment input field
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  // Focus on comment input when editing starts
  useEffect(() => {
    if (editingComment && commentInputRef.current) {
      commentInputRef.current.focus();
      // Scroll to the input
      commentInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [editingComment]);

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getByBlog(blogId);
      setComments(response.data.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const data = {
        content: newComment,
        blogId,
        ...(replyTo && { parentCommentId: replyTo.id }),
      };

      await commentAPI.create(data);
      setNewComment('');
      setReplyTo(null);
      fetchComments();
      toast.success('Comment posted!');
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editingComment || !newComment.trim()) return;

    setSubmitting(true);
    try {
      await commentAPI.update(editingComment.id, newComment);
      setNewComment('');
      setEditingComment(null);
      fetchComments();
      toast.success('Comment updated!');
    } catch (error) {
      toast.error('Failed to update comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await commentAPI.delete(commentId);
      fetchComments();
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
    setMenuAnchor(null);
  };

  const handleLike = async (commentId: string) => {
    if (!isAuthenticated) {
      toast.info('Please login to like comments');
      return;
    }

    try {
      await commentAPI.toggleLike(commentId);
      fetchComments();
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  const openMenu = (event: MouseEvent<HTMLButtonElement>, comment: Comment) => {
    setMenuAnchor(event.currentTarget);
    setSelectedComment(comment);
  };

  const startEdit = () => {
    if (selectedComment) {
      setEditingComment(selectedComment);
      setNewComment(selectedComment.content);
    }
    setMenuAnchor(null);
  };

  const startReply = (comment: Comment) => {
    setReplyTo(comment);
    setEditingComment(null);
    setNewComment('');
  };

  const cancelAction = () => {
    setReplyTo(null);
    setEditingComment(null);
    setNewComment('');
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isOwner = user?.id === comment.author?.id;
    const isLiked = user?.id ? comment.likes?.includes(user.id) : false;

    return (
      <Box
        key={comment.id}
        sx={{
          ml: isReply ? 5 : 0,
          mt: isReply ? 2 : 0,
          mb: isReply ? 0 : 3,
          pl: isReply ? 2 : 0,
          borderLeft: isReply ? 2 : 0,
          borderColor: isReply ? 'primary.main' : 'transparent',
        }}
      >
        <Paper
          elevation={isReply ? 0 : 1}
          sx={{
            p: 2,
            bgcolor: isReply ? 'background.paper' : 'background.elevated',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                src={comment.author?.avatar}
                sx={{ width: 32, height: 32, fontSize: '0.875rem' }}
              >
                {comment.author?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {comment.author?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                  {comment.isEdited && ' (edited)'}
                </Typography>
              </Box>
            </Box>

            {isOwner && (
              <IconButton size="small" onClick={(e) => openMenu(e, comment)}>
                <MoreVert fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
            {comment.content}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              size="small"
              startIcon={isLiked ? <Favorite sx={{ color: 'error.main' }} /> : <FavoriteBorder />}
              onClick={() => handleLike(comment.id)}
              sx={{ color: 'text.secondary' }}
            >
              {comment.likeCount || 0}
            </Button>
            {!isReply && isAuthenticated && (
              <Button
                size="small"
                startIcon={<Reply />}
                onClick={() => startReply(comment)}
                sx={{ color: 'text.secondary' }}
              >
                Reply
              </Button>
            )}
          </Box>

          {/* Reply form - inside the Paper for visual connection */}
          {replyTo?.id === comment.id && (
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Replying to {comment.author?.name}
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Write a reply..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  size="small"
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={submitting || !newComment.trim()}
                  >
                    {submitting ? <CircularProgress size={20} /> : 'Reply'}
                  </Button>
                  <Button size="small" onClick={cancelAction}>
                    Cancel
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </Paper>

        {/* Replies - rendered outside Paper with proper spacing */}
        {comment.replies && comment.replies.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {comment.replies.map((reply) => renderComment(reply, true))}
          </Box>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontFamily: '"Crimson Pro", serif' }}>
        Comments ({comments.length})
      </Typography>

      {/* Comment form */}
      {isAuthenticated ? (
        <Paper sx={{ p: 2, mb: 4, bgcolor: 'background.paper' }}>
          <form onSubmit={editingComment ? handleEdit : handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar
                src={user?.avatar}
                sx={{ width: 40, height: 40 }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder={editingComment ? 'Edit your comment...' : 'Share your thoughts...'}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  inputRef={commentInputRef}
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting || !newComment.trim()}
                  >
                    {submitting ? (
                      <CircularProgress size={20} />
                    ) : editingComment ? (
                      'Update'
                    ) : (
                      'Comment'
                    )}
                  </Button>
                  {(editingComment || replyTo) && (
                    <Button onClick={cancelAction}>Cancel</Button>
                  )}
                </Box>
              </Box>
            </Box>
          </form>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, mb: 4, textAlign: 'center', bgcolor: 'background.elevated' }}>
          <Typography color="text.secondary">
            Please sign in to leave a comment
          </Typography>
        </Paper>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Comments list */}
      {comments.length > 0 ? (
        comments.map((comment) => renderComment(comment))
      ) : (
        <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
          No comments yet. Be the first to share your thoughts!
        </Typography>
      )}

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={startEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => selectedComment && handleDelete(selectedComment.id)}
          sx={{ color: 'error.main' }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default CommentSection;
