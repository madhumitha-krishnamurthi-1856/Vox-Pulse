import { Link } from "@tanstack/react-router";
import { LogOut, Radio, Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Radio className="h-4 w-4" />
          </span>
          <span className="font-serif text-xl tracking-tight">Vox Pulse</span>
        </Link>
        <nav className="flex items-center gap-2">
          {loading ? null : user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/views">
                  <Bookmark className="mr-1.5 h-4 w-4" />
                  Saved views
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}