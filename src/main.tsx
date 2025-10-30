import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// MSW (Mock Service Worker) startup disabled to allow real backend requests.
// If you want to re-enable request mocking for development, uncomment the block below.
/*
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
*/

createRoot(document.getElementById("root")!).render(<App />);
