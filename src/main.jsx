import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./routes/AppRouter";
import Toast from "../src/components/toast/Toast.jsx";


createRoot(document.getElementById("root")).render(
  <>
    <Toast />
    <AppRouter />
  </>,
);
