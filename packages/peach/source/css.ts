import CSS from "csstype";
import { HTML_TAGS } from "./constants";

export type CSSRule = CSS.Properties | CSS.PropertiesHyphen;

interface NestedPeachCSS {
  [index: string]: CSSRule | NestedPeachCSS | PeachCSS;
}

type NestedPeachCSSWithSelector = Record<
  typeof HTML_TAGS[number] | CSS.Pseudos,
  NestedPeachCSS
>;

export type PeachCSS = CSSRule | NestedPeachCSS | NestedPeachCSSWithSelector;
