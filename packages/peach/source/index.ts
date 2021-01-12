import xxhash from "xxhashjs";

import { HTML_TAGS } from "./constants";
import { PeachCSS } from "./css";

function getPeachStyleSheet() {
  const existingStyleSheet = document.getElementById(
    "peach-stylesheet"
  ) as HTMLStyleElement;

  if (existingStyleSheet) {
    return existingStyleSheet.sheet!;
  } else {
    const styleElement = document.createElement("style");
    styleElement.id = "peach-stylesheet";
    document.head.appendChild(styleElement);
    return styleElement.sheet!;
  }
}

function hashString(string: string) {
  return xxhash.h32(string, 999).toString(16);
}

export function peach<C extends PeachCSS>(css: C, selector?: string) {
  // Stylesheet
  const stylesheet = getPeachStyleSheet();

  // Current rules are native rules
  // Single ruleset for current element
  const currentRules = [] as [string, string[] | string][];

  // Nested rules can be either pseudo rules
  // OR Rules for nested elements
  const nestedRules = [] as [string, PeachCSS][];

  // Sort the css into current and nested rules
  for (const [key, value] of Object.entries(css)) {
    if (Array.isArray(value) || typeof value === "string")
      currentRules.push([key, value]);
    else nestedRules.push([key, value]);
  }

  const returnSelectorMap = Object.fromEntries(currentRules) as Record<
    string,
    unknown
  >;

  // Parse current rules
  const ruleString = stringifyRules(currentRules);
  // We create a hash out of the current rules
  const hash = hashString(ruleString);
  const uniqueSelector = "." + hash;
  // Complete selector consists of users and also our unique selector
  const cssSelector = uniqueSelector + (selector ? `, ${selector}` : "");
  // Finally add the rule
  const cssRule = `${cssSelector} ${ruleString}`;
  stylesheet.insertRule(cssRule);

  returnSelectorMap.toString = () => hash;

  // Parse nested rules
  for (const [key, css] of nestedRules) {
    // Pseudo Rules
    if (key.startsWith(":"))
      returnSelectorMap[key] = peach(css, `${uniqueSelector}${key}`);
    else if (HTML_TAGS.includes(key as typeof HTML_TAGS[number]))
      returnSelectorMap[key] = peach(css, `${uniqueSelector} ${key}`);
    else throw new Error("Invalid nested selector");
  }

  // Return our selector map
  return returnSelectorMap as C;
}

function stringifyRules(rules: [string, string | string[]][]) {
  return (
    "{\n" +
    rules
      .map(([key, value]) => ["  " + snakeCase(key), value].join(":"))
      .join(";\n") +
    ";\n" +
    "}"
  );
}

function snakeCase(camelCaseString: string) {
  const characters = camelCaseString.split("");
  return characters.reduce((snakeCasedString, currentCharacter) => {
    if (currentCharacter.toUpperCase() === currentCharacter)
      return snakeCasedString + "-" + currentCharacter.toLowerCase();
    else return snakeCasedString + currentCharacter;
  }, "");
}
