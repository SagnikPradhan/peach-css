/** Utility class to be used instead of CSSStyleSheet */
export class ExtendedCSSStyleSheet {
  /** Style element for sheet */
  public element: HTMLStyleElement;

  /** Index where new rule is added */
  private newRuleIndex = 0;

  /** CSS Style sheet */
  private readonly sheet: CSSStyleSheet;

  /** Map to keep track of rules and their indice */
  private readonly rulesSelectorMap = new Map<string, number>();

  /** Create new extended css stylesheet */
  constructor(document: Document) {
    this.element = document.createElement("style");
    document.head.appendChild(this.element);
    this.sheet = this.element.sheet!;
  }

  /**
   * Add a new rule to the sheet
   *
   * @param selector - CSS selector
   * @param content - CSS rules. Use [[stringifyRules]] to generate the css string.
   * @param index - Optional index to be used for the rule
   */
  public addRule(selector: string, content: string, index = this.newRuleIndex) {
    const rule = `${selector} ${content}`;

    // Insert rule
    this.sheet.insertRule(rule, index);

    // Add it to map for future reference
    this.rulesSelectorMap.set(selector, index);

    // If it was added to the end, update the new rule index
    if (index === this.newRuleIndex) this.newRuleIndex += 1;
  }

  /**
   * Replace rule with the selector
   *
   * @param selector - CSS selector
   * @param content - CSS rules
   */
  public updateRule(selector: string, content: string) {
    const ruleIndex = this.rulesSelectorMap.get(selector);
    if (typeof ruleIndex !== "number") throw new Error("Rule not found");

    // Remove the rule
    this.sheet.deleteRule(ruleIndex);

    // Add new rule in its place
    this.addRule(selector, content, ruleIndex);
  }

  /**
   * Delete css rule
   *
   * @param selector - CSS selector
   */
  public deleteRule(selector: string) {
    const ruleIndex = this.rulesSelectorMap.get(selector);
    if (typeof ruleIndex !== "number") throw new Error("Rule not found");

    // Remove the rule
    this.rulesSelectorMap.delete(selector);

    // Update new indice
    for (const [
      currentRuleSelector,
      currentRuleIndex,
    ] of this.rulesSelectorMap.entries()) {
      if (currentRuleIndex > ruleIndex)
        this.rulesSelectorMap.set(currentRuleSelector, currentRuleIndex - 1);
    }

    // Update the counter
    this.newRuleIndex -= 1;
  }
}
