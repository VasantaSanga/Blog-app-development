/**
 * Footer Component
 */

import React from 'react';
import { Box, Container, Typography, Link, IconButton, Stack } from '@mui/material';
import { GitHub, Twitter, LinkedIn } from '@mui/icons-material';

function Footer(): JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Crimson Pro", serif',
                fontWeight: 700,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              Scribely
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Write. Publish. Inspire.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Link href="#" color="text.secondary" underline="hover">
              About
            </Link>
            <Link href="#" color="text.secondary" underline="hover">
              Privacy
            </Link>
            <Link href="#" color="text.secondary" underline="hover">
              Terms
            </Link>
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <Twitter fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <GitHub fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <LinkedIn fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 3 }}
        >
          © {new Date().getFullYear()} Scribely. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
