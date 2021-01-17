import React from "react";
import p from "../peach";

const styles = p.css({
  fontSize: "1.5rem",
  fontFamily: "sans-serif",
  lineHeight: "1.4",
});

export const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <p className={styles.className}>{children}</p>
);
