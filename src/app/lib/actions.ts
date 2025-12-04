'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { SignupFormSchema, type FormState } from '@/app/lib/definitions';
import postgres from 'postgres';

// Initialize postgres client
const sql = postgres(process.env.DATABASE_URL!, {
  ssl: 'require',
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});

export async function signup(state: FormState | null, formData: FormData): Promise<FormState> {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    fname: formData.get('fname'),
    lname: formData.get('lname'),
    email: formData.get('email'),
    account_type: formData.get('account_type'),
    pword: formData.get('pword'),
    confirmPword: formData.get('confirmPword'),
    terms: formData.get('terms') === 'on',
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { fname, lname, email, account_type, pword } = validatedFields.data;

  try {
    // Checking if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    
    if (existingUser.length > 0) {
      return {
        message: 'User already exists with this email.',
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(pword, 10);

    // Insert new user into the database
    await sql`
      INSERT INTO users (
        fname, 
        lname, 
        email, 
        account_type, 
        pword,
        created_at
      ) VALUES (
        ${fname}, 
        ${lname}, 
        ${email}, 
        ${account_type}, 
        ${hashedPassword},
        NOW()
      )
    `;

  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to create user.',
    };
  }

  // Redirect to login page after successful signup
  redirect('/login');
}

// Admin-only actions
export async function createUserByAdmin(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const account_type = formData.get('account_type') as string;
    const name = formData.get('name') as string;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (email, pword, account_type, name, created_at)
      VALUES (${email}, ${hashedPassword}, ${account_type || 'user'}, ${name || null}, NOW())
    `;

    return { success: true, message: 'User created successfully' };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, message: 'Failed to create user' };
  }
}

export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await sql`
      UPDATE users 
      SET pword = ${hashedPassword}, updated_at = NOW()
      WHERE id = ${userId}
    `;

    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false };
  }
}

export async function deleteUser(userId: string) {
  try {
    await sql`
      DELETE FROM users WHERE id = ${userId}
    `;

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false };
  }
}


export async function getUserByEmail(email: string) {
  try {
    
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Utility function to verify password
export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

// Additional helper function
export async function getUserById(id: string) {
  try {
    const result = await sql`
      SELECT id, email, fname, lname, account_type, created_at 
      FROM users WHERE id = ${id}
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}