import CSS from "csstype";

/**
 * Stringifies css properties into a json like structure
 *
 * @param css - CSS properties
 */
export function stringifyRules(css: CSS.PropertiesHyphen) {
  let string = "{\n";
  for (let [key, value] of Object.entries(css))
    string += `    ${key}: ${value};\n`;
  string += "}";
  return string;
}
