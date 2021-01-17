import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@wessberg/rollup-plugin-ts";
import { exports } from "./package.json";

/** @type import("rollup").RollupOptions */
const config = {
  input: "./source/peach.ts",

  plugins: [
    nodeResolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
  ],

  output: [
    {
      format: "es",
      file: exports.import,
      sourcemap: true,
    },
    {
      format: "cjs",
      file: exports.require,
      sourcemap: true,
      exports: "named",
    },
  ],
};

export default config;
