import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios"; // Remember to install axios and cors when ready to use ***

export default function VerifyBill() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        shopName: "Mala Shabu", // Mock data parsed from receipt (OCR)
        billDate: "2026-09-02",
        totalAmount: "850",
    });

    // Mock receipt image passed from the previous step
    const [previewReceipt] = useState("https://placehold.co/300x400/D97757/FFF?text=Receipt+Image");

    // Universal handleChange function following your team's pattern
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("Verified Data to Send:", formData);
        alert(`Bill "${formData.shopName}" verified successfully!`);

        /* === Uncomment this block when ready to connect backend ===
        try {
            const response = await axios.post("http://localhost:8808/api/bills/verify", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Data verified and sent successfully:", response.data);
            alert("Proceeding to item selection!");
            
        } catch (error) {
            console.error("Failed to send data:", error);
            alert("An error occurred while connecting to the backend server.");
        }
        ======================================================== */

        navigate("/food-splitting");
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-start p-4 pt-10 font-sans">
            
            {/* Return Button */}
            <div className="w-full max-w-md mb-14">
                <Link 
                    to="/create-bill" 
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
                    <h2 className="card-title text-2xl font-bold mb-1 text-stone-800">Verify Bill 🧾</h2>
                    <p className="text-stone-500 text-sm mb-6">Review and verify the receipt details before proceeding</p>

                    {/* Receipt Image Preview */}
                    {previewReceipt && (
                        <div className="flex flex-col items-center mb-6">
                            <div className="border border-stone-200 rounded-2xl p-2 bg-[#FAFAFA] w-full flex justify-center">
                                <img 
                                    src={previewReceipt}
                                    alt="Receipt Preview"
                                    className="max-h-40 object-contain rounded-xl"
                                />
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        
                        {/* Shop Name Input */}
                        <div className="form-control w-full">
                            <label className="label pb-1">
                                <span className="label-text font-medium text-stone-700">Bill Name / Restaurant</span>
                            </label>
                            <input 
                                type="text" 
                                name="shopName" 
                                value={formData.shopName} 
                                onChange={handleChange} 
                                placeholder="e.g. Mala Shabu" 
                                className="input input-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] transition-colors rounded-xl text-stone-700" 
                                required 
                            />
                        </div>

                        {/* Date and Total Amount Row */}
                        <div className="flex gap-3">
                            <div className="form-control w-1/2">
                                <label className="label pb-1">
                                    <span className="label-text font-medium text-stone-700">Date</span>
                                </label>
                                <input 
                                    type="date" 
                                    name="billDate" 
                                    value={formData.billDate} 
                                    onChange={handleChange} 
                                    className="input input-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] rounded-xl text-stone-700 text-sm" 
                                    required 
                                />
                            </div>

                            <div className="form-control w-1/2">
                                <label className="label pb-1">
                                    <span className="label-text font-medium text-stone-700">Total (THB)</span>
                                </label>
                                <input 
                                    type="number" 
                                    name="totalAmount" 
                                    value={formData.totalAmount} 
                                    onChange={handleChange} 
                                    placeholder="0.00" 
                                    className="input input-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] rounded-xl text-[#D97757] font-bold" 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="btn mt-4 w-full text-lg border-none text-white rounded-xl bg-[#D97757] hover:bg-[#C26344] shadow-md"
                        >
                            Confirm Details 🚀
                        </button>
                        
                    </form>
                </div>
            </div>
            
        </div>
    );
}