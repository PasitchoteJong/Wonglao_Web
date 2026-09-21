import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading.jsx";

export default function BillSummary() {
  const { billId } = useParams();

  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `http://localhost:8000/api/bills/${billId}/summary`,
        );
        setSummaryData(response.data);
      } catch (err) {
        console.error("Failed to fetch bill summary:", err);
        setError("Could not load bill summary.");
      } finally {
        setLoading(false);
      }
    };

    if (billId) {
      fetchSummary();
    }
  }, [billId]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-sans">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-start p-4 pt-10 font-sans pb-20">
        {/* Return to Food Selection */}

        <div className="w-full max-w-xl mb-6">
          <Link
            to={`/food-splitting/${billId}`}
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
            Back to Food Selection
          </Link>
        </div>

        <div className="w-full max-w-xl bg-[#1C1C1E] shadow-xl border-none rounded-3xl p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Bill Summary 💸</h2>

            <p className="text-[#A0A0A0] text-sm">
              {summaryData?.shopName || "Restaurant Bill"}
            </p>

            <div className="mt-3 inline-block bg-[#2C2C2E] border border-transparent px-4 py-2 rounded-2xl">
              <span className="text-xs text-[#A0A0A0] block">Grand Total</span>

              <span className="text-xl font-bold text-[#F8B500]">
                ฿{summaryData?.grandTotal}
              </span>
            </div>
          </div>

          <div className="divider my-2 text-[#A0A0A0] text-xs before:bg-[#2C2C2E] after:bg-[#2C2C2E]">
            Individual Breakdown
          </div>

          {/* Member Summaries List */}

          <div className="flex flex-col gap-4 mt-4">
            {summaryData?.summary?.map((member) => (
              <div
                key={member.memberId}
                className="bg-[#2C2C2E] border-none rounded-2xl p-4 flex flex-col gap-3 shadow-md"
              >
                <div className="flex justify-between items-center border-b border-[#1C1C1E] pb-2">
                  <span className="font-bold text-white text-lg">
                    {member.displayName}
                  </span>

                  <span className="font-bold text-[#F8B500] text-lg">
                    ฿{member.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  {member.items.length === 0 ? (
                    <span className="text-xs text-[#A0A0A0] italic">
                      No items selected
                    </span>
                  ) : (
                    member.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-xs text-[#A0A0A0]"
                      >
                        <span>• {item.itemName}</span>

                        <span className="font-medium text-white">
                          ฿{item.shareCost.toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );

  // return (
  //   <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-start p-4 pt-10 font-sans pb-20">

  //     {/* Return to Food Selection */}
  //     <div className="w-full max-w-xl mb-6">
  //       <Link
  //         to={`/food-splitting/${billId}`}
  //         className="text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 w-fit transition-colors"
  //       >
  //         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  //           <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
  //         </svg>
  //         Back to Food Selection
  //       </Link>
  //     </div>

  //     <div className="w-full max-w-xl bg-white shadow-sm border border-stone-200 rounded-3xl p-6 mb-6">
  //       <div className="text-center mb-6">
  //         <h2 className="text-2xl font-bold text-stone-800">Bill Summary 💸</h2>
  //         <p className="text-stone-500 text-sm">{summaryData?.shopName || "Restaurant Bill"}</p>
  //         <div className="mt-3 inline-block bg-[#F4F5EB] border border-[#939C76] px-4 py-2 rounded-2xl">
  //           <span className="text-xs text-stone-600 block">Grand Total</span>
  //           <span className="text-xl font-bold text-[#D97757]">฿{summaryData?.grandTotal}</span>
  //         </div>
  //       </div>

  //       <div className="divider my-2 text-stone-300 text-xs">Individual Breakdown</div>

  //       {/* Member Summaries List */}
  //       <div className="flex flex-col gap-4 mt-4">
  //         {summaryData?.summary?.map((member) => (
  //           <div key={member.memberId} className="bg-[#FAFAFA] border border-stone-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
  //             <div className="flex justify-between items-center border-b border-stone-200 pb-2">
  //               <span className="font-bold text-stone-800 text-lg">{member.displayName}</span>
  //               <span className="font-bold text-[#D97757] text-lg">฿{member.totalAmount.toFixed(2)}</span>
  //             </div>

  //             <div className="flex flex-col gap-1">
  //               {member.items.length === 0 ? (
  //                 <span className="text-xs text-stone-400 italic">No items selected</span>
  //               ) : (
  //                 member.items.map((item, idx) => (
  //                   <div key={idx} className="flex justify-between text-xs text-stone-600">
  //                     <span>• {item.itemName}</span>
  //                     <span className="font-medium">฿{item.shareCost.toFixed(2)}</span>
  //                   </div>
  //                 ))
  //               )}
  //             </div>
  //           </div>
  //         ))}
  //       </div>

  //     </div>

  //   </div>
  // );
}
