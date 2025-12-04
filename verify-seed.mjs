// verify-seed.mjs
import postgres from "postgres";

async function verifySeed() {
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: "require",
  });

  try {
    console.log("🔍 Verifying seeded users...\n");

    const users = await sql`
      SELECT id, fname, lname, email, account_type, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `;

    console.log("📋 Recent users:");
    users.forEach((user) => {
      console.log(`   👤 ${user.fname} ${user.lname}`);
      console.log(`      Email: ${user.email}`);
      console.log(`      Role: ${user.account_type}`);
      console.log(`      Created: ${user.created_at}`);
      console.log("   ---");
    });

    console.log(`\n✅ Total users in database: ${users.length}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sql.end();
  }
}

// Run the verification
verifySeed();
