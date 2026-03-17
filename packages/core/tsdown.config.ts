import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  deps: {
    neverBundle: ["effect"],
  },
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  sourcemap: true,
  target: "es2022",
});
