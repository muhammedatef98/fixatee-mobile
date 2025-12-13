const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://gpucisjxecupcyosumgy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_c_jaulMxepzn4YAfDFzN4w_okcnP3YW';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSchema() {
  console.log('🔍 Checking if media_urls column exists...\n');
  
  try {
    // Try to query the column
    const { data, error } = await supabase
      .from('orders')
      .select('id, media_urls')
      .limit(1);
    
    if (error) {
      if (error.message.includes('column "media_urls" does not exist')) {
        console.log('❌ Column media_urls does NOT exist yet.\n');
        console.log('📝 Please run this SQL in Supabase SQL Editor:');
        console.log('   https://supabase.com/dashboard/project/gpucisjxecupcyosumgy/sql\n');
        console.log('   ALTER TABLE orders ADD COLUMN IF NOT EXISTS media_urls TEXT[];\n');
        return false;
      } else {
        console.error('❌ Error:', error.message);
        return false;
      }
    } else {
      console.log('✅ Column media_urls EXISTS!\n');
      console.log('✅ Database is ready for media upload feature!\n');
      return true;
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return false;
  }
}

checkSchema();
