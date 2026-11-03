// Is file mein authentication ke Zod validation schemas define hain.
// Customer signup, Provider signup aur Login ke fields (email, phone, password, name)
// ko database mein bhejne se pehle yahan validate aur sanitize kiya jata hai.

import { z } from 'zod';

// Customer registration input validation schema
// Name ya fullName dono accept karta hai, 10-digit phone, aur minimum 6-character password check karta hai
export const customerSignupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Valid email address is required').toLowerCase().trim(),
    phone: z.string().min(10, 'Valid phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    city: z.string().optional().default('Faridabad'),
    address: z.string().optional(),
  })
  .refine((data) => Boolean(data.name || data.fullName), {
    message: 'Name must be at least 2 characters',
    path: ['name'],
  })
  .transform((data) => ({
    ...data,
    name: (data.name || data.fullName).trim(),
  }));

// Provider (Partner) onboarding validation schema
// Business name, trade category, experience years aur hourly rate validate karta hai
export const providerSignupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
    businessName: z.string().min(2, 'Business name must be at least 2 characters'),
    email: z.string().email('Valid email address is required').toLowerCase().trim(),
    phone: z.string().min(10, 'Valid phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    category: z.string().min(2, 'Service category is required'),
    city: z.string().optional().default('Faridabad'),
    address: z.string().optional(),
    experienceYears: z.coerce.number().optional().default(1),
    hourlyRate: z.coerce.number().optional().default(499),
    bio: z.string().optional(),
  })
  .refine((data) => Boolean(data.name || data.fullName), {
    message: 'Name must be at least 2 characters',
    path: ['name'],
  })
  .transform((data) => ({
    ...data,
    name: (data.name || data.fullName).trim(),
  }));

// Login credentials validation schema
export const loginSchema = z.object({
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['customer', 'provider', 'admin']).optional(),
});
