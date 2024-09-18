import { defineConfig } from "vite";
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, "tsconfig.lib.json"),
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "wagmi",
        "viem",
        "@tanstack/react-query",
      ],
      input: {
        index: resolve(__dirname, "lib/main.ts"),

        // Separate entry point for ConnectModal
        "connect-modal": resolve(__dirname, "lib/components/ConnectModal.tsx"),

        "hooks/": resolve(__dirname, "lib/hooks/index.ts"),
      },
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
});
