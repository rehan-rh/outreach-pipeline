import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#18181b",
            color: "#d4d4d8",
            border: "1px solid #27272a",
            fontSize: "13px",
            borderRadius: "8px",
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
