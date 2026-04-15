const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getAiInsight(question, dataContext) {
  const systemPrompt = `You are an expert data analyst assistant for Power AI, a data analytics platform. 
You analyze data and provide clear, structured, professional insights.

When answering:
- Be concise and direct
- Use bullet points for clarity
- Provide specific numbers from the data
- Explain WHY patterns exist
- Suggest actionable next steps
- Never use emojis or decorative symbols
- Keep responses under 200 words

Data context provided by the user will include column names, sample data, and statistics.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Here is the data context:\n${dataContext}\n\nUser question: ${question}` },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw error;
  }
}

module.exports = {
  getAiInsight
};
