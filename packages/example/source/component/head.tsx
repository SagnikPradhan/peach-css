import React from "react";
import p from "../peach";

export const Head = ({
  level = 1,
  children,
}: {
  level?: 1 | 2 | 3;
  children: React.ReactNode;
}) => {
  const Tag = `h${level}` as `h${typeof level}`;

  return (
    <Tag
      className={
        p.css({
          fontSize: level === 1 ? "10rem" : level === 2 ? "5rem" : "2rem",
          fontFamily: "sans-serif",
          margin: "1rem 0",
        }).className
      }
    >
      {children}
    </Tag>
  );
};
