import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
// set up the main entry point for the React application, rendering the App component inside a StrictMode wrapper to enable additional checks and warnings for potential issues in the application, and using createRoot from react-dom to render the app into the root element of the HTML document
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
