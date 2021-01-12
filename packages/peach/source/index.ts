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
  return "peach-" + xxhash.h32(string, 999).toString(16);
}

export function peach(css: PeachCSS, selector?: string) {
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

  const selectorMap = Object.fromEntries(currentRules) as Record<
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
  // For future removal of rule
  let ruleIndex = stylesheet.insertRule(cssRule, 0);

  selectorMap.toString = () => hash;

  // Parse nested rules
  for (const [key, css] of nestedRules) {
    // Pseudo Rules
    if (key.startsWith(":"))
      selectorMap[key] = peach(css, `${uniqueSelector}${key}`);
    else if (HTML_TAGS.includes(key as typeof HTML_TAGS[number]))
      selectorMap[key] = peach(css, `${uniqueSelector} ${key}`);
    else throw new Error("Invalid nested selector");
  }

  const selectorMapProxy = new Proxy(selectorMap, {
    set: (target, property: string, value) => {
      // Make changes to the stylesheet
      currentRules.push([property, value]);
      stylesheet.removeRule(ruleIndex);
      ruleIndex = stylesheet.insertRule(
        `${cssSelector} ${stringifyRules(currentRules)}`,
        0
      );

      // Reflect the changes in users copy too
      target[property] = value;
      return true;
    },
  });

  // Return our selector map
  return selectorMapProxy as any;
}

function stringifyRules(rules: [string, string | string[]][]) {
  return (
    "{\n" +
    rules
      .map(([key, value]) =>
        [
          "  " + snakeCase(key),
          Array.isArray(value) ? value.join(", ") : value,
        ].join(":")
      )
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
