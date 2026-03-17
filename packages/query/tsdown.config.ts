import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  deps: {
    neverBundle: ["@erpc/client", "@erpc/core", "@tanstack/react-query", "react"],
  },
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  sourcemap: true,
  target: "es2022",
});
