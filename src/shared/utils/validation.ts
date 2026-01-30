/**
 * Sanitize and validate document title
 */
export const sanitizeTitle = (title: string): string | null => {
  if (typeof title !== 'string') return null;

  const trimmed = title.trim();

  // Check length
  if (trimmed.length === 0) return null;
  if (trimmed.length > 255) return null;

  // Remove control characters and normalize whitespace
  const sanitized = trimmed.replace(/[\x00-\x1F\x7F]/g, '').replace(/\s+/g, ' ');

  return sanitized.length > 0 ? sanitized : null;
};

/**
 * Validate document ID
 */
export const isValidDocId = (id: unknown): id is string => {
  return typeof id === 'string' && id.length > 0 && id.length <= 256;
};

/**
 * Validate parent ID (can be string or null)
 */
export const isValidParentId = (id: unknown): id is string | null => {
  return id === null || (typeof id === 'string' && id.length > 0 && id.length <= 256);
};
