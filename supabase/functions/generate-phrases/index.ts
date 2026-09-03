import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // Handle CORS preflight — browsers send this before the real request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Read the theme, existing phrases, and how many new phrases are needed
    const { theme, existing, count } = await req.json();

    if (!theme || typeof theme !== "string") {
      return new Response(JSON.stringify({ error: "theme is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (typeof count !== "number" || count <= 0) {
      return new Response(JSON.stringify({ error: "count must be a positive number" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const existingPhrases: string[] = Array.isArray(existing)
      ? existing.filter((p: unknown): p is string => typeof p === "string" && p.trim().length > 0)
      : [];

    // Get the Groq API key from environment secrets — never hardcoded
    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!groqKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let systemPrompt = `You are generating fun, inclusive icebreaker bingo phrases for a group activity.
            Phrases should be short (under 8 words), conversational, and relatable to the described group.
            Respond with ONLY a JSON array of at least ${count} strings — ideally more, since duplicates or
            near-duplicates will be discarded. No explanation, no numbering, no markdown.
            Example format: ["Has a pet at home", "Loves spicy food", ...]`;

    if (existingPhrases.length > 0) {
      systemPrompt += `\n\nThe following phrases already exist — do not generate any phrase that is the same or similar in meaning to these:\n${JSON.stringify(existingPhrases)}`;
    }

    // Call the Groq API
    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        max_tokens: 2000,
        temperature: 0.8,
        reasoning_effort: "low",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Generate at least ${count} icebreaker bingo phrases (ideally more) for: ${theme}`,
          },
        ],
      }),
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.text();
      return new Response(JSON.stringify({ error: `Groq API error: ${error}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groqData = await groqResponse.json();
    let content = groqData.choices[0].message.content.trim();

    // Strip markdown code fences — the model sometimes wraps the array in ```json ... ```
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    console.log('Groq raw response:', content);

    // Parse the JSON array from Groq's response
    const rawPhrases = JSON.parse(content);

    if (!Array.isArray(rawPhrases)) {
      return new Response(JSON.stringify({ error: "Unexpected response format from AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Merge against existing phrases, dropping any returned phrase that's identical
    // to one already in the list (case/whitespace-insensitive), then cap to what's needed.
    const seen = new Set(existingPhrases.map((p) => p.trim().toLowerCase()));
    const newPhrases: string[] = [];
    for (const p of rawPhrases) {
      if (typeof p !== "string") continue;
      const key = p.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      newPhrases.push(p);
      if (newPhrases.length === count) break;
    }
    // If fewer than `count` unique phrases survive deduplication, return what's
    // available — the caller handles the shortfall gracefully.

    return new Response(JSON.stringify({ phrases: newPhrases }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
