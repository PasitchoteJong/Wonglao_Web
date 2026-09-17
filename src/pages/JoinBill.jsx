import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { getJoinBill } from "../services/joinBill.service";
import { selectSplitMethod } from "../services/split.service";
import Loading from "../components/Loading.jsx";

export default function JoinBill() {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const joinUrl = `${window.location.origin}/join-bill/${billId}`;

  const fetchBill = async () => {
    try {
      const response = await getJoinBill(billId);
      setBill(response.data);
    } catch (error) {
      console.error("Failed to fetch join bill:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!billId) return;

    fetchBill();

    const interval = setInterval(() => {
      fetchBill();
    }, 3000);

    return () => clearInterval(interval);
  }, [billId]);

  const handleBack = () => {
    navigate(`/verify-bill/${billId}`);
  };

  const handleNext = () => {
    setShowSplitModal(true);
  };

  const handleSelectSplit = async (method) => {
    try {
      setLoading(true);
      setSubmitting(true);
      await selectSplitMethod(billId, method);

      // selectSplitMethod(method);

      setShowSplitModal(false);

      if (method === "EQUAL") navigate(`/equal-split/${billId}`);
      else if (method === "PROPORTIONAL") navigate(`/food-splitting/${billId}`);
      else if (method === "ROULETTE") navigate(`/roulette/${billId}`);
    } catch (error) {
      console.error("Failed to select split method:", error);

      alert("Failed to select split method");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  if (!bill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Bill not found
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#000000] flex flex-col items-center p-4 pt-10">
        <div className="w-full max-w-md">
          {/* Back */}

          <button
            onClick={handleBack}
            className="text-[#F8B500] hover:opacity-80 font-medium mb-6 transition-colors"
          >
            ← Back
          </button>

          {/* Main Card */}

          <div className="bg-[#1C1C1E] border-none rounded-3xl shadow-xl p-6">
            <h1 className="text-2xl font-bold text-white text-center">
              Join Bill
            </h1>

            <p className="text-sm text-[#A0A0A0] text-center mt-2">
              Scan this QR Code to join the bill
            </p>

            {/* QR */}

            <div className="flex justify-center my-8">
              {/* เพิ่มกล่องสีขาวรองรับ QR Code เพื่อให้สแกนติดง่ายขึ้นใน Dark Mode */}

              <div className="bg-white p-4 rounded-2xl">
                <QRCodeSVG value={joinUrl} size={240} level="H" />
              </div>
            </div>

            {/* Member Count */}

            <div className="text-center mb-6">
              <p className="text-sm text-[#A0A0A0]">Members joined</p>

              <p className="text-4xl font-bold text-[#F8B500]">
                {bill._count?.Billmember || 0}
              </p>
            </div>

            {/* Member List */}

            <div className="mb-6">
              <p className="font-semibold text-white mb-3">Members</p>

              <div className="flex flex-col gap-2">
                {bill.Billmember?.map((member) => (
                  <div
                    key={member.Id}
                    className="bg-[#2C2C2E] border-none rounded-xl px-4 py-3"
                  >
                    <span className="font-medium text-white">
                      {member.DisplayName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next */}

            <button
              onClick={handleNext}
              className="w-full btn border-none text-[#121212] font-bold bg-[#F8B500] hover:bg-[#E0A300] rounded-xl"
            >
              Next
            </button>
          </div>
        </div>

        {/* Split Modal */}

        {showSplitModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl w-full max-w-md p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white">
                How would you like to split the bill?
              </h2>

              <p className="text-sm text-[#A0A0A0] mt-2 mb-5">
                Choose a splitting method
              </p>

              <div className="flex flex-col gap-3">
                <button
                  disabled={submitting}
                  onClick={() => handleSelectSplit("EQUAL")}
                  className="w-full p-4 rounded-2xl bg-[#2C2C2E] border border-transparent hover:border-[#F8B500] transition-colors text-left"
                >
                  <p className="font-bold text-white">Split Equally</p>

                  <p className="text-sm text-[#A0A0A0]">
                    Everyone pays an equal share
                  </p>
                </button>

                <button
                  disabled={submitting}
                  onClick={() => handleSelectSplit("PROPORTIONAL")}
                  className="w-full p-4 rounded-2xl bg-[#2C2C2E] border border-transparent hover:border-[#F8B500] transition-colors text-left"
                >
                  <p className="font-bold text-white">Split by Proportion</p>

                  <p className="text-sm text-[#A0A0A0]">
                    Each person pays based on their selected items
                  </p>
                </button>

                <button
                  disabled={submitting}
                  onClick={() => handleSelectSplit("ROULETTE")}
                  className="w-full p-4 rounded-2xl bg-[#2C2C2E] border border-transparent hover:border-[#F8B500] transition-colors text-left"
                >
                  <p className="font-bold text-white">Split by Roulette</p>

                  <p className="text-sm text-[#A0A0A0]">
                    Let the roulette decide the split
                  </p>
                </button>
              </div>

              <button
                onClick={() => setShowSplitModal(false)}
                className="btn btn-ghost w-full mt-4 text-[#A0A0A0] hover:text-white hover:bg-[#2C2C2E]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {loading && <Loading />}
    </>
  );

  // return (
  //     <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center p-4 pt-10">

  //         <div className="w-full max-w-md">

  //             {/* Back */}

  //             <button
  //                 onClick={handleBack}
  //                 className="text-stone-500 hover:text-stone-800 font-medium mb-6"
  //             >
  //                 ← Back
  //             </button>

  //             {/* Main Card */}

  //             <div className="bg-white border border-stone-200 rounded-3xl shadow-sm p-6">

  //                 <h1 className="text-2xl font-bold text-stone-800 text-center">
  //                     Join Bill
  //                 </h1>

  //                 <p className="text-sm text-stone-500 text-center mt-2">
  //                     Scan this QR Code to join the bill
  //                 </p>

  //                 {/* QR */}

  //                 <div className="flex justify-center my-8">

  //                     <QRCodeSVG
  //                         value={joinUrl}
  //                         size={240}
  //                         level="H"
  //                     />

  //                 </div>

  //                 {/* Member Count */}

  //                 <div className="text-center mb-6">

  //                     <p className="text-sm text-stone-500">
  //                         Members joined
  //                     </p>

  //                     <p className="text-4xl font-bold text-[#D97757]">
  //                         {bill._count?.Billmember || 0}
  //                     </p>

  //                 </div>

  //                 {/* Member List */}

  //                 <div className="mb-6">

  //                     <p className="font-semibold text-stone-700 mb-3">
  //                         Members
  //                     </p>

  //                     <div className="flex flex-col gap-2">

  //                         {bill.Billmember?.map(
  //                             (member) => (

  //                                 <div
  //                                     key={member.Id}
  //                                     className="bg-[#FAFAFA] border  border-stone-200 rounded-xl px-4 py-3"
  //                                 >
  //                                     <span className="font-medium text-black">
  //                                         {member.DisplayName}
  //                                     </span>
  //                                 </div>

  //                             )
  //                         )}

  //                     </div>

  //                 </div>

  //                 {/* Next */}

  //                 <button
  //                     onClick={handleNext}
  //                     className="w-full btn border-none text-white bg-[#D97757] hover:bg-[#C26344] rounded-xl"
  //                 >
  //                     Next
  //                 </button>

  //             </div>

  //         </div>

  //         {/* Split Modal */}

  //         {showSplitModal && (

  //             <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

  //                 <div className="bg-white rounded-3xl w-full max-w-md p-6">

  //                     <h2 className="text-xl font-bold text-stone-800">
  //                         How would you like to split the bill?
  //                     </h2>

  //                     <p className="text-sm text-stone-500 mt-2 mb-5">
  //                         Choose a splitting method
  //                     </p>

  //                     <div className="flex flex-col gap-3">

  //                         <button
  //                             disabled={submitting}
  //                             onClick={() =>
  //                                 handleSelectSplit("EQUAL")
  //                             }
  //                             className="w-full p-4 rounded-2xl border border-stone-200 hover:bg-[#F4F5EB] text-left"
  //                         >
  //                             <p className="font-bold text-stone-800">
  //                                 Split Equally
  //                             </p>

  //                             <p className="text-sm text-stone-500">
  //                                 Everyone pays an equal share
  //                             </p>
  //                         </button>

  //                         <button
  //                             disabled={submitting}
  //                             onClick={() =>
  //                                 handleSelectSplit(
  //                                     "PROPORTIONAL"
  //                                 )
  //                             }
  //                             className="w-full p-4 rounded-2xl border border-stone-200 hover:bg-[#F4F5EB] text-left"
  //                         >
  //                             <p className="font-bold text-stone-800">
  //                                 Split by Proportion
  //                             </p>

  //                             <p className="text-sm text-stone-500">
  //                                 Each person pays based on their selected items
  //                             </p>
  //                         </button>

  //                         <button
  //                             disabled={submitting}
  //                             onClick={() =>
  //                                 handleSelectSplit(
  //                                     "ROULETTE"
  //                                 )
  //                             }
  //                             className="w-full p-4 rounded-2xl border border-stone-200 hover:bg-[#F4F5EB] text-left"
  //                         >
  //                             <p className="font-bold text-stone-800">
  //                                 Split by Roulette
  //                             </p>

  //                             <p className="text-sm text-stone-500">
  //                                 Let the roulette decide the split
  //                             </p>
  //                         </button>

  //                     </div>

  //                     <button
  //                         onClick={() =>
  //                             setShowSplitModal(false)
  //                         }
  //                         className="btn btn-ghost w-full mt-4"
  //                     >
  //                         Cancel
  //                     </button>

  //                 </div>

  //             </div>

  //         )}

  //     </div>
  // )
}
