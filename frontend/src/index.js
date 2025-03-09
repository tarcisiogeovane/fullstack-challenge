import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Importação correta no React 18
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Método atualizado

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

