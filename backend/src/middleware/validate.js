// Is file mein Zod schema validation middleware define hai.
// API request ke aate hi body, query ya params ko validate kiya jata hai.
// Agar validation fail ho, toh 400 Bad Request ke saath exact fields ki error list return hoti hai.

import { sendError } from '../utils/response.js';

/**
 * Zod schema validation middleware factory:
 * @param {import('zod').ZodSchema} schema - Zod validation schema
 * @param {string} source - 'body', 'query', ya 'params'
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const target = req[source];
      // Schema parse hone ke baad transform/sanitize hua data req object par set hota hai
      const parsed = schema.parse(target);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const issues = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return sendError(res, 'Validation failed', 400, issues);
      }
      return sendError(res, err.message || 'Validation error', 400);
    }
  };
};

export default validate;
