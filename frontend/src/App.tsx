/**
 * Main App Component
 * Sets up routing, theme provider, and global state
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeContextProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';

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

function App(): JSX.Element {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/blog/:slug" element={<BlogView />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/editor" element={
                <PrivateRoute>
                  <BlogEditor />
                </PrivateRoute>
              } />
              <Route path="/editor/:id" element={
                <PrivateRoute>
                  <BlogEditor />
                </PrivateRoute>
              } />
              <Route path="/my-blogs" element={
                <PrivateRoute>
                  <MyBlogs />
                </PrivateRoute>
              } />
            </Routes>
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
