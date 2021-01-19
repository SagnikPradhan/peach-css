import { ExtendedCSSStyleSheet } from "./utils/css-sheet";

type Peach<T = {}> = {
  addPlugin: <P>(
    pluginFactory: (sheet: ExtendedCSSStyleSheet) => P
  ) => Peach<P>;
} & T;

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

export * as plugins from "./plugins";
export * as utils from "./utils";
