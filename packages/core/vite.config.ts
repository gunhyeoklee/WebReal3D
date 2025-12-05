import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "WebRealCore",
      fileName: (format) =>
        format === "es" ? "web-real-core.mjs" : "web-real-core.cjs",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      plugins: [
        {
          name: "wgsl-raw-loader",
          transform(code, id) {
            if (id.endsWith(".wgsl")) {
              return {
                code: `export default ${JSON.stringify(code)};`,
                map: null,
              };
            }
          },
        },
      ],
    },
  },
});
