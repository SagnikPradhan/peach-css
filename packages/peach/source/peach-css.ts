import CSS from "csstype";
import { ExtendedCSSStyleSheet } from "./extended-css-stylesheet";
import { PeachCSSType } from "./peach-css-type";

export class PeachCSS<CSSRule> {
  public readonly className: string;

  private readonly sheet: ExtendedCSSStyleSheet;

  private readonly interalCSSSelector: string;

  constructor({
    sheet,
    css,
    selector,
  }: {
    sheet: ExtendedCSSStyleSheet;
    css: PeachCSSType<CSSRule>;
    selector?: string;
  }) {
    this.sheet = sheet;

    const { rules, nestedRules } = this.sortRules(css);
    const stringifiedRules = this.stringifyRules(rules);
    const hash = this.hashString(stringifiedRules);

    this.className = "." + hash;
    this.interalCSSSelector =
      this.className + (selector ? ", " + selector : "");

    this.sheet.addRule(this.interalCSSSelector, stringifiedRules);

    Object.fromEntries(
      nestedRules.map(([childSelector, childCSS]) => [
        childSelector,
        new PeachCSS({
          sheet,
          css: childCSS,
          selector: `${this.interalCSSSelector} > ${childSelector}`,
        }),
      ])
    );
  }

  private sortRules(css: PeachCSSType<CSSRule>) {
    return Object.entries(css).reduce(
      ({ nestedRules, rules }, [currentRuleKey, currentRuleValue]) => {
        const nestedRule =
          typeof currentRuleValue === "object" &&
          !Array.isArray(currentRuleValue);

        if (nestedRule) nestedRules.push([currentRuleKey, currentRuleValue]);
        else rules[currentRuleKey as keyof typeof rules] = currentRuleValue;

        return { nestedRules, rules };
      },
      {
        nestedRules: [] as [string, PeachCSSType<CSSRule>][],
        rules: {} as CSSRule,
      }
    );
  }

  private stringifyRules(css: CSS.PropertiesHyphen) {
    let string = "{\n";
    for (let [key, value] of Object.entries(css))
      string += `    ${key}: ${value};\n`;
    string += "}";
    return string;
  }

  private hashString(string: string) {
    const FNV_PRIME = 0x01000193;
    const FNV_OFFSET_BASIS = 0x811c9dc5;

    let hash = FNV_OFFSET_BASIS;

    for (const character of string) {
      hash ^= character.charCodeAt(0);
      hash *= FNV_PRIME;
    }

    return "peach-" + hash.toString(16);
  }
}
