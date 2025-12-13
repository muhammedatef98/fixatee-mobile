const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://gpucisjxecupcyosumgy.supabase.co';
// Using anon key - service role key would be needed for DDL operations
const SUPABASE_ANON_KEY = 'sb_publishable_c_jaulMxepzn4YAfDFzN4w_okcnP3YW';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function addColumn() {
  console.log('🔄 Attempting to add media_urls column...\n');
  
  try {
    // Try to insert a test order with media_urls to trigger column creation
    // This won't work without service role, but let's check the actual error
    const { data, error } = await supabase
      .from('orders')
      .select('id, media_urls')
      .limit(1);
    
    if (error) {
      if (error.message.includes('column "media_urls" does not exist')) {
        console.log('❌ Column does NOT exist.\n');
        console.log('⚠️  Cannot add column via API - DDL operations require service role key or manual SQL execution.\n');
        console.log('📝 Please run this command manually in Supabase SQL Editor:');
        console.log('   https://supabase.com/dashboard/project/gpucisjxecupcyosumgy/sql\n');
        console.log('   ALTER TABLE orders ADD COLUMN media_urls TEXT[];\n');
        console.log('💡 Make sure to clear any old SQL from the editor first!\n');
      } else {
        console.error('❌ Error:', error.message);
      }
    } else {
      console.log('✅ Column media_urls already EXISTS!');
      console.log('✅ Database is ready!\n');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

addColumn();
