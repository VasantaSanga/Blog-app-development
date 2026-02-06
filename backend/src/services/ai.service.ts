/**
 * AI Service
 * Google Gemini AI integration for blog content generation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/env.js';

class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

  constructor() {
    if (config.geminiApiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
        // Use gemini-2.0-flash (available for new projects in 2025)
        // Note: gemini-1.5-pro and gemini-1.5-flash are no longer available for new projects
        // Alternative fallback: gemini-3-flash-preview or gemini-3-pro-preview
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        console.log('AI Service initialized successfully with model: gemini-2.0-flash');
      } catch (error) {
        console.error('Failed to initialize AI Service with gemini-2.0-flash:', error);
        // Try fallback models
        try {
          this.model = this.genAI!.getGenerativeModel({ model: 'gemini-3-flash-preview' });
          console.log('AI Service initialized with fallback model: gemini-3-flash-preview');
        } catch (fallbackError1) {
          console.error('Fallback model gemini-3-flash-preview failed:', fallbackError1);
          try {
            this.model = this.genAI!.getGenerativeModel({ model: 'gemini-3-pro-preview' });
            console.log('AI Service initialized with fallback model: gemini-3-pro-preview');
          } catch (fallbackError2) {
            console.error('All models failed to initialize:', fallbackError2);
            this.genAI = null;
            this.model = null;
          }
        }
      }
    } else {
      console.warn('GEMINI_API_KEY not found in environment variables. AI service will not be available.');
    }
  }

  /**
   * Check if AI service is available
   */
  isAvailable(): boolean {
    return this.model !== null;
  }

  /**
   * Generate blog content based on title and optional context
   */
  async generateBlogContent(input: {
    title: string;
    tags?: string[];
    category?: string;
    tone?: 'professional' | 'casual' | 'technical' | 'creative';
  }): Promise<string> {
    if (!this.model) {
      throw { statusCode: 503, message: 'AI service is not configured. Please add GEMINI_API_KEY to environment variables.' };
    }

    const { title, tags = [], category, tone = 'professional' } = input;

    const prompt = this.buildPrompt(title, tags, category, tone);

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Convert markdown to HTML for the editor
      const htmlContent = this.markdownToHtml(text);

      return htmlContent;
    } catch (error: unknown) {
      console.error('Gemini AI error details:', error);
      
      // Extract error message from various error formats
      let errorMessage = 'AI generation failed';
      
      if (error && typeof error === 'object') {
        const err = error as any;
        
        // Handle GoogleGenerativeAI errors
        if (err.message) {
          errorMessage = `AI generation failed: ${err.message}`;
        } else if (err.error?.message) {
          errorMessage = `AI generation failed: ${err.error.message}`;
        } else if (err.statusText) {
          errorMessage = `AI generation failed: ${err.statusText}`;
        }
        
        // Add status code if available
        if (err.status) {
          errorMessage += ` (Status: ${err.status})`;
        } else if (err.error?.status) {
          errorMessage += ` (Status: ${err.error.status})`;
        }
      }
      
      // Create proper error object that error handler can process
      const appError = new Error(errorMessage) as Error & { statusCode?: number };
      appError.statusCode = 500;
      throw appError;
    }
  }

  /**
   * Build the prompt for content generation with human-like writing style
   */
  private buildPrompt(
    title: string,
    tags: string[],
    category?: string,
    tone?: string
  ): string {
    const toneDescriptions: Record<string, string> = {
      professional: 'professional yet approachable, like a knowledgeable friend sharing expertise',
      casual: 'casual and conversational, like chatting with a friend over coffee',
      technical: 'technically accurate but accessible, explaining complex concepts simply',
      creative: 'creative and expressive, with vivid language and unique perspectives',
    };

    const toneDesc = toneDescriptions[tone || 'professional'] || toneDescriptions.professional;

    let prompt = `You are a skilled human blogger with years of experience writing engaging content. Write a blog post with the title: "${title}"

CRITICAL WRITING STYLE REQUIREMENTS:
- Write like a REAL HUMAN, not an AI. Your writing should feel genuine, personal, and authentic.
- Use a ${toneDesc} tone throughout.
- Include personal touches: share relatable experiences, use "I" and "you" naturally, admit uncertainties with phrases like "in my experience" or "I've found that"
- Vary your sentence structure - mix short punchy sentences with longer flowing ones
- Use conversational transitions like "Here's the thing...", "Now, let's talk about...", "You might be wondering..."
- Add subtle humor or wit where appropriate - don't be boring!
- Include rhetorical questions to engage readers: "Ever felt like...?", "Sound familiar?"
- Use contractions naturally (don't, won't, it's, you're) - avoid overly formal language
- Share specific, concrete examples rather than generic statements
- Express genuine opinions and perspectives, not just neutral facts
- Avoid clichés, buzzwords, and corporate jargon
- Don't use phrases that sound AI-generated like "In today's fast-paced world", "It's important to note", "In conclusion", "Let's dive in"
- Write like you're having a conversation with the reader, not lecturing them

CONTENT STRUCTURE:
- Start with a hook that grabs attention - a surprising fact, a relatable problem, or an intriguing question
- Use ## for main sections and ### for subsections (but make headings interesting, not generic)
- Include practical, actionable insights the reader can actually use
- End with a thought-provoking conclusion or genuine call-to-action (not generic "share your thoughts below")
- Aim for 800-1200 words

THINGS TO AVOID:
- Generic introductions and conclusions
- Overuse of bullet points (use them sparingly for impact)
- Repetitive sentence patterns
- Excessive use of adjectives and adverbs
- Stating the obvious
- Being preachy or condescending
`;

    if (category) {
      prompt += `\nThe blog is in the "${category}" category - incorporate relevant context naturally.\n`;
    }

    if (tags.length > 0) {
      prompt += `\nWeave these topics naturally into your writing (don't force them): ${tags.join(', ')}\n`;
    }

    prompt += `
FORMAT:
- Use markdown: ## for headings, **bold** for emphasis, bullet points where they add value
- Include code blocks with \`\`\` only if genuinely relevant to the topic

IMPORTANT: Start directly with your engaging opening - no title needed. Write authentically as if you're a real person sharing valuable insights with someone you want to help.`;

    return prompt;
  }

  /**
   * Convert markdown to HTML for TipTap editor
   */
  private markdownToHtml(markdown: string): string {
    let html = markdown;

    // Convert headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Convert bold and italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

    // Convert unordered lists
    html = html.replace(/^\s*[-*+]\s+(.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Convert ordered lists
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');

    // Convert blockquotes
    html = html.replace(/^>\s+(.*$)/gim, '<blockquote>$1</blockquote>');

    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Convert paragraphs (lines that don't start with HTML tags)
    html = html.replace(/^(?!<[a-z]|$)(.+)$/gim, '<p>$1</p>');

    // Clean up empty paragraphs and fix nested tags
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');

    return html.trim();
  }
}

export const aiService = new AIService();
export default aiService;
