import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getBillById,
  updateBillItems,
  verifyBill,
} from "../services/bill.service";
import Loading from "../components/Loading.jsx";

export default function VerifyBill() {
  const navigate = useNavigate();
  const { billId } = useParams(); // Get billId from URL parameters

  // Form state for bill general details
  const [formData, setFormData] = useState({
    shopName: "",
    billDate: "",
    totalAmount: "",
  });

  // State for storing and editing bill items (OCR results correction)
  const [items, setItems] = useState([]);
  const [previewReceipt, setPreviewReceipt] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch bill details from backend including items
    const fetchBill = async () => {
      try {
        setLoading(true);

        const response = await getBillById(billId);
        const bill = response.bill;
        // const response = await axios.get(`http://localhost:8000/api/bills/${billId}`);
        // const bill = response.data.bill;

        setFormData({
          shopName: bill.ShopName || "",
          billDate: bill.CreatedAt ? bill.CreatedAt.split("T")[0] : "",
          totalAmount: bill.TotalAmount || "",
        });

        // Set items array for editing
        setItems(bill.BillItem || []);
        setPreviewReceipt(bill.ReceiptImage);
      } catch (error) {
        console.error("Failed to fetch bill details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (billId) {
      fetchBill();
    }
  }, [billId]);

  if (loading) {
    return <Loading message="Loading..." />;
  }

  // Handle general form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle changes inside individual item rows (Name, Price, Quantity)
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Add a new empty item row manually if needed
  const handleAddItem = () => {
    setItems([...items, { Name: "", Price: "", Quantity: 1 }]);
  };

  // Remove an item row
  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Handle form submission: update items, verify general details, and navigate to food selection
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Update/Replace corrected bill items
      await updateBillItems(billId, items);
      // await axios.put(`http://localhost:8000/api/bills/${billId}/items`, {
      //     items: items.map(item => ({
      //         name: item.Name,
      //         price: parseFloat(item.Price) || 0,
      //         quantity: parseInt(item.Quantity) || 1
      //     }))
      // });

      // 2. Verify general bill details (shop name, total amount)
      await verifyBill(billId, formData);
      // await axios.put(`http://localhost:8000/api/bills/${billId}/verify`, formData, {
      //     headers: { "Content-Type": "application/json" },
      // });

      alert("Bill verified and items updated successfully!");

      // 3. Navigate to food selection page passing the billId
      navigate(`/join-bill/${billId}`);
    } catch (error) {
      console.error("Failed to verify bill:", error);
      alert("An error occurred while connecting to the backend server.");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-start p-4 pt-10 font-sans">
      {/* Return Button */}

      <div className="w-full max-w-xl mb-10">
        <Link
          to="/create-bill"
          className="text-[#F8B500] hover:opacity-80 font-medium flex items-center gap-1 w-fit transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Return
        </Link>
      </div>

      <div className="card w-full max-w-xl bg-[#1C1C1E] shadow-xl border-none rounded-3xl mb-12">
        <div className="card-body p-6">
          <h2 className="card-title text-2xl font-bold mb-1 text-white">
            Verify Bill 🧾
          </h2>

          <p className="text-[#A0A0A0] text-sm mb-6">
            Review and correct the receipt details and scanned items before
            proceeding
          </p>

          {/* Receipt Image Preview */}

          {previewReceipt && (
            <div className="flex flex-col items-center mb-6">
              <div className="border-none rounded-2xl p-2 bg-[#2C2C2E] w-full flex justify-center">
                <img
                  src={previewReceipt}
                  alt="Receipt Preview"
                  className="max-h-45 object-contain rounded-xl"
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Shop Name Input */}

            <div className="form-control w-full">
              <label className="label pb-1">
                <span className="label-text font-medium text-white">
                  Bill Name / Restaurant
                </span>
              </label>

              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="e.g. Mala Shabu"
                className="input input-bordered w-full bg-[#2C2C2E] border-transparent focus:border-[#F8B500] focus:ring-1 focus:ring-[#F8B500] transition-colors rounded-xl text-white placeholder-gray-500"
                required
              />
            </div>

            {/* Date and Total Amount Row */}

            <div className="flex gap-3">
              <div className="form-control w-1/2">
                <label className="label pb-1">
                  <span className="label-text font-medium text-white">
                    Date
                  </span>
                </label>

                <input
                  type="date"
                  name="billDate"
                  value={formData.billDate}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-[#2C2C2E] border-transparent focus:border-[#F8B500] rounded-xl text-white text-sm"
                  required
                />
              </div>

              <div className="form-control w-1/2">
                <label className="label pb-1">
                  <span className="label-text font-medium text-white">
                    Total (THB)
                  </span>
                </label>

                <input
                  type="number"
                  step="any"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="input input-bordered w-full bg-[#2C2C2E] border-transparent focus:border-[#F8B500] rounded-xl text-[#F8B500] font-bold placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Editable Bill Items Section (OCR Correction) */}

            <div className="divider my-2 text-[#A0A0A0] text-xs before:bg-[#2C2C2E] after:bg-[#2C2C2E]">
              Edit Scanned Items
            </div>

            <div className="flex flex-col gap-2">
              {/* Header */}
              <div className="flex gap-2 items-center px-3 text-xs text-[#A0A0A0]">
                <div className="flex-grow">Item Name</div>

                <div className="w-20 text-center">Price</div>

                <div className="w-16 text-center">Qty</div>

                <div className="w-8"></div>
              </div>

              {/* Items */}
              {items.map((item, index) => (
                <div
                  key={item.Id || index}
                  className="flex gap-2 items-center bg-[#2C2C2E] p-3 rounded-2xl border-none"
                >
                  <input
                    type="text"
                    value={item.Name || ""}
                    onChange={(e) =>
                      handleItemChange(index, "Name", e.target.value)
                    }
                    placeholder="Item name"
                    className="input input-sm input-bordered flex-grow bg-[#1C1C1E] border-transparent focus:border-[#F8B500] rounded-lg text-white placeholder-gray-500"
                    required
                  />

                  <input
                    type="number"
                    step="any"
                    value={item.Price !== undefined ? item.Price : ""}
                    onChange={(e) =>
                      handleItemChange(index, "Price", e.target.value)
                    }
                    placeholder="Price"
                    className="input input-sm input-bordered w-20 bg-[#1C1C1E] border-transparent focus:border-[#F8B500] rounded-lg text-white placeholder-gray-500"
                    required
                  />

                  <input
                    type="number"
                    value={item.Quantity || 1}
                    onChange={(e) =>
                      handleItemChange(index, "Quantity", e.target.value)
                    }
                    placeholder="Qty"
                    className="input input-sm input-bordered w-16 bg-[#1C1C1E] border-transparent focus:border-[#F8B500] rounded-lg text-white placeholder-gray-500"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-400 font-bold px-2 py-1 text-sm transition-colors w-8"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddItem}
                className="btn btn-sm btn-outline border-[#A0A0A0] text-[#A0A0A0] hover:bg-[#2C2C2E] hover:border-white hover:text-white rounded-xl mt-1"
              >
                + Add Item Manually
              </button>
            </div>

            {/* Submit Button */}

            <button
              type="submit"
              className="btn mt-4 w-full text-lg border-none text-[#121212] rounded-xl bg-[#F8B500] hover:bg-[#E0A300] shadow-md font-bold"
            >
              Confirm & Select Food 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // return (
  //     <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-start p-4 pt-10 font-sans">

  //         {/* Return Button */}
  //         <div className="w-full max-w-xl mb-10">
  //             <Link
  //                 to="/create-bill"
  //                 className="text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 w-fit transition-colors"
  //             >
  //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  //                     <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
  //                 </svg>
  //                 Return
  //             </Link>
  //         </div>

  //         <div className="card w-full max-w-xl bg-white shadow-sm border border-stone-200 rounded-3xl mb-12">
  //             <div className="card-body p-6">
  //                 <h2 className="card-title text-2xl font-bold mb-1 text-stone-800">Verify Bill 🧾</h2>
  //                 <p className="text-stone-500 text-sm mb-6">Review and correct the receipt details and scanned items before proceeding</p>

  //                 {/* Receipt Image Preview */}
  //                 {previewReceipt && (
  //                     <div className="flex flex-col items-center mb-6">
  //                         <div className="border border-stone-200 rounded-2xl p-2 bg-[#FAFAFA] w-full flex justify-center">
  //                             <img
  //                                 src={previewReceipt}
  //                                 alt="Receipt Preview"
  //                                 className="max-h-45 object-contain rounded-xl"
  //                             />
  //                         </div>
  //                     </div>
  //                 )}

  //                 <form onSubmit={handleSubmit} className="flex flex-col gap-5">

  //                     {/* Shop Name Input */}
  //                     <div className="form-control w-full">
  //                         <label className="label pb-1">
  //                             <span className="label-text font-medium text-stone-700">Bill Name / Restaurant</span>
  //                         </label>
  //                         <input
  //                             type="text"
  //                             name="shopName"
  //                             value={formData.shopName}
  //                             onChange={handleChange}
  //                             placeholder="e.g. Mala Shabu"
  //                             className="input input-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] transition-colors rounded-xl text-stone-700"
  //                             required
  //                         />
  //                     </div>

  //                     {/* Date and Total Amount Row */}
  //                     <div className="flex gap-3">
  //                         <div className="form-control w-1/2">
  //                             <label className="label pb-1">
  //                                 <span className="label-text font-medium text-stone-700">Date</span>
  //                             </label>
  //                             <input
  //                                 type="date"
  //                                 name="billDate"
  //                                 value={formData.billDate}
  //                                 onChange={handleChange}
  //                                 className="input input-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] rounded-xl text-stone-700 text-sm"
  //                                 required
  //                             />
  //                         </div>

  //                         <div className="form-control w-1/2">
  //                             <label className="label pb-1">
  //                                 <span className="label-text font-medium text-stone-700">Total (THB)</span>
  //                             </label>
  //                             <input
  //                                 type="number"
  //                                 step="any"
  //                                 name="totalAmount"
  //                                 value={formData.totalAmount}
  //                                 onChange={handleChange}
  //                                 placeholder="0.00"
  //                                 className="input input-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] rounded-xl text-[#D97757] font-bold"
  //                                 required
  //                             />
  //                         </div>
  //                     </div>

  //                     {/* Editable Bill Items Section (OCR Correction) */}
  //                     <div className="divider my-2 text-stone-400 text-xs">Edit Scanned Items</div>

  //                     <div className="flex flex-col gap-3">
  //                         {items.map((item, index) => (
  //                             <div key={item.Id || index} className="flex gap-2 items-center bg-[#FAFAFA] p-3 rounded-2xl border border-stone-200">
  //                                 <input
  //                                     type="text"
  //                                     value={item.Name || ""}
  //                                     onChange={(e) => handleItemChange(index, "Name", e.target.value)}
  //                                     placeholder="Item name"
  //                                     className="input input-sm input-bordered flex-grow bg-white rounded-lg text-stone-700"
  //                                     required
  //                                 />
  //                                 <input
  //                                     type="number"
  //                                     step="any"
  //                                     value={item.Price !== undefined ? item.Price : ""}
  //                                     onChange={(e) => handleItemChange(index, "Price", e.target.value)}
  //                                     placeholder="Price"
  //                                     className="input input-sm input-bordered w-20 bg-white rounded-lg text-stone-700"
  //                                     required
  //                                 />
  //                                 <input
  //                                     type="number"
  //                                     value={item.Quantity || 1}
  //                                     onChange={(e) => handleItemChange(index, "Quantity", e.target.value)}
  //                                     placeholder="Qty"
  //                                     className="input input-sm input-bordered w-16 bg-white rounded-lg text-stone-700"
  //                                     required
  //                                 />
  //                                 <button
  //                                     type="button"
  //                                     onClick={() => handleRemoveItem(index)}
  //                                     className="text-red-400 hover:text-red-600 font-bold px-2 py-1 text-sm"
  //                                     title="Remove item"
  //                                 >
  //                                     ✕
  //                                 </button>
  //                             </div>
  //                         ))}

  //                         <button
  //                             type="button"
  //                             onClick={handleAddItem}
  //                             className="btn btn-sm btn-outline border-stone-300 text-stone-600 hover:bg-stone-100 hover:border-stone-400 rounded-xl mt-1"
  //                         >
  //                             + Add Item Manually
  //                         </button>
  //                     </div>

  //                     {/* Submit Button */}
  //                     <button
  //                         type="submit"
  //                         className="btn mt-4 w-full text-lg border-none text-white rounded-xl bg-[#D97757] hover:bg-[#C26344] shadow-md"
  //                     >
  //                         Confirm & Select Food 🚀
  //                     </button>

  //                 </form>
  //             </div>
  //         </div>

  //     </div>
  // );
}
