/**
 * Blog Content Component
 * Renders blog HTML content with proper styling
 */

import React from 'react';
import { Box } from '@mui/material';

interface BlogContentProps {
  content: string;
}

function BlogContent({ content }: BlogContentProps) {
  return (
    <Box
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: content }}
      sx={{
        fontFamily: '"Crimson Pro", Georgia, serif',
        fontSize: '1.2rem',
        lineHeight: 1.8,
        color: 'text.primary',
        
        '& > * + *': {
          mt: 3,
        },

        // Headings
        '& h1, & h2, & h3, & h4': {
          fontFamily: '"Crimson Pro", Georgia, serif',
          fontWeight: 600,
          lineHeight: 1.3,
          mt: 4,
          mb: 2,
        },
        '& h1': { fontSize: '2.5rem' },
        '& h2': { fontSize: '2rem' },
        '& h3': { fontSize: '1.5rem' },
        '& h4': { fontSize: '1.25rem' },

        // Paragraphs
        '& p': {
          mb: 2,
        },

        // Lists
        '& ul, & ol': {
          pl: 3,
          mb: 2,
        },
        '& li': {
          mb: 1,
        },

        // Blockquotes
        '& blockquote': {
          pl: 3,
          borderLeft: 4,
          borderColor: 'primary.main',
          fontStyle: 'italic',
          my: 3,
          opacity: 0.9,
        },

        // Code
        '& code': {
          fontFamily: '"JetBrains Mono", monospace',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.06)',
          px: 0.75,
          py: 0.25,
          borderRadius: 0.5,
          fontSize: '0.9em',
        },

        // Pre/Code blocks
        '& pre': {
          fontFamily: '"JetBrains Mono", monospace',
          bgcolor: '#1e1e2e',
          color: '#cdd6f4',
          p: 2.5,
          borderRadius: 2,
          overflow: 'auto',
          my: 3,
          '& code': {
            bgcolor: 'transparent',
            p: 0,
            color: 'inherit',
            fontSize: '0.875rem',
          },
        },

        // Links
        '& a': {
          color: 'primary.main',
          textDecoration: 'underline',
          textUnderlineOffset: 3,
          '&:hover': {
            textDecorationThickness: 2,
          },
        },

        // Images
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: 2,
          my: 3,
        },

        // Horizontal rule
        '& hr': {
          border: 'none',
          height: 2,
          background: (theme) =>
            `linear-gradient(90deg, transparent, ${theme.palette.primary.main}50, transparent)`,
          my: 4,
        },

        // Strong & emphasis
        '& strong': {
          fontWeight: 600,
        },
        '& em': {
          fontStyle: 'italic',
        },
      }}
    />
  );
}

export default BlogContent;
