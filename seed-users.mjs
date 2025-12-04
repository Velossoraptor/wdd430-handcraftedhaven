// seed-users.mjs
import postgres from "postgres";
import bcrypt from "bcrypt";

async function seedUsers() {
  // Use your DATABASE_URL directly (make sure it's set in your environment)
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: "require",
  });

  try {
    console.log("🌱 Starting to seed users...\n");

    // Hash passwords
    const sellerPassword = await bcrypt.hash("Seller123!", 10);
    const buyerPassword = await bcrypt.hash("Buyer123!", 10);
    const adminPassword = await bcrypt.hash("Admin123!", 10);

    // User data matching your table structure
    const users = [
      {
        fname: "John",
        lname: "Seller",
        email: "seller@example.com",
        account_type: "Seller",
        pword: sellerPassword,
      },
      {
        fname: "Jane",
        lname: "Buyer",
        email: "buyer@example.com",
        account_type: "customer",
        pword: buyerPassword,
      },
      {
        fname: "Admin",
        lname: "User",
        email: "admin@example.com",
        account_type: "seller", // Using Seller for admin since that's what your schema supports
        pword: adminPassword,
      },
    ];

    console.log("📝 Inserting users...\n");

    for (const user of users) {
      try {
        // Check if user already exists
        const existingUser = await sql`
          SELECT id FROM users WHERE email = ${user.email}
        `;

        if (existingUser.length > 0) {
          console.log(`⚠️  User ${user.email} already exists, skipping...`);
          continue;
        }

        // Insert user - matching your exact table columns
        await sql`
          INSERT INTO users (
            fname, 
            lname, 
            email, 
            account_type, 
            pword
          ) VALUES (
            ${user.fname},
            ${user.lname},
            ${user.email},
            ${user.account_type},
            ${user.pword}
          )
        `;

        console.log(
          `✅ Created user: ${user.fname} ${user.lname} (${user.email}) - ${user.account_type}`
        );
      } catch (error) {
        console.error(`❌ Error creating user ${user.email}:`, error.message);
      }
    }

    console.log("\n🎉 Seed completed!");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    console.log("💡 Make sure DATABASE_URL environment variable is set");
  } finally {
    await sql.end();
  }
}

// Run the seed function
seedUsers();
