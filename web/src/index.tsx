import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { ClientProvider } from "./context/client-context";

library.add(fab);

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <ClientProvider>
      <App />
    </ClientProvider>
);