import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "../components/toast/toast.js";
import ScanIcon from "../components/icons/ScanIcon.jsx";


export default function ScanJoin() {
  const navigate = useNavigate();

  const [paused, setPaused] = useState(false);
  const [scannedValue, setScannedValue] = useState("");

  const handleScan = (detectedCodes) => {
    if (!detectedCodes || detectedCodes.length === 0) return;
    if (paused) return;

    const value = detectedCodes[0]?.rawValue;

    if (!value) return;

    // ป้องกัน scan ซ้ำหลายครั้ง
    setPaused(true);
    setScannedValue(value);

    try {
      // รองรับทั้ง
      // https://xxx.netlify.app/join-bill/123
      // และ /join-bill/123
      const url = new URL(value, window.location.origin);

      // อนุญาตเฉพาะ http / https
      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Unsupported QR URL");
      }

      toast.success("QR Code scanned successfully");

      // ==========================
      // Link เป็นเว็บ WongLao เดียวกัน
      // → ใช้ React Router
      // ==========================
      if (url.origin === window.location.origin) {
        const target =
          url.pathname +
          url.search +
          url.hash;

        navigate(target);
        return;
      }

      // ==========================
      // ถ้า QR เป็น URL ภายนอก
      // → เปิดตาม URL
      // ==========================
      window.location.assign(url.href);

    } catch (error) {
      console.error("Invalid QR Code:", error);

      toast.error("QR Code ไม่ถูกต้อง");

      // เปิดกล้องใหม่ให้ scan อีกครั้ง
      setTimeout(() => {
        setPaused(false);
        setScannedValue("");
      }, 1500);
    }
  };

  const handleScannerError = (error) => {
    console.error("Scanner Error:", error);

    toast.error(
      "ไม่สามารถเปิดกล้องได้ กรุณาอนุญาต Camera Permission"
    );
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans">

      {/* =========================
          HEADER
      ========================== */}
      <div className="max-w-md mx-auto px-5 pt-8">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="
            flex
            items-center
            gap-2

            text-[#A0A0A0]
            hover:text-[#F8B500]

            transition-colors
          "
        >
          <span className="text-xl">←</span>
          <span className="text-sm font-medium">
            Back
          </span>
        </button>


        {/* =========================
            TITLE
        ========================== */}
        <div className="text-center mt-8">

          <div
            className="
              w-16
              h-16
              mx-auto

              rounded-2xl

              bg-[#F8B500]

              flex
              items-center
              justify-center

              shadow-lg
            "
          >
            <ScanIcon className="w-9 h-9" />
          </div>

          <h1 className="text-3xl font-bold mt-5">
            Scan to Join
          </h1>

          <p className="text-[#A0A0A0] mt-2 text-sm">
            Scan your friend's QR Code to join the bill
          </p>

        </div>


        {/* =========================
            CAMERA
        ========================== */}
        <div
          className="
            relative

            mt-8

            bg-[#1C1C1E]

            border
            border-[#2C2C2E]

            rounded-3xl

            overflow-hidden

            shadow-2xl
          "
        >

          <div className="aspect-square w-full">

            <Scanner
              onScan={handleScan}
              onError={handleScannerError}

              paused={paused}

              formats={["qr_code"]}

              constraints={{
                facingMode: "environment",
              }}

              components={{
                finder: false,
              }}

              styles={{
                container: {
                  width: "100%",
                  height: "100%",
                },

                video: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                },
              }}
            />

          </div>


          {/* =========================
              CUSTOM SCAN FRAME
          ========================== */}
          <div
            className="
              pointer-events-none

              absolute
              inset-0

              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                relative

                w-56
                h-56

                rounded-3xl
              "
            >

              {/* TOP LEFT */}
              <div className="
                absolute
                top-0
                left-0
                w-12
                h-12
                border-l-4
                border-t-4
                border-[#F8B500]
                rounded-tl-2xl
              " />

              {/* TOP RIGHT */}
              <div className="
                absolute
                top-0
                right-0
                w-12
                h-12
                border-r-4
                border-t-4
                border-[#F8B500]
                rounded-tr-2xl
              " />

              {/* BOTTOM LEFT */}
              <div className="
                absolute
                bottom-0
                left-0
                w-12
                h-12
                border-l-4
                border-b-4
                border-[#F8B500]
                rounded-bl-2xl
              " />

              {/* BOTTOM RIGHT */}
              <div className="
                absolute
                bottom-0
                right-0
                w-12
                h-12
                border-r-4
                border-b-4
                border-[#F8B500]
                rounded-br-2xl
              " />

            </div>
          </div>

        </div>


        {/* =========================
            DESCRIPTION
        ========================== */}
        <div
          className="
            mt-6

            bg-[#1C1C1E]

            border
            border-[#2C2C2E]

            rounded-2xl

            px-5
            py-4
          "
        >
          <div className="flex gap-3">

            <div
              className="
                w-10
                h-10

                shrink-0

                rounded-xl

                bg-[#2C2C2E]

                flex
                items-center
                justify-center
              "
            >
              <ScanIcon className="w-5 h-5 fill-[#F8B500]" />
            </div>

            <div>
              <p className="font-semibold text-white">
                Point your camera at the QR Code
              </p>

              <p className="text-sm text-[#A0A0A0] mt-1">
                You will automatically be redirected to the bill after scanning.
              </p>
            </div>

          </div>
        </div>


        {/* SCAN STATUS */}
        {scannedValue && (
          <div className="mt-4 text-center">
            <p className="text-sm text-[#F8B500]">
              QR detected...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}


/* =============================
   QR / SCAN ICON
============================= */

<ScanIcon className="w-9 h-9" />