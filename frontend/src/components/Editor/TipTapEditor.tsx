/**
 * TipTap Rich Text Editor Component
 * Full-featured blog editor with formatting options
 */

import React, { useCallback, ChangeEvent, ReactNode, MouseEvent } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import {
  Box,
  Paper,
  IconButton,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  Code,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  HorizontalRule,
  Link as LinkIcon,
  Image as ImageIcon,
  Title,
  Undo,
  Redo,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { uploadAPI } from '../../services/api';

// Create lowlight instance
const lowlight = createLowlight(common);

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

function TipTapEditor({ content, onChange, placeholder = 'Start writing your blog...' }: TipTapEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [headingMenuAnchor, setHeadingMenuAnchor] = React.useState<HTMLElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'blog-image',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when prop changes (e.g., when AI generates content)
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleImageUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      const response = await uploadAPI.uploadImage(file);
      const imageUrl = response.data.data.url;
      
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    }

    // Reset input
    event.target.value = '';
  }, [editor]);

  const setLink = useCallback(() => {
    if (!linkUrl) {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkDialogOpen(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const openLinkDialog = () => {
    const previousUrl = editor?.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkDialogOpen(true);
  };

  if (!editor) {
    return null;
  }

  interface ToolbarButtonProps {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    isActive?: boolean;
    disabled?: boolean;
    children: ReactNode;
    tooltip: string;
  }

  const ToolbarButton = ({ onClick, isActive, disabled, children, tooltip }: ToolbarButtonProps) => (
    <Tooltip title={tooltip} arrow>
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          sx={{
            color: isActive ? 'primary.main' : 'text.secondary',
            bgcolor: isActive ? 'action.selected' : 'transparent',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <Box>
      {/* Toolbar */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 0.5,
          p: 1,
          mb: 2,
          bgcolor: 'background.elevated',
          borderRadius: 2,
          position: 'sticky',
          top: 80,
          zIndex: 10,
        }}
      >
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="Undo"
        >
          <Undo fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="Redo"
        >
          <Redo fontSize="small" />
        </ToolbarButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Headings */}
        <ToolbarButton
          onClick={(e: MouseEvent<HTMLButtonElement>) => setHeadingMenuAnchor(e.currentTarget)}
          isActive={editor.isActive('heading')}
          tooltip="Headings"
        >
          <Title fontSize="small" />
        </ToolbarButton>
        <Menu
          anchorEl={headingMenuAnchor}
          open={Boolean(headingMenuAnchor)}
          onClose={() => setHeadingMenuAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
              setHeadingMenuAnchor(null);
            }}
            selected={editor.isActive('heading', { level: 1 })}
          >
            Heading 1
          </MenuItem>
          <MenuItem
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
              setHeadingMenuAnchor(null);
            }}
            selected={editor.isActive('heading', { level: 2 })}
          >
            Heading 2
          </MenuItem>
          <MenuItem
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
              setHeadingMenuAnchor(null);
            }}
            selected={editor.isActive('heading', { level: 3 })}
          >
            Heading 3
          </MenuItem>
          <MenuItem
            onClick={() => {
              editor.chain().focus().setParagraph().run();
              setHeadingMenuAnchor(null);
            }}
            selected={!editor.isActive('heading')}
          >
            Paragraph
          </MenuItem>
        </Menu>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          tooltip="Bold (Ctrl+B)"
        >
          <FormatBold fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          tooltip="Italic (Ctrl+I)"
        >
          <FormatItalic fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          tooltip="Underline (Ctrl+U)"
        >
          <FormatUnderlined fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          tooltip="Strikethrough"
        >
          <FormatStrikethrough fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          tooltip="Inline Code"
        >
          <Code fontSize="small" />
        </ToolbarButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          tooltip="Bullet List"
        >
          <FormatListBulleted fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          tooltip="Numbered List"
        >
          <FormatListNumbered fontSize="small" />
        </ToolbarButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Block elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          tooltip="Quote"
        >
          <FormatQuote fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          tooltip="Code Block"
        >
          <Code fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          tooltip="Horizontal Rule"
        >
          <HorizontalRule fontSize="small" />
        </ToolbarButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Link */}
        <ToolbarButton
          onClick={openLinkDialog}
          isActive={editor.isActive('link')}
          tooltip="Add Link"
        >
          <LinkIcon fontSize="small" />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton
          onClick={() => document.getElementById('image-upload')?.click()}
          tooltip="Insert Image"
        >
          <ImageIcon fontSize="small" />
        </ToolbarButton>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </Paper>

      {/* Editor Content */}
      <Paper
        sx={{
          p: 3,
          minHeight: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          '& .ProseMirror': {
            outline: 'none',
          },
        }}
      >
        <EditorContent editor={editor} />
      </Paper>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            variant="outlined"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button onClick={setLink} variant="contained">
            {linkUrl ? 'Set Link' : 'Remove Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TipTapEditor;
