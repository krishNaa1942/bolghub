import { client } from "./index";

async function testConnection() {
  try {
    console.log("🔍 Testing database connection...");
    console.log(
      "📍 Database URL:",
      process.env.DATABASE_URL?.substring(0, 30) + "..."
    );

    // Try a simple query
    const result = await client`SELECT NOW() as current_time`;

    console.log("✅ Database connection successful!");
    console.log("⏰ Current database time:", result[0].current_time);

    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed!");
    console.error("Error:", error);
    console.log("\n📝 Please check:");
    console.log("1. Is DATABASE_URL set in .env.local?");
    console.log("2. Is the connection string correct?");
    console.log("3. Is your database running?");
    console.log("\n💡 See DATABASE_SETUP.md for setup instructions");
    process.exit(1);
  }
}

testConnection();
