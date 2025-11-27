import * as z from 'zod'

// User Role Type
export type UserRole = 'customer' | 'seller';

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// Session Payload Type
export type SessionPayload = {
  userId: string;
  email: string;
  name?: string;
  role: UserRole;
};

// Signup Form Schema with Role field
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
  role: z.string().refine((val) => ['customer', 'seller'].includes(val), {
    message: 'Please select a valid role (customer or seller).',
  })
})

// Form State Type
export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
        role?: string[]
      }
      message?: string
    }
  | undefined

// Login Form Schema
export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z.string().min(1, { message: 'Password is required.' }),
})

// Extended User types for specific roles
export interface Customer extends User {
  role: 'customer';
}

export interface Seller extends User {
  role: 'seller';
}