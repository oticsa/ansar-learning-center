import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const ADMIN_EMAIL = "roboticsansar@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    if (!email || typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "A valid student email is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const studentName = typeof name === "string" && name.trim() ? name.trim() : "(no name given)";

    const { error } = await supabase.from("registration_notifications").insert({
      recipient_email: ADMIN_EMAIL,
      recipient_type: "admin",
      subject: `New student registration: ${studentName}`,
      body: `${studentName} (${email}) just registered at Ansar Learning Center and is waiting for approval. Sign in and open the Admin station to approve or reject this account.`,
      student_email: email,
      student_name: studentName,
    });

    if (error) {
      console.error("notify-registration insert failed", error);
      return new Response(JSON.stringify({ error: "Could not record the registration." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-registration error", err);
    return new Response(JSON.stringify({ error: "Unexpected error." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
