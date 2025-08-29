// Content sanitization utilities for security
import DOMPurify from 'dompurify';

// Sanitize content to prevent XSS attacks
export function sanitizeContent<T>(content: T): T {
  if (typeof content === 'string') {
    // If content is a string, sanitize it
    return DOMPurify.sanitize(content) as unknown as T;
  } else if (typeof content === 'object' && content !== null) {
    // If content is an object, recursively sanitize all string properties
    const sanitizedContent = {} as T;
    for (const key in content) {
      if (Object.prototype.hasOwnProperty.call(content, key)) {
        const value = content[key];
        if (typeof value === 'string') {
          sanitizedContent[key] = DOMPurify.sanitize(value);
        } else if (typeof value === 'object' && value !== null) {
          sanitizedContent[key] = sanitizeContent(value);
        } else {
          sanitizedContent[key] = value;
        }
      }
    }
    return sanitizedContent;
  }
  // For other types (number, boolean, etc.), return as is
  return content;
}

// Sanitize HTML content
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'title', 'target']
  });
}

// Sanitize URL
export function sanitizeURL(url: string): string {
  try {
    const sanitizedURL = new URL(url);
    // Only allow http and https protocols
    if (sanitizedURL.protocol === 'http:' || sanitizedURL.protocol === 'https:') {
      return sanitizedURL.href;
    }
    return '';
  } catch (e) {
    // If URL is invalid, return empty string
    return '';
  }
}

// Validate and sanitize email
export function sanitizeEmail(email: string): string {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    return email.toLowerCase();
  }
  return '';
}