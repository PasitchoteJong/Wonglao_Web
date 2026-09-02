import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios"; // Remember to install axios and cors when ready to use ***

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

    /* === Uncomment this block when ready to connect backend ===
    try {
      const response = await axios.post("http://localhost:8808/api/bills", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });

      console.log("Data sent successfully:", response.data);
      alert(`Bill "${formData.billName}" created successfully!`);
      
      // เมื่อยิงหลังบ้านสำเร็จ ให้วิ่งไปหน้า Verify ต่อ
      navigate("/verify-bill");
      
    } catch (error) {
      console.error("Failed to send data:", error);
      alert("An error occurred while connecting to the backend server.");
    }
    ======================================================== */

    // Temporary alert and redirect for UI testing
    alert(`Bill "${formData.billName}" created successfully!`);
    navigate("/verify-bill"); 
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