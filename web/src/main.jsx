import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@shared/AuthProvider";
import App from "./App";
import { api, setToken, tokenStorage } from "./lib/api";

// Order matters: design tokens first, then the component CSS lifted from the
// mockup, then the app layout which is allowed to override.
import "./styles/tokens.css";
import "./styles/komponen.css";
import "./styles/layout.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider api={api} setToken={setToken} storage={tokenStorage}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
