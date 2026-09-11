import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function FoodSplitting() {
  const { billId } = useParams(); // Get billId from URL parameters
  const navigate = useNavigate(); // Hook for programmatic navigation

  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [items, setItems] = useState([]);
  const [selections, setSelections] = useState({}); // Track eating status: { [itemId]: boolean }

  // Fetch bill, members, and food items data from backend
  useEffect(() => {
    const fetchFoodSelectionData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/bills/${billId}/selection`);
        const bill = response.data.bill;
        
        setItems(bill.BillItem || []);
        setMembers(bill.Billmember || []);

        // Default select the first member if available
        if (bill.Billmember && bill.Billmember.length > 0) {
          const defaultMemberId = bill.Billmember[0].Id;
          setSelectedMemberId(defaultMemberId);
          loadMemberSelections(bill.BillItem || [], defaultMemberId);
        }
      } catch (error) {
        console.error("Failed to fetch food selection data:", error);
      }
    };

    if (billId) {
      fetchFoodSelectionData();
    }
  }, [billId]);

  // Load particular member's existing food selections into local state
  const loadMemberSelections = (allItems, memberId) => {
    const map = {};
    allItems.forEach(item => {
      const userSelection = item.BillItemMember?.find(
        (bim) => bim.BillMemberId === memberId
      );
      map[item.Id] = userSelection ? userSelection.Eating : false;
    });
    setSelections(map);
  };

  // Handle member dropdown change
  const handleMemberChange = (e) => {
    const newMemberId = e.target.value;
    setSelectedMemberId(newMemberId);
    loadMemberSelections(items, newMemberId);
  };

  // Toggle item selection state
  const toggleItem = (id) => {
    setSelections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculate total price for selected items of the current member
  const totalSelected = items
    .filter(item => selections[item.Id])
    .reduce((sum, item) => sum + parseFloat(item.Price || 0), 0);

  // Handle form submission to save selections to backend and navigate to summary
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formattedSelections = Object.keys(selections).map(itemId => ({
        billItemId: itemId,
        eating: selections[itemId]
      }));

      await axios.put(`http://localhost:8000/api/bills/${billId}/selection`, {
        billMemberId: selectedMemberId,
        selections: formattedSelections
      }, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Food selections saved successfully!");
      
      // Navigate to bill summary page after saving
      navigate(`/food-splitting/${billId}/summary`);
      
    } catch (error) {
      console.error("Error saving food selections:", error);
      alert("An error occurred while saving selections.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-start p-4 pt-10 font-sans pb-32">
      
      {/* Return Button */}
      <div className="w-full max-w-md mb-6">
        <Link 
          to={`/verify-bill/${billId}`} 
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
        <p className="text-stone-500 text-sm mb-6">Select your name and check the dishes you ate</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" id="splitForm">
          
          {/* Member Selector Dropdown */}
          <div className="form-control w-full">
            <label className="label pb-1">
              <span className="label-text font-medium text-stone-700">Select Member</span>
            </label>
            <select 
              value={selectedMemberId} 
              onChange={handleMemberChange}
              className="select select-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] rounded-xl text-stone-700 font-medium"
              required
            >
              {members.length === 0 ? (
                <option value="">No members available (Please add members in DB)</option>
              ) : (
                members.map(member => (
                  <option key={member.Id} value={member.Id}>
                    {member.DisplayName || "Unnamed Member"}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Menu Items Checklist */}
          <div className="flex flex-col gap-3">
            <label className="label pb-0">
              <span className="label-text font-medium text-stone-700">Menu Items</span>
            </label>

            {items.length === 0 ? (
              <p className="text-center text-stone-400 py-4 text-sm">No items found in this bill.</p>
            ) : (
              items.map((item) => {
                const isSelected = !!selections[item.Id];
                return (
                  <div 
                    key={item.Id}
                    onClick={() => toggleItem(item.Id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex justify-between items-center shadow-sm
                      ${isSelected 
                        ? 'bg-[#F4F5EB] border-[#939C76] text-stone-800' 
                        : 'bg-[#FAFAFA] border-stone-200 text-stone-600'}`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
                        ${isSelected ? 'bg-[#D97757] border-[#D97757]' : 'border-stone-300 bg-white'}`}>
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`font-medium text-sm ${isSelected ? 'font-bold' : ''}`}>{item.Name}</span>
                    </div>
                    <span className="font-semibold text-sm">฿{item.Price}</span>
                  </div>
                );
              })
            )}
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
            className={`btn border-none text-white rounded-xl px-6 ${selectedMemberId && items.length > 0 ? 'bg-[#D97757] hover:bg-[#C26344]' : 'bg-stone-300'}`}
            disabled={!selectedMemberId || items.length === 0}
          >
            Save Selection ✅
          </button>
        </div>
      </div>

    </div>
  );
}