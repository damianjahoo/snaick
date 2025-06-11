/* eslint-env node */

import { createClient } from "@supabase/supabase-js";

// Supabase configuration for local development
const supabaseUrl = process.env.SUPABASE_LOCAL_URL;
const supabaseKey = process.env.SUPABASE_LOCAL_KEY;

if (!supabaseKey) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required");
  console.error("Please set it to your local Supabase service role key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createDemoUser() {
  try {
    console.log("Creating demo user...");

    // Create user through auth API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: "demo@example.com",
      password: "demo123",
      email_confirm: true,
      user_metadata: {
        name: "Demo User",
      },
    });

    if (authError) {
      console.error("Error creating user:", authError);
      return;
    }

    console.log("Demo user created successfully!");
    console.log("Email: demo@example.com");
    console.log("Password: demo123");
    console.log("User ID:", authData.user.id);

    // Get all snacks
    const { data: snacks, error: snacksError } = await supabase.from("snacks").select("id");

    if (snacksError) {
      console.error("Error fetching snacks:", snacksError);
      return;
    }

    // Add all snacks to user favorites
    const favorites = snacks.map((snack) => ({
      user_id: authData.user.id,
      snack_id: snack.id,
    }));

    const { error: favError } = await supabase.from("user_favourites").insert(favorites);

    if (favError) {
      console.error("Error adding favorites:", favError);
      return;
    }

    console.log(`Added ${snacks.length} snacks to user favorites!`);
    console.log("\n✅ Demo setup complete!");
    console.log("You can now log in with:");
    console.log("Email: demo@example.com");
    console.log("Password: demo123");
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

createDemoUser();
