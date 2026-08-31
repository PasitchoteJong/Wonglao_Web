import { useState } from "react";
import { Link } from "react-router-dom";

export default function CreateBill() {
  const [billName, setBillName] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);

  const handleUpload = (e) => {
    setReceiptFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ชื่อบิล:", billName);
    console.log("ไฟล์ใบเสร็จ:", receiptFile);
    alert(`สร้างบิล "${billName}" สำเร็จ!`);
  };

  return (
    // พื้นหลังสีครีมเบจ (Beige) ดูสบายตา
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-start p-4 pt-10 font-sans">
      
      {/* ปุ่มย้อนกลับ */}
      <div className="w-full max-w-md mb-14">
        <Link to="/" className="text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 w-fit transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Return
        </Link>
      </div>

      {/* การ์ดขอบมนนุ่มนวล เงาบางๆ ดูคลีนและเป็นมิตร */}
      <div className="card w-full max-w-md bg-white shadow-sm border border-stone-200 rounded-3xl">
        <div className="card-body p-6">
          <h2 className="card-title text-2xl font-bold mb-1 text-stone-800">สร้างบิลใหม่ ☕️</h2>
          <p className="text-stone-500 text-sm mb-6">อัปโหลดรูปใบเสร็จเพื่อเริ่มหารค่าแก๊งค์กันเลย</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* ส่วนกรอกชื่อบิล */}
            <div className="form-control w-full">
              <label className="label pb-1">
                <span className="label-text font-medium text-stone-700">ชื่อบิล / ร้านอาหาร</span>
              </label>
              <input 
                type="text" 
                placeholder="เช่น ชาบูหม่าล่า, คาเฟ่หน้าปากซอย" 
                className="input input-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] transition-colors rounded-xl text-stone-700" 
                value={billName} 
                onChange={(e) => setBillName(e.target.value)} 
                required 
              />
            </div>
            
            {/* ส่วนอัปโหลดรูปใบเสร็จ */}
            <div className="form-control w-full">
              <label className="label pb-1">
                <span className="label-text font-medium text-stone-700">อัปโหลดรูปใบเสร็จ</span>
              </label>
              <input 
                type="file" 
                className="file-input file-input-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] rounded-xl text-stone-600" 
                accept="image/*" 
                onChange={handleUpload} 
              />
            </div>

            {/* ปุ่มยืนยันสีส้มอิฐ (Terracotta) */}
            <button 
              type="submit" 
              className="btn mt-6 w-full text-lg border-none text-white rounded-xl bg-[#D97757] hover:bg-[#C26344] shadow-md"
            >
              ไปต่อกันเลย 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}