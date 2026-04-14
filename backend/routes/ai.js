const express = require('express');
const router = express.Router();
const { getAiInsight } = require('../services/openaiService');
const { logAiQuery } = require('../services/supabaseService');

router.post('/chat', async (req, res) => {
  try {
    const { question, dataContext } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Call OpenAI
    const responseText = await getAiInsight(question, dataContext || "No context provided.");

    // Bonus: Log the query and response to Supabase
    // We execute this asynchronously so it doesn't block the UI response
    logAiQuery(question, responseText).catch(e => console.error("Logging failed", e));

    // Match the JSON structure originally returned by the Supabase Edge Function
    res.status(200).json({ answer: responseText });
    
  } catch (error) {
    console.error('API Error /api/ai/chat:', error.message || error);
    res.status(500).json({ answer: 'I couldn\'t process that request at this time. Please try again.' });
  }
});

module.exports = router;
