export interface IRecursiveCSSRuleAndPeachCSS<
  CSSRule,
  Selector extends string
> {
  [index: string]:
    | CSSRule
    | IRecursiveCSSRuleAndPeachCSS<CSSRule, Selector>
    | PeachCSSType<CSSRule, Selector>;
}

export type RecordSelectorAndIRecursiveCSSRuleAndPeachCSS<
  CSSRule,
  Selector extends string
> = Record<Selector, IRecursiveCSSRuleAndPeachCSS<CSSRule, Selector>>;

export type PeachCSSType<
  CSSRule,
  Selector extends string = keyof HTMLElementTagNameMap
> =
  | CSSRule
  | IRecursiveCSSRuleAndPeachCSS<CSSRule, Selector>
  | RecordSelectorAndIRecursiveCSSRuleAndPeachCSS<CSSRule, Selector>;
