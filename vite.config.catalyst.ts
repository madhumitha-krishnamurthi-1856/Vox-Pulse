// Catalyst-specific build config — bypasses @lovable.dev/vite-tanstack-config which hardcodes
// the node-server Nitro preset (triggering the @vercel/nft CJS/ESM error on Catalyst's Node.js).
// Uses @tanstack/react-start/plugin/vite directly with preset: "node" (fully bundled, no file tracing).
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths({ root: "." }),
    tailwindcss(),
    tanstackStart({
      server: {
        entry: "server",
        preset: "node",
      },
    }),
    react(),
  ],
});
