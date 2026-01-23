/**
 * Navigation Bar Component
 * Responsive navbar with theme toggle and user menu
 */

import React, { useState, FormEvent, MouseEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputBase,
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  DarkMode,
  LightMode,
  Menu as MenuIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  Explore as ExploreIcon,
  Article as ArticleIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface NavLink {
  label: string;
  path: string;
  icon: JSX.Element;
}

function Navbar(): JSX.Element {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeContext();
  const { user, isAuthenticated, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUserMenuOpen = (event: MouseEvent<HTMLElement>): void => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = (): void => {
    setUserMenuAnchor(null);
  };

  const handleLogout = (): void => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const handleSearch = (e: FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks: NavLink[] = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Topics', path: '/topics', icon: <ExploreIcon /> },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
          {/* Logo */}
          <Typography
            component={RouterLink}
            to="/"
            variant="h5"
            sx={{
              fontFamily: '"Crimson Pro", serif',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              letterSpacing: '-0.5px',
            }}
          >
            Scribely
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              {/* Search Bar */}
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: alpha(theme.palette.text.primary, 0.04),
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  flex: 1,
                  maxWidth: 400,
                  mx: 4,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.text.primary, 0.06),
                  },
                }}
              >
                <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                <InputBase
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    flex: 1,
                    color: 'text.primary',
                    '& input::placeholder': {
                      color: 'text.secondary',
                      opacity: 1,
                    },
                  }}
                />
              </Box>

              {/* Nav Links */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    sx={{ color: 'text.primary' }}
                  >
                    {link.label}
                  </Button>
                ))}

                {/* Theme Toggle */}
                <IconButton onClick={toggleTheme} sx={{ color: 'text.primary' }}>
                  {mode === 'dark' ? <LightMode /> : <DarkMode />}
                </IconButton>

                {/* Auth Buttons / User Menu */}
                {isAuthenticated ? (
                  <>
                    <Button
                      component={RouterLink}
                      to="/editor"
                      variant="contained"
                      startIcon={<EditIcon />}
                      sx={{ ml: 1 }}
                    >
                      Write
                    </Button>
                    <IconButton onClick={handleUserMenuOpen} sx={{ ml: 1 }}>
                      <Avatar
                        src={user?.avatar}
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: 'primary.main',
                          fontSize: '0.875rem',
                        }}
                      >
                        {user?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/login"
                      sx={{ color: 'text.primary' }}
                    >
                      Sign In
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={toggleTheme} sx={{ color: 'text.primary' }}>
                {mode === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          component={RouterLink}
          to="/my-blogs"
          onClick={handleUserMenuClose}
        >
          <ListItemIcon>
            <ArticleIcon fontSize="small" />
          </ListItemIcon>
          My Blogs
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to="/editor"
          onClick={handleUserMenuClose}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Write Blog
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontFamily='"Crimson Pro", serif' fontWeight={700}>
            Menu
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        
        {/* Mobile Search */}
        <Box
          component="form"
          onSubmit={(e: FormEvent) => {
            handleSearch(e);
            setMobileMenuOpen(false);
          }}
          sx={{ px: 2, py: 1.5 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: alpha(theme.palette.text.primary, 0.04),
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, color: 'text.primary' }}
            />
          </Box>
        </Box>
        
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
          
          {isAuthenticated ? (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/editor"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon><EditIcon /></ListItemIcon>
                  <ListItemText primary="Write Blog" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/my-blogs"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon><ArticleIcon /></ListItemIcon>
                  <ListItemText primary="My Blogs" />
                </ListItemButton>
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <ListItemIcon><LogoutIcon sx={{ color: 'error.main' }} /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText primary="Sign In" />
                </ListItemButton>
              </ListItem>
              <Box sx={{ px: 2, py: 1 }}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Button>
              </Box>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
