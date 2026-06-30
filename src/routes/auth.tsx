import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({ next: z.string().optional().default("/views") });

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "Sign in — Vox Pulse" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const go = () => {
    window.location.href = next || "/views";
  };

  const handleEmail = async (mode: "in" | "up") => {
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        go();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created");
        go();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      go();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign in failed");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16">
        <h1 className="font-serif text-3xl tracking-tight">Sign in to Vox Pulse</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Save searches and re-run them in one click.
        </p>
        <Card className="mt-8 border-border/60">
          <CardContent className="p-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogle}
              disabled={busy}
            >
              Continue with Google
            </Button>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>
            <Tabs defaultValue="in">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="in">Sign in</TabsTrigger>
                <TabsTrigger value="up">Create account</TabsTrigger>
              </TabsList>
              {(["in", "up"] as const).map((mode) => (
                <TabsContent key={mode} value={mode} className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={`email-${mode}`}>Email</Label>
                    <Input
                      id={`email-${mode}`}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`password-${mode}`}>Password</Label>
                    <Input
                      id={`password-${mode}`}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleEmail(mode)}
                    disabled={busy || !email || !password}
                  >
                    {mode === "in" ? "Sign in" : "Create account"}
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}