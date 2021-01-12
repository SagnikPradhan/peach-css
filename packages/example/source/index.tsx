import React from "react";
import ReactDOM from "react-dom";

import { peach } from "peach";

const App = () => {
  const styles = peach({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",

    h1: {
      fontSize: "10rem",
      fontWeight: "bolder",
    },
  });

  React.useEffect(() => {
    setInterval(() => {
      styles.h1.display = styles.h1.display === "block" ? "none" : "block";
    }, 100);
  }, []);

  return (
    <div className={styles}>
      <h1 className={styles.h1}>Hey there</h1>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
