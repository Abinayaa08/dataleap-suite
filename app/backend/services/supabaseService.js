const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Supabase URL or Key not provided. Skipping Supabase Initialization.');
}

/**
 * Log the AI interaction to the database
 * Requires an 'ai_logs' table with columns: question (text), response (text)
 */
async function logAiQuery(question, response) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('ai_logs')
      .insert([
        {
          question: String(question).substring(0, 5000), // Prevent payload from being too large if not needed
          response: String(response),
        }
      ]);

    if (error) {
      console.error('Error logging to Supabase:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error logging to Supabase:', error);
    return null;
  }
}

module.exports = {
  supabase,
  logAiQuery
};
