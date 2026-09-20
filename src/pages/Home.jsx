import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import ScanIcon from "../components/icons/ScanIcon.jsx";
import PaymentSummaryIcon from "../components/icons/PaymentSummaryIcon.jsx";
import DashboardIcon from "../components/icons/DashboardIcon.jsx";
import ProfileIcon from "../components/icons/ProfileIcon.jsx";

export default function Home() {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/loginline", { replace: true });
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-white overflow-hidden font-sans">
      {/* =========================
          HERO IMAGE
      ========================== */}
      <div className="relative h-[75vh] overflow-hidden group">
        <img
          src="/images/home-hero.jpg"
          alt="WongLao"
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-105
          "
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-[#000000]" />

        {/* Hero Content */}
        <div className="absolute bottom-10 left-6 right-6 max-w-xl mx-auto">
          <h1 className="text-4xl font-bold text-white">Let's go Dutch ☕</h1>

          <p className="text-[#A0A0A0] mt-2 font-medium">
            Split bills with your besties
          </p>
        </div>
      </div>

      {/* =========================
          PROFILE DROPDOWN
      ========================== */}
      {profileOpen && (
        <>
          {/* กดพื้นที่ข้างนอกเพื่อปิด */}
          <button
            type="button"
            onClick={() => {
              setProfileOpen(false);
              navigate("/profile");
            }}
          >
            Profile
          </button>

          <div
            className="
              fixed
              bottom-28
              right-4
              w-48

              bg-[#1C1C1E]
              border
              border-[#2C2C2E]

              rounded-2xl
              shadow-2xl

              overflow-hidden
              z-50
            "
          >
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);

                // ยังไม่มีหน้า Profile
                navigate("/");
              }}
              className="
                w-full
                px-5
                py-4

                text-left
                text-white

                hover:bg-[#2C2C2E]
                transition-colors
              "
            >
              Profile
            </button>

            <div className="h-px bg-[#2C2C2E]" />

            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                px-5
                py-4

                text-left
                text-red-400

                hover:bg-[#2C2C2E]
                transition-colors
              "
            >
              Logout
            </button>
          </div>
        </>
      )}

      {/* =========================
          BOTTOM NAVIGATION
      ========================== */}
      <div
        className="
          fixed
          bottom-0
          left-0
          right-0

          z-30

          flex
          justify-center

          pb-4
          px-3
        "
      >
        <div
          className="
            relative
            w-full
            max-w-xl

            h-[82px]

            bg-[#1C1C1E]/95
            backdrop-blur-xl

            border
            border-[#2C2C2E]

            rounded-3xl
            shadow-2xl

            flex
            items-center
            justify-around

            px-2
          "
        >
          {/* =========================
              CREATE BILL
          ========================== */}
          <NavButton
            label="Create"
            icon="＋"
            onClick={() => navigate("/create-bill")}
          />

          {/* =========================
              PAYMENT SUMMARY
          ========================== */}
          <NavButton
            label="Payment"
            icon={<PaymentSummaryIcon className="w-6 h-6" />}
            onClick={() => navigate("/payment-summary")}
          />

          {/* =========================
              CENTER SCAN
          ========================== */}
          <div className="relative w-20 h-full">
            <button
              type="button"
              onClick={() => navigate("/scan-join")}
              className="
                absolute
                -top-10
                left-1/2
                -translate-x-1/2

                w-20
                h-20

                rounded-full

                bg-[#F8B500]
                text-[#121212]

                border-[6px]
                border-[#000000]

                flex
                items-center
                justify-center

                text-3xl
                font-bold

                shadow-xl

                transition-all
                duration-200

                hover:scale-110
                active:scale-95
              "
            >
              <ScanIcon className="w-9 h-9" />
            </button>

            <span
              className="
                absolute
                top-[48px]
                left-1/2
                -translate-x-1/2

                text-[11px]
                font-semibold
                text-[#F8B500]
              "
            >
              Scan
            </span>
          </div>

          {/* =========================
              DASHBOARD
          ========================== */}
          <NavButton
            label="Dashboard"
            icon={<DashboardIcon className="w-7 h-7" />}
            onClick={() => navigate("/dashboard")}
          />

          {/* =========================
              PROFILE
          ========================== */}
          <NavButton
            label="Profile"
            icon={<ProfileIcon className="w-7 h-7" />}
            onClick={() => navigate("/profile")}
          />
        </div>
      </div>
    </div>
  );
}

/* =============================
   NAV BUTTON COMPONENT
============================= */

function NavButton({ label, icon, onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        flex-col
        items-center
        justify-center

        min-w-[58px]

        transition-all
        duration-200

        hover:scale-110
        active:scale-95

        ${active ? "text-[#F8B500]" : "text-[#A0A0A0] hover:text-white"}
      `}
    >
      <span className="text-2xl leading-none">{icon}</span>

      <span className="text-[11px] mt-2">{label}</span>
    </button>
  );
}
