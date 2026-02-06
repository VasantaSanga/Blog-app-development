/**
 * Upload Service
 * Business logic for file uploads
 */

import fs from 'fs';
import path from 'path';
import config from '../config/env.js';

class UploadService {
  /**
   * Get file URL (returns full URL for frontend access)
   */
  getFileUrl(filename: string): string {
    // Get base URL - use BACKEND_URL env var or construct from PORT
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${config.port}`;
    return `${baseUrl}/uploads/${filename}`;
  }

  /**
   * Delete file
   */
  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(config.uploadPath, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      throw { statusCode: 404, message: 'File not found' };
    }
  }

  /**
   * Validate file exists
   */
  fileExists(filename: string): boolean {
    const filePath = path.join(config.uploadPath, filename);
    return fs.existsSync(filePath);
  }
}

export const uploadService = new UploadService();
export default uploadService;
