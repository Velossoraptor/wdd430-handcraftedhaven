import { z } from 'zod';

export type User = {
  id: string;
  fname: string;
  lname: string;
  email: string;
  account_type: 'customer' | 'seller' | 'admin';
  pword?: string; // Hashed password
  created_at: string;
  
};

// Signup Form Schema
export const SignupFormSchema = z.object({
  fname: z.string().min(1, 'First name is required'),
  lname: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  
  account_type: z.enum(['customer', 'seller']).default('customer'),
  pword: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  
}
);

export type FormState = {
  errors?: {
    fname?: string[];
    lname?: string[];
    email?: string[];
    phone?: string[];
    
    account_type?: string[];
    pword?: string[];
    confirmPword?: string[];
    terms?: string[];
  };
  message?: string;
};


export type SessionData = {
  userId: string;
  email: string;
  accountType: string;
  expires: Date;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  seller_id: string;
  created_at: string;
  updated_at: string;
};


export type Order = {
  id: string;
  customer_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};