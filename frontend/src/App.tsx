/**
 * Main App Component
 * Sets up routing, theme provider, and global state
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeContextProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';
import { PageWrapper } from './components/Common/Animations';

// Pages
import Home from './pages/Home';
import BlogView from './pages/BlogView';
import BlogEditor from './pages/BlogEditor';
import Topics from './pages/Topics';
import MyBlogs from './pages/MyBlogs';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';

import './index.css';

// Animated Routes wrapper
function AnimatedRoutes(): JSX.Element {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={
          <PageWrapper>
            <Home />
          </PageWrapper>
        } />
        <Route path="/blog/:slug" element={
          <PageWrapper>
            <BlogView />
          </PageWrapper>
        } />
        <Route path="/topics" element={
          <PageWrapper>
            <Topics />
          </PageWrapper>
        } />
        <Route path="/search" element={
          <PageWrapper>
            <Search />
          </PageWrapper>
        } />
        <Route path="/login" element={
          <PageWrapper>
            <Login />
          </PageWrapper>
        } />
        <Route path="/register" element={
          <PageWrapper>
            <Register />
          </PageWrapper>
        } />

        {/* Protected Routes */}
        <Route path="/editor" element={
          <PrivateRoute>
            <PageWrapper>
              <BlogEditor />
            </PageWrapper>
          </PrivateRoute>
        } />
        <Route path="/editor/:id" element={
          <PrivateRoute>
            <PageWrapper>
              <BlogEditor />
            </PageWrapper>
          </PrivateRoute>
        } />
        <Route path="/my-blogs" element={
          <PrivateRoute>
            <PageWrapper>
              <MyBlogs />
            </PageWrapper>
          </PrivateRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App(): JSX.Element {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </Router>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
