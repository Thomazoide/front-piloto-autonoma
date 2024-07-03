import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <FluentProvider theme={webLightTheme} >
        <Provider>
          <App />
        </Provider>
      </FluentProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
