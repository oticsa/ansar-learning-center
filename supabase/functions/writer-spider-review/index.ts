const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an experienced IELTS examiner and academic writing tutor at Ansar Learning Center.
You evaluate student essays strictly against the official IELTS Writing band descriptors (Bands 1-9) and
guidance published by IELTS/British Council/Cambridge, and against widely accepted academic writing standards
(thesis clarity, paragraph unity, evidence, hedging, formal register, cohesion).

Return well-structured GitHub-flavoured Markdown using EXACTLY these sections and headings:

## Estimated Band
A single overall band (e.g. **6.5**) plus one short sentence saying what is holding the score back.

## Band Breakdown
A markdown table with columns: Criterion | Band | Why. Rows: Task Response (or Task Achievement for Task 1),
Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.

## What You Did Well
2-4 bullets. Always praise original, creative or independent thinking when it appears.

## Priority Fixes
3-5 bullets. Each bullet: the issue, then a rewritten example taken from the student's own sentences
(format: > original  →  **improved**). Do not list every small typo; group them.

## Academic Upgrades
A short table: Student wrote | Stronger academic alternative. 5-8 rows of real phrases from the essay.

## Creative Development
2-3 bullets suggesting how to make the argument more original, memorable, and persuasive while staying
academic — new angles, counter-arguments, vivid but formal examples.

## Next Steps
3 short numbered actions for the student's next practice session.

## Trusted Sources
3-5 markdown links to genuinely authoritative, verifiable IELTS / academic-writing resources
(ielts.org, britishcouncil.org, cambridgeenglish.org, takeielts.britishcouncil.org, university writing centres
such as Purdue OWL or Manchester Academic Phrasebank). Only list URLs you are confident are real and stable.

Rules: be encouraging but honest. Never invent statistics. Keep the total under 900 words.
Output Markdown only — no code fences around the whole answer.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, taskType, essay } = await req.json();

    if (!essay || essay.trim().split(/\s+/).length < 20) {
      return new Response(
        JSON.stringify({ error: "Please write at least 20 words before requesting a review." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `TASK TYPE: ${taskType === "task1" ? "IELTS Academic Writing Task 1" : "IELTS Writing Task 2"}
TOPIC / PROMPT: ${topic || "(not provided)"}

STUDENT ESSAY:
"""
${essay}
"""

Review this essay now following your required format.`;

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
        stream: true,
        reasoning: { effort: "low", summary: "auto" },
      }),
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      if (res.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many reviews right now. Please try again in a moment." }),
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
      return new Response(JSON.stringify({ error: "The reviewer could not be reached." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload);
          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
            text += evt.delta;
          } else if (evt.type === "response.completed" && !text) {
            text = evt.response?.output_text ?? "";
          }
        } catch {
          // ignore keepalive / partial frames
        }
      }
    }

    if (!text.trim()) {
      return new Response(
        JSON.stringify({ error: "The reviewer returned an empty response. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const bandMatch = text.match(/##\s*Estimated Band[\s\S]{0,200}?(\d(?:\.\d)?)/);

    return new Response(
      JSON.stringify({ review: text, band: bandMatch ? bandMatch[1] : null }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("writer-spider-review error", err);
    return new Response(JSON.stringify({ error: "Unexpected error while reviewing." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
