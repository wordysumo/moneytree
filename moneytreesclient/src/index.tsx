import * as React from "react";
import { render } from "react-dom";
import { Example } from "./example";
import "./styles.css";

const App = () => <Example />;

render(<App />, document.getElementById("root"));
