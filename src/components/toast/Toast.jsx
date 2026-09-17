import { useEffect, useRef, useState, useCallback } from "react";
import { subscribe } from "./toast";

const toastStyle = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info"
};

function ToastItem({ toast, onClose }) {
    // const [isPaused,setIsPaused]= useState(false);
    // const ramainingTime = useRef(toast.duration);
    // const startTime = useRef(Date.now());
    // const timeRef = useRef(null);

    // const StartTimer = ()=>{
    //     startTime.current = Date.now();
    //     timeRef.current = setTimeout(()=>{
    //         onClose(toast.id);
    //     },remainTime)

    // }

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, toast.duration);

        return () => { clearTimeout(timer); }
    }, [toast.id, toast.duration, onClose]);

    return (
        <div className={`alert ${toastStyle[toast.type]} relative overflow-hidden`}>
            <span>{toast.message}</span>

            <div
                className="absolute bottom-0 left-0 h-1 bg-black/30"
                style={{ width: "100%", animation: `toast-progress ${toast.duration}ms linear forwards` }}
            />
        </div>
    );
}
export default function Toast() {
    // console.log("Toast Component Render")
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribe((newToast) => {
            setToasts((current) => [...current, newToast]);
        });

        return unsubscribe;
    }, []);

    const removeToast = (id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    };

    return (
        <div className="toast toast-top toast-end z-50">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
            ))}
        </div>
    );
}