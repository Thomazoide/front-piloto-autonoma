import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"

const queryClient: QueryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FluentProvider theme={webLightTheme} >
            <Provider>
              <App />
            </Provider>
          </FluentProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
