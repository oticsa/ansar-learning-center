const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a vocabulary tutor at Ansar Learning Center for ESL students preparing for IELTS.
Given a single English word or short phrase, return GitHub-flavoured Markdown with EXACTLY these sections:

## Definition
A clear, learner-friendly definition (1-2 sentences). Include the part of speech in italics.

## Synonyms & Antonyms
- **Synonyms:** 3-5 words, most useful for IELTS first
- **Antonyms:** 2-4 words (write "None common" if not applicable)

## Example Sentences
2 numbered examples: one everyday, one academic/IELTS-style. Bold the target word in each.

## IELTS Tip
One short line on how or where to use this word in IELTS speaking or writing.

Rules: keep the whole response under 180 words. If the input is not a real English word, say so kindly
and suggest the closest real word. Output Markdown only.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { word } = await req.json();

    if (!word || !word.trim()) {
      return new Response(JSON.stringify({ error: "Please type a word first." }), {
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
        input: `WORD: ${word.trim()}`,
        stream: false,
        reasoning: { effort: "low" },
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      if (res.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many lookups right now. Please try again in a moment." }),
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
      return new Response(JSON.stringify({ error: "The word analyzer could not be reached." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const analysis: string = data.output_text ?? "";

    if (!analysis.trim()) {
      return new Response(
        JSON.stringify({ error: "The analyzer returned an empty response. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("analyze-word error", err);
    return new Response(JSON.stringify({ error: "Unexpected error while analyzing." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
