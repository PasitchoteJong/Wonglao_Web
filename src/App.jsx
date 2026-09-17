import { useEffect, useState } from "react";
import liff from "@line/liff";

function App() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [liffReady, setLiffReady] = useState(false);

    useEffect(() => {
        const startApp = async () => {
            try {
                // 1) เริ่มต้น LIFF
                await liff.init({
                    liffId: import.meta.env.VITE_LIFF_ID,
                });

                setLiffReady(true);

                // 2) ทดสอบเชื่อมต่อ Backend
                const apiUrl =
                    import.meta.env.VITE_API_URL || "http://localhost:8000";

                const response = await fetch(`${apiUrl}/`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setMessage(data.message);
            } catch (error) {
                console.error("App init error:", error);
                setMessage("ไม่สามารถเริ่ม LIFF หรือเชื่อมต่อ Backend ได้");
            } finally {
                setLoading(false);
            }
        };

        startApp();
    }, []);

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <div className="card bg-base-100 w-96 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">WongLao</h2>

                    {loading ? (
                        <span className="loading loading-spinner loading-md"></span>
                    ) : (
                        <>
                            <p>{message}</p>

                            <p className="text-sm opacity-70">
                                LIFF: {liffReady ? "Ready" : "Not ready"}
                            </p>
                        </>
                    )}

                    <button className="btn btn-primary">
                        Test Backend
                    </button>
                </div>
            </div>
        </div>
    );
}

    export default App;