// scripts/test-supabase.ts
import postgres from "postgres";

async function testSupabase() {
  // Get database URL from environment
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    console.log("Please add it to your .env.local file:");
    console.log(
      'DATABASE_URL="postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres"'
    );
    return;
  }

  console.log("🔌 Testing Supabase connection...");

  // Create database connection
  const sql = postgres(databaseUrl, { ssl: "require" });

  try {
    // Test basic connection
    const result = await sql`SELECT version()`;
    console.log("✅ Database connected!");
    console.log("PostgreSQL version:", result[0].version);

    // Test if users table exists and get count
    try {
      const users = await sql`SELECT * FROM users`;
      console.log(`✅ Users table exists with ${users.length} user(s)`);

      // Show users (without sensitive info)
      if (users.length > 0) {
        console.log("📋 Users:");
        users.forEach((user) => {
          console.log(`   - ${user.name} (${user.email})`);
        });
      }
    } catch (tableError) {
      console.log("⚠️  Users table might not exist yet");
    }

    console.log("🎉 Database connection test passed!");
  } catch (error) {
    console.error("❌ Connection failed:");
    if (error instanceof Error) {
      console.error("   Error:", error.message);
    }

    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check DATABASE_URL in .env.local is correct");
    console.log("2. Make sure your Supabase project is active");
    console.log("3. Check your password and project reference");
    console.log("4. Ensure SSL is enabled (should be automatic)");
  } finally {
    // Always close the connection
    await sql.end();
  }
}

// Run the test
testSupabase();
