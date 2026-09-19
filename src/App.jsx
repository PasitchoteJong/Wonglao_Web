import { useEffect, useState } from "react";
import liff from "@line/liff";

import AppRouter from "./routes/AppRouter";
import Toast from "./components/toast/Toast.jsx";

function App() {
  const [liffReady, setLiffReady] = useState(false);
  const [liffError, setLiffError] = useState(null);

  useEffect(() => {
    const startApp = async () => {
      try {
        console.log("Starting LIFF...");

        await liff.init({
          liffId: import.meta.env.VITE_LIFF_ID,
        });

        console.log("LIFF Ready");
        console.log("Current URL:", window.location.href);

        setLiffReady(true);
      } catch (error) {
        console.error("LIFF init error:", error);

        setLiffError(error);

        // ถ้าต้องการให้เว็บเปิดนอก LINE ได้ด้วย
        // สามารถปล่อย Router ทำงานต่อได้
        setLiffReady(true);
      }
    };

    startApp();
  }, []);

  if (!liffReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toast />
      <AppRouter />
    </>
  );
}

export default App;