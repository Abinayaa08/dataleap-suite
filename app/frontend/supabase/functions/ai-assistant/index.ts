// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, dataContext } = await req.json();
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) throw new Error("API key not configured");

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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is the data context:\n${dataContext}\n\nUser question: ${question}` },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "I couldn't analyze that. Please try rephrasing your question.";

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ answer: `Error: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
