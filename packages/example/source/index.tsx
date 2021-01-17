import React from "react";
import ReactDOM from "react-dom";
import p from "./peach";

const styles = p.css({
  fontFamily: "sans-serif",
  fontSize: "10rem",
});

const App = () => <h1 className={styles.className}>Hey there</h1>;

ReactDOM.render(<App />, document.getElementById("root"));
