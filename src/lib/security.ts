import { z } from "zod";
import validator from "validator";

// STRICT EMAIL VALIDATION - Only allow: a-z A-Z 0-9 @ . _ -
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const emailSchema = z.string()
  .min(1, "Email is required")
  .max(254, "Email must be less than 254 characters")
  .trim()
  .refine((email) => EMAIL_REGEX.test(email), {
    message: "Invalid email format"
  });

// STRICT PASSWORD VALIDATION - Only allow: A-Z a-z 0-9 @ # $ % ! _ -
const PASSWORD_REGEX = /^[A-Za-z0-9@#$%!_-]+$/;
export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be less than 64 characters")
  .trim()
  .refine((password) => PASSWORD_REGEX.test(password), {
    message: "Password contains invalid characters"
  });

// STRICT USERNAME VALIDATION - Only allow: a-z A-Z 0-9 _ .
const USERNAME_REGEX = /^[a-zA-Z0-9_.]+$/;
export const usernameSchema = z.string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be less than 30 characters")
  .trim()
  .refine((username) => USERNAME_REGEX.test(username), {
    message: "Username contains invalid characters"
  });

// Login credentials validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
});

// Registration credentials validation
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema.optional()
});

// STRICT TYPE VALIDATION - Prevent object injection
export const validateInputType = (input: unknown, fieldName: string): string => {
  if (typeof input !== 'string') {
    throw new Error(`Invalid ${fieldName} type`);
  }
  return input;
};

// STRICT INPUT VALIDATION - Reject invalid input entirely
export const validateStrictInput = (input: string, schema: z.ZodSchema, fieldName: string): string => {
  // Type check first
  validateInputType(input, fieldName);
  
  // Trim whitespace
  const trimmed = input.trim();
  
  // Validate with schema
  try {
    return schema.parse(trimmed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid ${fieldName}: ${error.errors[0]?.message || 'Invalid format'}`);
    }
    throw new Error(`Invalid ${fieldName}`);
  }
};

// Generic error messages for security
export const SECURITY_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid credentials",
  LOGIN_FAILED: "Authentication failed",
  ACCESS_DENIED: "Access denied",
  RATE_LIMITED: "Too many attempts. Please try again later",
  VALIDATION_ERROR: "Invalid input provided"
} as const;

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_ATTEMPTS: 5,
  BLOCK_DURATION_MS: 15 * 60 * 1000 // 15 minutes block
} as const;
