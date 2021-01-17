import CSS from "csstype";
import { PeachPlugin } from "../peach";

export const camelCasePlugin: PeachPlugin<CSS.Properties> = {
  transform: (rule) =>
    Object.fromEntries(
      Object.entries(rule).map(([key, value]) => [
        key
          .split("")
          .reduce(
            (acc, cur) =>
              acc + (cur.toUpperCase() === cur ? "-" + cur.toLowerCase() : cur),
            ""
          ),
        value,
      ])
    ),
};
