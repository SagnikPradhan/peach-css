import CSS from "csstype";
import { PeachCSSType } from "../utils/type";
import { ExtendedCSSStyleSheet } from "../utils/css-sheet";
import { stringifyRules } from "../utils/stringify-css";
import { hash as hashFn } from "../utils/hash";

type PluginCSS =
  | CSS.Properties
  | CSS.PropertiesHyphen
  | CSS.PropertiesFallback
  | CSS.PropertiesHyphenFallback;

const UPPERCASE_REGEX = /[A-Z]/g;

/**
 * CSS plugin for peach.
 *
 * @param sheet - Sheet
 *
 * @example ```js
 *  const peach = PeachCSS.addPlugin(css)
 *
 *  const styles = peach.css({
 *    fontSize: "10rem",
 *    fontFamily: "sans-serif",
 *    margin: "1rem",
 *    color: "hotpink"
 *  })
 *
 *  export const Component = () => (
 *    <h1 className={styles.className}>Hey there!</h1>
 *  )
 * ```
 */
export function css(sheet: ExtendedCSSStyleSheet) {
  /**
   * Write css like you normally do with objects.
   *
   * @param CSS - Your css
   * @param optionalSelector - Optional css selector
   */
  function internalCSSFn<CSSRule = PluginCSS>(
    CSS: PeachCSSType<CSSRule>,
    optionalSelector?: string
  ) {
    const currentRules = {} as CSS.PropertiesHyphen;
    const nestedRules = {} as PeachCSSType<CSSRule>;

    for (const [key, value] of Object.entries(CSS)) {
      if (typeof value === "object") {
        if (Array.isArray(value)) parsePair(key, value, currentRules);
        else nestedRules[key as keyof PeachCSSType<CSSRule>] = value;
      } else parsePair(key, value, currentRules);
    }

    const stringifiedRules = stringifyRules(currentRules);

    const hash = "css" + hashFn(stringifiedRules);
    const uniqueSelector = `.${hash}`;
    const cssSelector =
      uniqueSelector + (optionalSelector ? `, ${optionalSelector}` : "");

    for (const [key, value] of Object.entries(nestedRules))
      internalCSSFn(
        value,
        `${optionalSelector ? optionalSelector : uniqueSelector} ${key}`
      );

    sheet.addRule(cssSelector, stringifiedRules);

    return { className: hash };
  }

  return {
    css: internalCSSFn,
  };
}

function parsePair(
  key: string,
  value: string | string[],
  rules: CSS.PropertiesHyphen
) {
  const parsedKey = UPPERCASE_REGEX.test(key)
    ? key.replace(UPPERCASE_REGEX, (match) => "-" + match.toLowerCase())
    : key;

  const parsedValue = Array.isArray(value) ? value.join() : value;

  Object.assign(rules, { [parsedKey]: parsedValue });
}
