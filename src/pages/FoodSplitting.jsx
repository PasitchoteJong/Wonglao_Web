import { useState } from "react";
import { Link } from "react-router-dom";
// import axios from "axios"; // Uncomment when ready to connect backend

export default function FoodSplitting() {

  const [items, setItems] = useState([
    { id: 1, name: "Mala Shabu Set", price: 450, selected: false },
    { id: 2, name: "Sliced Pork Belly", price: 199, selected: false },
    { id: 3, name: "Fried Tofu Skin", price: 60, selected: false },
    { id: 4, name: "Green Tea (Refill)", price: 140, selected: false },
  ]);

  const [payerName, setPayerName] = useState("");

  const handleChange = (e) => {
    setPayerName(e.target.value);
  };

  // Toggle item selection
  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  // Calculate total for selected items
  const totalSelected = items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const splitData = {
      payerName,
      selectedItems: items.filter(item => item.selected),
      totalSelected
    };

    console.log("Split Data to Send:", splitData);
    alert(`Successfully recorded items for ${payerName || "Guest"}! Total: ฿${totalSelected}`);

    /* === Uncomment when connecting to backend ===
    try {
      const response = await axios.post("http://localhost:8808/api/bills/split", splitData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving split data:", error);
    }
    ============================================ */
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-start p-4 pt-10 font-sans pb-32">
      
      {/* Return Button */}
      <div className="w-full max-w-md mb-6">
        <Link 
          to="/verify-bill" 
          className="text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 w-fit transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Return
        </Link>
      </div>

      <div className="w-full max-w-md bg-white shadow-sm border border-stone-200 rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-1 text-stone-800">Split Bill 🍲</h2>
        <p className="text-stone-500 text-sm mb-6">Select the dishes you ate and enter your name</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" id="splitForm">
          
          {/* Your Name Input */}
          <div className="form-control w-full">
            <label className="label pb-1">
              <span className="label-text font-medium text-stone-700">Your Name</span>
            </label>
            <input 
              type="text" 
              name="payerName" 
              value={payerName}
              onChange={handleChange}
              placeholder="e.g. Peng" 
              className="input input-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] rounded-xl text-stone-700" 
              required 
            />
          </div>

          {/* Menu Items Checklist */}
          <div className="flex flex-col gap-3">
            <label className="label pb-0">
              <span className="label-text font-medium text-stone-700">Menu Items</span>
            </label>

            {items.map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex justify-between items-center shadow-sm
                  ${item.selected 
                    ? 'bg-[#F4F5EB] border-[#939C76] text-stone-800' 
                    : 'bg-[#FAFAFA] border-stone-200 text-stone-600'}`
                }
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
                    ${item.selected ? 'bg-[#D97757] border-[#D97757]' : 'border-stone-300 bg-white'}`}>
                    {item.selected && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`font-medium text-sm ${item.selected ? 'font-bold' : ''}`}>{item.name}</span>
                </div>
                <span className="font-semibold text-sm">฿{item.price}</span>
              </div>
            ))}
          </div>

        </form>
      </div>

      {/* Fixed Bottom Summary & Submit */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] flex justify-center">
        <div className="w-full max-w-md flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500 font-medium">Total (Selected)</p>
            <p className="text-xl font-bold text-[#D97757]">฿{totalSelected}</p>
          </div>
          <button 
            type="submit" 
            form="splitForm"
            className={`btn border-none text-white rounded-xl px-6 ${totalSelected > 0 && payerName ? 'bg-[#D97757] hover:bg-[#C26344]' : 'bg-stone-300'}`}
            disabled={totalSelected === 0 || !payerName}
          >
            Confirm Split 🧾
          </button>
        </div>
      </div>

    </div>
  );
}