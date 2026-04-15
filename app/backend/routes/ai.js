const express = require('express');
const router = express.Router();
const { getAiInsight, analyzeSchema, generateDashboardConfig } = require('../services/openaiService');
const { logAiQuery } = require('../services/supabaseService');

router.post('/chat', async (req, res) => {
  try {
    const { question, dataContext, aiStyle } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Call OpenAI with the user's preferred response style
    const responseText = await getAiInsight(question, dataContext || "No context provided.", aiStyle || 'balanced');

    // Log asynchronously (non-blocking)
    logAiQuery(question, responseText).catch(e => console.error("Logging failed", e));

    res.status(200).json({ answer: responseText });
    
  } catch (error) {
    console.error('API Error /api/ai/chat:', error.message || error);
    res.status(500).json({ answer: 'I couldn\'t process that request at this time. Please try again.' });
  }
});

router.post('/schema-analyze', async (req, res) => {
  try {
    const schemaPayload = req.body;
    if (!schemaPayload || !schemaPayload.columns) {
      return res.status(400).json({ error: 'Valid schema payload is required' });
    }
    const result = await analyzeSchema(schemaPayload);
    res.status(200).json(result);
  } catch (error) {
    console.error('API Error /api/ai/schema-analyze:', error.message || error);
    res.status(500).json({ error: 'Failed to analyze schema' });
  }
});

router.post('/dashboard-config', async (req, res) => {
  try {
    const schemaAnalysis = req.body;
    if (!schemaAnalysis || !schemaAnalysis.kpi_columns) {
      return res.status(400).json({ error: 'Valid schema analysis is required' });
    }
    const result = await generateDashboardConfig(schemaAnalysis);
    res.status(200).json(result);
  } catch (error) {
    console.error('API Error /api/ai/dashboard-config:', error.message || error);
    res.status(500).json({ error: 'Failed to generate dashboard config' });
  }
});

module.exports = router;
