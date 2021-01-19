import CSS from "csstype";

export function stringifyRules(css: CSS.PropertiesHyphen) {
  let string = "{\n";
  for (let [key, value] of Object.entries(css))
    string += `    ${key}: ${value};\n`;
  string += "}";
  return string;
}
