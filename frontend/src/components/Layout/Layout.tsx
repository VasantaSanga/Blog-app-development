/**
 * Main Layout Component
 * Wraps all pages with navigation and footer
 */

import React, { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: { xs: 8, sm: 10 },
          pb: 4,
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

export default Layout;
