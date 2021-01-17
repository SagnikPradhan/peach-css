import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@wessberg/rollup-plugin-ts";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";

const DEV = process.env.ROLLUP_WATCH;

/** @type import("rollup").RollupOptions */
const config = {
  input: "./source/index.tsx",

  plugins: [
    nodeResolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    replace({
      "process.env.NODE_ENV": `'${DEV ? "development" : "production"}'`,
    }),
  ],

  output: {
    format: "es",
    dir: "public/dist",
    sourcemap: true,
  },
};

if (DEV) {
  config.treeshake = false;
  config.plugins.push(serve("public"), livereload());
} else {
  config.plugins.push(terser());
}

export default config;
