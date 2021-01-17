import React from "react";
import p from "./peach";
import { Head } from "./component/head";
import { Paragraph } from "./component/paragraph";

const style = p.css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "calc(100vh - 16px)",

  h1: {
    textAlign: "center",
  },
});

export const Page = () => (
  <div className={style.className}>
    <Head>Peach CSS</Head>

    <Paragraph>This example was made with peach css</Paragraph>
  </div>
);
