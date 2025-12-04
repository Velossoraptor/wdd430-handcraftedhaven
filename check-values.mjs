// check-users.mjs
import postgres from "postgres";

async function checkUsers() {
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: "require",
  });

  try {
    console.log("🔍 Checking all users in database...\n");

    // Get all users
    const users = await sql`
      SELECT id, fname, lname, email, account_type, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;

    if (users.length === 0) {
      console.log("📭 No users found in the database.");
    } else {
      console.log(`📋 Found ${users.length} users:\n`);
      users.forEach((user, index) => {
        console.log(`👤 User ${index + 1}:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Name: ${user.fname} ${user.lname}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Account Type: ${user.account_type}`);
        console.log(`   Created: ${user.created_at}`);
        console.log("   ---");
      });
    }

    return users;
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sql.end();
  }
}

checkUsers();
