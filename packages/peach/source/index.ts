import { ExtendedCSSStyleSheet } from "./utils/css-sheet";

/** Peach */
type Peach<PluginInjected = {}> = {
  /**
   * Add a new plugin to the peach instance
   *
   * @param pluginFactory - Plugin
   * @returns Peach instance
   */
  addPlugin: <P>(
    pluginFactory: (sheet: ExtendedCSSStyleSheet) => P
  ) => Peach<P>;
} & PluginInjected;

/**
 * Create a new instance of peach
 *
 * @param doc - Override document used
 *
 * @example ```js
 *  import peach from "peachcss/esm"
 *  import { css } from "peach/esm/plugins/css"
 *
 *  // Use this instance everywhere throughout your app
 *  export default peach().addPlugin(css)
 * ```
 *
 */
export function peach(doc = document) {
  const sheet = new ExtendedCSSStyleSheet(doc);

  const peach = {
    addPlugin<P>(pluginFactory: (sheet: ExtendedCSSStyleSheet) => P): Peach<P> {
      const plugin = pluginFactory(sheet);
      return Object.assign(peach, plugin);
    },
  };

  return peach as Peach;
}

export default peach;
