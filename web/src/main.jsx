import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PenyediaAuth } from "./context/AuthContext";
import "./styles/tokens.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PenyediaAuth>
        <App />
      </PenyediaAuth>
    </BrowserRouter>
  </React.StrictMode>
);
