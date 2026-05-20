import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MenuV2 from "./v2/MenuV2.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MenuV2 />
  </StrictMode>
);
