import CSS from "csstype";
import { ExtendedCSSStyleSheet } from "./extended-css-stylesheet";
import { PeachPlugin } from "./peach";
import { PeachCSSType } from "./peach-css-type";

export class PeachCSS<CSSRule> {
  public readonly className: string;

  private readonly sheet: ExtendedCSSStyleSheet;

  private readonly interalCSSSelector: string;

  private readonly plugins: PeachPlugin<unknown>[];

  constructor({
    sheet,
    css,
    selector,
    plugins,
  }: {
    sheet: ExtendedCSSStyleSheet;
    css: PeachCSSType<CSSRule>;
    selector?: string;
    plugins: PeachPlugin<unknown>[];
  }) {
    this.sheet = sheet;
    this.plugins = plugins;

    const { rules, nestedRules } = this.sortRules(css);
    const processedRules = this.preprocessRules(rules);
    const stringifiedRules = this.stringifyRules(processedRules);

    const hash = this.hashString(stringifiedRules);
    this.className = hash;

    this.interalCSSSelector = "." + hash + (selector ? ", " + selector : "");

    this.sheet.addRule(this.interalCSSSelector, stringifiedRules);

    Object.fromEntries(
      nestedRules.map(([childSelector, childCSS]) => [
        childSelector,
        new PeachCSS({
          sheet,
          css: childCSS,
          selector: `${this.interalCSSSelector} > ${childSelector}`,
          plugins,
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

  private preprocessRules(css: CSSRule): CSS.PropertiesHyphen {
    let processedCSS = css as CSSRule | CSS.PropertiesHyphen;

    this.plugins.forEach(
      (plugin) => (processedCSS = plugin.transform(processedCSS))
    );

    return processedCSS;
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
