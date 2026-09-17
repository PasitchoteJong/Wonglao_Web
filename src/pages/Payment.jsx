import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { getMyPayment, uploadPaymentSlip } from "../services/payment.service";

const Payment = () => {
  const { billId } = useParams();

  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [slip, setSlip] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadSlip = async () => {
    if (!slip) return;

    const formData = new FormData();

    formData.append("proofImage", slip);

    try {
      setUploading(true);

      await uploadPaymentSlip(billId, formData);

      alert("Payment slip uploaded");
      navigate("/verify-payment");
    } catch (error) {
      console.error("Upload slip error:", error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const result = await getMyPayment(billId);

        setPayment(result.data);
      } catch (error) {
        console.error("Load payment error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [billId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!payment) {
    return <div>Payment not found</div>;
  }

  const owner = payment.Bill.user;

  return (
    <div className="min-h-screen bg-[#000000] font-sans text-white p-6 pt-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white">Payment</h1>

        <div className="mt-6 p-6 bg-[#1C1C1E] rounded-3xl shadow-xl">
          <p className="text-sm text-[#A0A0A0]">Shop</p>

          <h2 className="font-bold text-lg text-white mt-1">
            {payment.Bill.ShopName}
          </h2>

          <div className="divider my-4 before:bg-[#2C2C2E] after:bg-[#2C2C2E]" />

          <p className="text-sm text-[#A0A0A0]">Your amount</p>

          <p className="text-4xl font-bold text-[#F8B500] mt-2">
            ฿{Number(payment.AmountToPay).toFixed(2)}
          </p>
        </div>

        <div className="mt-6 p-6 bg-[#1C1C1E] rounded-3xl shadow-xl">
          <h2 className="font-bold text-white text-lg">Pay to</h2>

          <p className="text-[#A0A0A0] mt-1">{owner.DisplayName}</p>

          {owner.QRpayment && (
            <div className="mt-5 flex justify-center bg-white p-4 rounded-2xl mx-auto w-fit">
              <img
                src={`http://localhost:8808${owner.QRpayment}`}
                alt="Payment QR"
                className="w-64 h-64 object-contain rounded-lg"
              />
            </div>
          )}

          {owner.PromptPay && (
            <p className="text-center mt-5 text-[#A0A0A0] font-medium">
              PromptPay:{" "}
              <span className="text-white ml-1">{owner.PromptPay}</span>
            </p>
          )}
        </div>

        {/* <button

                    className="btn btn-primary w-full mt-6"

                >

                    Upload Payment Slip

                </button> */}

        <div className="mt-8">
          <h2 className="font-bold text-white mb-3"> Upload Payment Slip</h2>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setSlip(e.target.files[0]);
            }}
            className="file-input file-input-bordered w-full bg-[#2C2C2E] border-transparent text-white focus:border-[#F8B500] rounded-xl"
          />

          <button
            onClick={handleUploadSlip}
            disabled={!slip || uploading}
            className="btn w-full mt-6 border-none text-[#121212] font-bold bg-[#F8B500] hover:bg-[#E0A300] rounded-xl disabled:bg-[#3C3C3E] disabled:text-[#888888] transition-colors"
          >
            {uploading ? "Uploading..." : "Submit Payment Slip"}
          </button>
        </div>
      </div>
    </div>
  );

  // return (
  //     <div className="min-h-screen p-6">
  //         <div className="max-w-md mx-auto">

  //             <h1 className="text-2xl font-bold">
  //                 Payment
  //             </h1>

  //             <div className="mt-6 p-5 bg-base-200 rounded-xl">

  //                 <p className="text-sm opacity-70">
  //                     Shop
  //                 </p>

  //                 <h2 className="font-bold text-lg">
  //                     {payment.Bill.ShopName}
  //                 </h2>

  //                 <div className="divider" />

  //                 <p className="text-sm opacity-70">
  //                     Your amount
  //                 </p>

  //                 <p className="text-4xl font-bold">
  //                     ฿{Number(payment.AmountToPay).toFixed(2)}
  //                 </p>

  //             </div>

  //             <div className="mt-6">
  //                 <h2 className="font-bold">
  //                     Pay to
  //                 </h2>

  //                 <p>
  //                     {owner.DisplayName}
  //                 </p>

  //                 {owner.QRpayment && (
  //                     <div className="mt-4 flex justify-center">
  //                         <img
  //                             src={`http://localhost:8808${owner.QRpayment}`}
  //                             alt="Payment QR"
  //                             className="w-64 h-64 object-contain"
  //                         />
  //                     </div>
  //                 )}

  //                 {owner.PromptPay && (
  //                     <p className="text-center mt-3">
  //                         PromptPay: {owner.PromptPay}
  //                     </p>
  //                 )}
  //             </div>

  //             {/* <button
  //                 className="btn btn-primary w-full mt-6"
  //             >
  //                 Upload Payment Slip
  //             </button> */}
  //             <div className="mt-6">
  //                 <h2 className="fond-bold"> Upload Payment Slip</h2>
  //                 <input
  //                     type="file"
  //                     accept="image/*"
  //                     onChange={(e) => {
  //                         setSlip(e.target.files[0]);
  //                     }}
  //                     className="file-input file-input-bordered w-full"
  //                 />

  //                 <button
  //                     onClick={handleUploadSlip}
  //                     disabled={!slip || uploading}
  //                     className="btn btn-primary w-full mt-4"
  //                 >
  //                     {uploading
  //                         ? "Uploading..."
  //                         : "Submit Payment Slip"}
  //                 </button>

  //             </div>

  //         </div>
  //     </div>
  // );
};

export default Payment;
