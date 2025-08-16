import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "preline/dist/preline.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://a7a22427a35ba0997dd1082332488f84@o4509564499263488.ingest.de.sentry.io/4509743358804048",
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
      <ToastContainer />
    </GoogleOAuthProvider>
  </BrowserRouter>,
);
