import nodeResolve from "@rollup/plugin-node-resolve";
import commonJs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import typescript from "@wessberg/rollup-plugin-ts";
import serve from "rollup-plugin-serve";

const development = !!process.env.ROLLUP_WATCH;

/** @type {import("rollup").RollupOptions} */
const config = {
  input: "./source/index.tsx",

  output: {
    dir: "./dist",
    format: "es",
  },

  plugins: [
    nodeResolve(),
    commonJs(),
    typescript(),

    replace({
      "process.env.NODE_ENV": development ? "'development'" : "'production'",
    }),
  ],
};

if (development) {
  config.treeshake = false;
  config.plugins.push(serve({ contentBase: ["./dist", "./public"] }));
}

export default config;
