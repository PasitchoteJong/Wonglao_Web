import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function Home() {
  const navigate = useNavigate();
  // const token = localStorage.getItem("accessToken");

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-10 p-4 font-sans">

      <div className="text-center ">
        <h1 className="text-4xl font-bold text-stone-800 mb-3">Let's go Dutch ☕️</h1>
        <p className="text-stone-500 font-medium">Split bills with your besties </p>
      </div>

      {!isLoggedIn ? (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Link to="/loginline" className="btn w-full text-lg border-none text-white rounded-2xl bg-[#06C755] hover:bg-[#05B34C]">
            Login with Line
          </Link>

          <Link to="/register-line" className="btn w-full text-lg rounded-2xl">
            Register
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Link to="/create-bill" className="btn w-full text-lg border-none text-white rounded-2xl bg-[#D97757] hover:bg-[#C26344]">
            Create Bill
          </Link>

          <Link to="/r-roulette" className="btn w-full text-lg rounded-2xl">
            🎲 Russian Roulette
          </Link>
          <button onClick={handleLogout} className="btn btn-outline w-full rounded-2xl" >
            Logout
          </button>
        </div>
      )}




    </div>
  );
}