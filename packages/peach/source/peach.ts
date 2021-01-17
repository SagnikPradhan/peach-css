import CSS from "csstype";
import { ExtendedCSSStyleSheet } from "./extended-css-stylesheet";
import { PeachCSS } from "./peach-css";

/** Peach css plugin */
export interface PeachPlugin<CSSRule> {
  transform: (rule: CSSRule) => CSS.PropertiesHyphen;
}

/** Peach Class. Manages plugins and provides methods to generate CSS. */
export class Peach<CSSRule = CSS.PropertiesHyphen> {
  /** Stylesheet */
  private readonly sheet: ExtendedCSSStyleSheet;

  /** Peach CSS Plugins */
  private readonly plugins = [] as PeachPlugin<never>[];

  constructor(document = window.document) {
    this.sheet = new ExtendedCSSStyleSheet(document);
  }

  /**
   * Add a plugin
   *
   * @param plugin - Peach css plugin
   */
  public addPlugin<PluginCSSRule>(
    plugin: PeachPlugin<PluginCSSRule>
  ): Peach<CSSRule | PluginCSSRule> {
    this.plugins.push(plugin);
    return this;
  }

  /**
   * Generate styles
   *
   * @param css - CSS
   */
  public css(css: CSSRule) {
    return new PeachCSS({ sheet: this.sheet, css });
  }
}

/** Create new peach interface */
export const peach = (document?: Document) => new Peach(document);

export default peach;
