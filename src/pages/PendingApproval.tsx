import { ShieldCheck, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/Button";

export default function PendingApproval() {
  const { profile, signOut, refreshProfile } = useAuth();
  return <main className="flex min-h-screen items-center justify-center px-4">
    <section className="w-full max-w-md text-center">
      <ShieldCheck className="mx-auto h-12 w-12 text-secondary" />
      <h1 className="mt-5 font-display text-xl">{profile?.approval_status === "rejected" ? "Registration not approved" : profile?.approval_status === "approved" ? "Account inactive" : "Awaiting admin approval"}</h1>
      <p className="mt-4 text-muted-foreground">{profile?.approval_status === "pending" ? "Your registration has been received. Lessons become available after your account is approved." : "Your account does not currently have access to lessons."}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={refreshProfile}><RefreshCw className="h-4 w-4" /> Check approval</Button>
        <Button onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</Button>
      </div>
    </section>
  </main>;
}