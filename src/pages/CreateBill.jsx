import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import {
  createBill,
  processBillOCR
} from "../services/bill.service";

export default function CreateBill() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    billName: "",
    receiptFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append("billName", formData.billName);

    if (formData.receiptFile) {
      dataToSend.append("receiptFile", formData.receiptFile);
    }

    try {
      // ยิงข้อมูลไปที่หลังบ้าน (เช็กพอร์ตให้ตรงกับเครื่องของคุณ เช่น 8000)
      const response = await createBill(dataToSend);
      // const response = await axios.post("http://localhost:8808/api/bills", dataToSend, {
      //   headers: {
      //     "Content-Type": "multipart/form-data", 
      //   },
      // });
      // console.log("response CreateBill:", response)

      // console.log("Data sent successfully:", response.data);

      // ดึง billId ที่ได้จากหลังบ้าน (รองรับทั้งฟิลด์ Id ตัวใหญ่หรือเล็ก)
      const billId = response.bill?.Id;
      console.log("BillId:", billId)
      if(!billId){
        throw new Error("Bill Id is missing");
      }

      await processBillOCR(billId);
      console.log("OCR Completed");

      navigate(`/verify-bill/${billId}`)
      




    } catch (error) {
      console.error("Failed to create/process bill:", error);
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-start p-4 pt-10 font-sans">

      <div className="w-full max-w-md mb-14">
        <Link
          to="/"
          className="text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 w-fit transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Return
        </Link>
      </div>

      <div className="card w-full max-w-md bg-white shadow-sm border border-stone-200 rounded-3xl">
        <div className="card-body p-6">
          <h2 className="card-title text-2xl font-bold mb-1 text-stone-800">Create New Bill ☕️</h2>
          <p className="text-stone-500 text-sm mb-6">Upload your receipt photo to start splitting with friends</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Bill Name Input */}
            <div className="form-control w-full">
              <label className="label pb-1">
                <span className="label-text font-medium text-stone-700">Bill Name / Restaurant</span>
              </label>
              <input
                type="text"
                name="billName"
                placeholder="e.g. Mala Shabu, Cafe around the corner"
                className="input input-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] transition-colors rounded-xl text-stone-700"
                value={formData.billName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Receipt Upload Input */}
            <div className="form-control w-full">
              <label className="label pb-1">
                <span className="label-text font-medium text-stone-700">Upload Receipt</span>
              </label>
              <input
                type="file"
                name="receiptFile"
                className="file-input file-input-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] rounded-xl text-stone-600"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn mt-6 w-full text-lg border-none text-white rounded-xl bg-[#D97757] hover:bg-[#C26344] shadow-md"
            >
              Next 🚀
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}