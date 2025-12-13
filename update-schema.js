const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://gpucisjxecupcyosumgy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_c_jaulMxepzn4YAfDFzN4w_okcnP3YW';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function updateSchema() {
  console.log('🔄 Updating database schema...');
  
  try {
    // Execute the SQL to add media_urls column
    const { data, error } = await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE orders ADD COLUMN IF NOT EXISTS media_urls TEXT[];'
    });
    
    if (error) {
      console.error('❌ Error:', error.message);
      
      // Try alternative method using direct query
      console.log('🔄 Trying alternative method...');
      const { data: altData, error: altError } = await supabase
        .from('orders')
        .select('media_urls')
        .limit(1);
      
      if (altError && altError.message.includes('column "media_urls" does not exist')) {
        console.log('⚠️  Column does not exist yet.');
        console.log('📝 Please run this SQL manually in Supabase SQL Editor:');
        console.log('   ALTER TABLE orders ADD COLUMN IF NOT EXISTS media_urls TEXT[];');
        console.log('   https://supabase.com/dashboard/project/gpucisjxecupcyosumgy/sql');
      } else if (!altError) {
        console.log('✅ Column media_urls already exists!');
      }
    } else {
      console.log('✅ Schema updated successfully!');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

updateSchema();
