import postgres from 'postgres';
import bcrypt from 'bcrypt';

const sql = postgres(process.env.DATABASE_URL!);

async function initDatabase() {
  try {
    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Optional: Create a test user
    const testPassword = await bcrypt.hash('test123', 10);
    await sql`
      INSERT INTO users (name, email, password) 
      VALUES ('Test User', 'test@example.com', ${testPassword})
      ON CONFLICT (email) DO NOTHING
    `;

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    await sql.end();
  }
}

initDatabase();