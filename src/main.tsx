import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Start MSW in development
if (import.meta.env.DEV) {
  import("./mocks/browser")
    .then(({ worker }) => {
      worker.start();
    })
    .catch((e) => {
      // ignore if msw is not installed
      // console.warn("MSW not started", e);
    });
}

createRoot(document.getElementById("root")!).render(<App />);
