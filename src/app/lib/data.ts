import bcrypt from 'bcryptjs';
import postgres from 'postgres';

// Initialize postgres client
const sql = postgres(process.env.DATABASE_URL!, {
  ssl: 'require',
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});

// Define the type that matches what your database returns
export interface DatabaseUser {
  id: string;
  email: string;
  password: string;
  fname?: string;
  lname?: string;
  account_type?: string;
}

// These functions are used by NextAuth
export async function getUserByEmail(email: string): Promise<DatabaseUser | null> {
  try {
    console.log("📊 Database query for email:", email);
    
    // Type the result as DatabaseUser[]
    const result = await sql<DatabaseUser[]>`
      SELECT 
        id, 
        email, 
        pword as password, 
        fname, 
        lname, 
        account_type
      FROM users 
      WHERE email = ${email.toLowerCase()}
    `;
    
    console.log("📊 Database result found:", result.length > 0);
    
    return result[0] || null;
  } catch (error) {
    console.error('💥 Database error:', error);
    return null;
  }
}

export async function verifyPassword(password: string, hashedPassword: string) {
  try {
    console.log("🔑 Verifying password...");
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log("🔑 Password valid:", isValid);
    return isValid;
  } catch (error) {
    console.error('💥 Password verification error:', error);
    return false;
  }
}