/**
 * Image URL Utilities
 * Handles image URL formatting for display
 */

const API_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Get full image URL from relative or absolute path
 * @param imagePath - Relative path (e.g., /uploads/image.jpg) or absolute URL
 * @returns Full URL for image display
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return '';
  }

  // If already a full URL (starts with http:// or https://), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If relative path (starts with /), prepend base URL
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // Otherwise, assume it's a relative path and prepend base URL + /uploads
  return `${API_BASE_URL}/uploads/${imagePath}`;
};
