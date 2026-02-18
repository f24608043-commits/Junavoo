// Script to seed new categories into the database
// Run this script with: node seed-categories.js
// Make sure to set your SUPABASE_URL and SUPABASE_ANON_KEY environment variables first

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

const newCategories = [
  { id: "home-kitchen", name: "Home & Kitchen", slug: "home-kitchen", active: true },
  { id: "electronics-tech", name: "Electronics & Tech", slug: "electronics-tech", active: true },
  { id: "toys", name: "Toys", slug: "toys", active: true },
  { id: "tools", name: "Tools", slug: "tools", active: true },
  { id: "beddings", name: "Beddings", slug: "beddings", active: true },
  { id: "gym-sports", name: "Gym & Sports", slug: "gym-sports", active: true },
  { id: "cosmetics", name: "Cosmetics", slug: "cosmetics", active: true },
  { id: "clothing", name: "Clothing", slug: "clothing", active: true },
  { id: "garden-outdoor", name: "Garden & Outdoor", slug: "garden-outdoor", active: true },
];

async function seedCategories() {
  try {
    console.log('Connecting to Supabase...');
    
    // Test connection
    const { data, error } = await supabase.from('categories').select('count');
    if (error && error.code !== 'PGRST116') {
      console.error('Error connecting to database:', error);
      return;
    }
    
    console.log('Deleting existing categories...');
    const { error: deleteError } = await supabase.from('categories').delete().neq('id', '');
    if (deleteError) {
      console.error('Error deleting existing categories:', deleteError);
    }
    
    console.log('Seeding new categories...');
    const { data: insertData, error: insertError } = await supabase.from('categories').insert(newCategories);
    
    if (insertError) {
      console.error('Error seeding categories:', insertError);
    } else {
      console.log('Successfully seeded categories:', newCategories.length, 'categories added');
      console.log('Categories:', newCategories.map(c => c.name));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.log('Please set your SUPABASE_URL and SUPABASE_ANON_KEY environment variables');
  console.log('Example:');
  console.log('export SUPABASE_URL=your_supabase_url');
  console.log('export SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('node seed-categories.js');
} else {
  seedCategories();
}
