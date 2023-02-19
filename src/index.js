import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

import { ProSidebarProvider } from "react-pro-sidebar";
import { ContextProvider } from "./contexts/ContextProvider";
import { AuthContextProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ContextProvider>
        <ProSidebarProvider>
          <App />
        </ProSidebarProvider>
      </ContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();

reportWebVitals();
