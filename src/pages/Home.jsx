import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-10 p-4 font-sans">
      
      {/* ส่วนข้อความต้อนรับแบบคลีนๆ */}
      <div className="text-center mt-[-10vh]">
        <h1 className="text-4xl font-bold text-stone-800 mb-3">Let's go Dutch ☕️</h1>
        <p className="text-stone-500 font-medium">แชร์ค่าอาหารกับแก๊งเพื่อนแบบชิลๆ</p>
      </div>

      {/* ปุ่มกดตรงกลางจอที่นิ้วโป้งเอื้อมถึงง่าย */}
      <Link 
        to="/create-bill" 
        className="btn w-full max-w-xs text-lg border-none text-white rounded-2xl bg-[#D97757] hover:bg-[#C26344] shadow-lg py-3 h-auto"
      >
        + create bill
      </Link>
      
    </div>
  );
}