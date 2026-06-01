const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_BUCKET_NAME, SUPABASE_SECRET_KEY } = require('./env');

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

module.exports = { supabase, bucketName: SUPABASE_BUCKET_NAME };
