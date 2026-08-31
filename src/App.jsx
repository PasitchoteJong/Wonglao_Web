import { useEffect, useState } from "react";

function App() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/")
            .then((response) => response.json())
            .then((data) => {
                setMessage(data.message);
            })
            .catch((error) => {
                console.error("Backend Error:", error);
                setMessage("ไม่สามารถเชื่อมต่อ Backend ได้");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <div className="card bg-base-100 w-96 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">WongLao</h2>

                    {loading ? (
                        <span className="loading loading-spinner loading-md"></span>
                    ) : (
                        <p>{message}</p>
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