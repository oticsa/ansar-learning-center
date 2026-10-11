const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an ESL speaking coach at Ansar Learning Center helping students prepare for IELTS Speaking.
A student has written a spoken-style answer. Your job is to REPHRASE their own words into clear, natural,
confident English — not to lecture them about errors.

Return GitHub-flavoured Markdown with EXACTLY these sections:

## Improved Version
Rewrite the student's answer keeping THEIR ideas and personality, but with correct grammar, natural
linking phrases, and IELTS-appropriate vocabulary. Keep it a similar length to the original.

## Estimated Band
One line: an estimated IELTS speaking band (e.g. **6.0**) with a few words on why.

## Quick Tips
At most 3 short bullets — only the highest-impact improvements (e.g. a repeated mistake or a stronger
phrase). Do NOT list every spelling or grammar error. Never mention minor typos.

Rules: be warm and encouraging. Keep the whole response under 250 words. Output Markdown only.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, question } = await req.json();

    if (!text || text.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Please write an answer first." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `QUESTION: ${question || "(free response)"}

STUDENT ANSWER:
"""
${text}
"""

Improve this answer now following your required format.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: SYSTEM_PROMPT,
        input: userPrompt,
        stream: false,
        reasoning: { effort: "low" },
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      if (res.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many checks right now. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (res.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits are exhausted. Please top up to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      console.error("gateway error", res.status, detail);
      return new Response(JSON.stringify({ error: "The grammar coach could not be reached." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const feedback: string = data.output_text ?? "";

    if (!feedback.trim()) {
      return new Response(
        JSON.stringify({ error: "The coach returned an empty response. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("grammar-check error", err);
    return new Response(JSON.stringify({ error: "Unexpected error while checking." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
