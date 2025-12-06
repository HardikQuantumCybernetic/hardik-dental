import { z } from 'zod';

// Enhanced validation schemas with better error messages
export const patientSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone) return true;
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }, 'Please enter a valid phone number'),
  
  dateOfBirth: z
    .string()
    .refine((date) => {
      const parsed = new Date(date);
      const now = new Date();
      const minDate = new Date(now.getFullYear() - 120, 0, 1);
      return parsed <= now && parsed >= minDate;
    }, 'Please enter a valid date of birth'),
  
  address: z
    .string()
    .max(500, 'Address must be less than 500 characters')
    .optional(),
  
  medicalHistory: z
    .string()
    .max(2000, 'Medical history must be less than 2000 characters')
    .optional(),
  
  insuranceInfo: z
    .string()
    .max(500, 'Insurance information must be less than 500 characters')
    .optional(),
});

export const appointmentSchema = z.object({
  patientId: z
    .string()
    .uuid('Invalid patient ID'),
  
  appointmentDate: z
    .string()
    .refine((date) => {
      const parsed = new Date(date);
      const now = new Date();
      const maxDate = new Date(now.getFullYear() + 2, 11, 31);
      return parsed >= now && parsed <= maxDate;
    }, 'Appointment must be in the future and within 2 years'),
  
  appointmentTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
  
  serviceType: z
    .enum(['cleaning', 'checkup', 'filling', 'extraction', 'cosmetic', 'emergency', 'consultation'], {
      errorMap: () => ({ message: 'Please select a valid service type' })
    }),
  
  duration: z
    .number()
    .min(15, 'Appointment must be at least 15 minutes')
    .max(240, 'Appointment cannot exceed 4 hours'),
  
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
  
  priority: z
    .enum(['low', 'normal', 'high', 'urgent'])
    .default('normal'),
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z
    .string()
    .email('Please enter a valid email address'),
  
  phone: z
    .string()
    .optional(),
  
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  
  preferredContact: z
    .enum(['email', 'phone', 'either'])
    .default('email'),
  
  urgency: z
    .enum(['low', 'normal', 'high'])
    .default('normal'),
});

// Rate limiting validation
export const rateLimitSchema = z.object({
  identifier: z.string(),
  action: z.string(),
  timestamp: z.number(),
});

// Custom validation functions
export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone) return true;
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
  return phoneRegex.test(cleaned);
};

export const validateInsuranceNumber = (insurance: string): boolean => {
  if (!insurance) return true;
  // Basic insurance number validation (adjust based on requirements)
  const insuranceRegex = /^[A-Z0-9]{6,20}$/i;
  return insuranceRegex.test(insurance.replace(/[\s\-]/g, ''));
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Form submission rate limiting
const submissionHistory = new Map<string, number[]>();

export const checkRateLimit = (
  identifier: string, 
  maxAttempts: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  const now = Date.now();
  const attempts = submissionHistory.get(identifier) || [];
  
  // Filter out old attempts
  const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  // Add current attempt
  recentAttempts.push(now);
  submissionHistory.set(identifier, recentAttempts);
  
  return true; // Within rate limit
};

// Validation error formatter
export const formatValidationErrors = (errors: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  errors.errors.forEach((error) => {
    const path = error.path.join('.');
    formattedErrors[path] = error.message;
  });
  
  return formattedErrors;
};

export type PatientFormData = z.infer<typeof patientSchema>;
export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;