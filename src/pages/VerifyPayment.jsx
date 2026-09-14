import { useEffect, useState } from "react";

import {
    getPaymentSummary,
    verifyPaymentSlip,
    completePayment
} from "../services/payment.service";

const VerifyPayment = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedSlip, setSelectedSlip] = useState(null);
    const [verifying, setVerifying] = useState(false);

    const loadPaymentSummary = async () => {
        try {
            setLoading(true);

            const result = await getPaymentSummary(1, 5);

            console.log("Payment summary:", result);

            setBills(result.data || []);
        } catch (error) {
            console.error("Load payment summary error:", error);

            setBills([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPaymentSummary(); }, []);

    const getPendingSlip = (member) => {
        return member.slips?.find(
            (slip) => slip.StatusPay === "PENDING_VERIFY"
        );
    };

    const getMemberStatus = (member) => {
        if (member.statusPay === "PAID") return "paid";


        const pendingSlip = getPendingSlip(member);

        if (pendingSlip) return "pending";

        return "unpaid";
    };

    const handleMemberClick = (bill, member) => {
        const pendingSlip = getPendingSlip(member);

        setSelectedSlip({ bill, member, slip: pendingSlip || null });
    };

    const handleVerify = async () => {
        if (!selectedSlip?.slip?.Id) return;


        try {
            setVerifying(true);

            await verifyPaymentSlip(selectedSlip.slip.Id);

            alert("Payment verified successfully");

            setSelectedSlip(null);

            await loadPaymentSummary();

        } catch (error) {
            console.error("Verify payment error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to verify payment"
            );
        } finally {
            setVerifying(false);
        }
    };

    const handleComplete = async (billId) => {
        try {
            const confirmed = window.confirm(
                "ยืนยันว่าร้านนี้จ่ายเงินครบทุกคนแล้ว?"
            );

            if (!confirmed) return;

            await completePayment(billId);

            alert("Bill completed successfully");

            await loadPaymentSummary();

        } catch (error) {
            console.error(
                "Complete bill error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to complete bill"
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold mb-8">
                    Verify Payments
                </h1>

                {bills.length === 0 && (
                    <div className="text-center py-10 opacity-70">
                        No payment data found
                    </div>
                )}

                <div className="space-y-8">

                    {bills.map((bill) => (

                        <div
                            key={bill.billId}
                            className="border rounded-2xl p-5"
                        >

                            {/* Bill Header */}

                            <div className="mb-5">

                                <h2 className="text-xl font-bold">
                                    {bill.shopName ||
                                        "Unknown Shop"}
                                </h2>

                                <p className="text-sm opacity-70">
                                    Bill ID: {bill.billId}
                                </p>

                                <p className="text-sm">
                                    Total: ฿
                                    {Number(
                                        bill.totalAmount || 0
                                    ).toFixed(2)}
                                </p>

                            </div>


                            {/* Members */}

                            <div className="space-y-3">

                                {bill.members?.map(
                                    (member) => {

                                        const status =
                                            getMemberStatus(
                                                member
                                            );

                                        const pendingSlip =
                                            getPendingSlip(
                                                member
                                            );

                                        let borderClass =
                                            "border-red-500";

                                        if (
                                            status ===
                                            "pending"
                                        ) {
                                            borderClass =
                                                "border-orange-500";
                                        }

                                        if (
                                            status ===
                                            "paid"
                                        ) {
                                            borderClass =
                                                "border-green-500";
                                        }

                                        return (
                                            <button
                                                key={member.id}
                                                onClick={() =>
                                                    handleMemberClick(
                                                        bill,
                                                        member
                                                    )
                                                }
                                                className={`
                                                    w-full
                                                    text-left
                                                    border-2
                                                    ${borderClass}
                                                    rounded-xl
                                                    p-4
                                                    hover:shadow-md
                                                    transition
                                                `}
                                            >

                                                <div className="flex justify-between items-center">

                                                    <div>

                                                        <p className="font-bold text-lg">
                                                            {
                                                                member.displayName
                                                            }
                                                        </p>

                                                        <p className="text-sm">
                                                            Amount to pay:
                                                            <span className="font-bold ml-1">
                                                                ฿
                                                                {Number(
                                                                    member.amountToPay ||
                                                                    0
                                                                ).toFixed(
                                                                    2
                                                                )}
                                                            </span>
                                                        </p>

                                                        <p className="text-sm">
                                                            Amount paid:
                                                            <span className="font-bold ml-1">
                                                                ฿
                                                                {Number(
                                                                    member.amountPaid ||
                                                                    0
                                                                ).toFixed(
                                                                    2
                                                                )}
                                                            </span>
                                                        </p>

                                                    </div>

                                                    <div>

                                                        {status ===
                                                            "unpaid" && (
                                                                <span className="badge badge-error">
                                                                    Unpaid
                                                                </span>
                                                            )}

                                                        {status ===
                                                            "pending" && (
                                                                <span className="badge badge-warning">
                                                                    Waiting Verify
                                                                </span>
                                                            )}

                                                        {status ===
                                                            "paid" && (
                                                                <span className="badge badge-success">
                                                                    Verified
                                                                </span>
                                                            )}

                                                    </div>

                                                </div>

                                                {pendingSlip && (
                                                    <p className="text-xs mt-2 opacity-70">
                                                        Payment slip uploaded
                                                    </p>
                                                )}

                                            </button>
                                        );
                                    }
                                )}
                                <div className="flex justify-center mt-6">
                                    <button
                                        className="btn btn-success"
                                        disabled={
                                            !bill.members?.every(
                                                (member) =>
                                                    member.statusPay === "PAID"
                                            ) ||
                                            bill.statusReceipt === "COMPLETED"
                                        }
                                        onClick={() =>
                                            handleComplete(bill.billId)
                                        }
                                    >
                                        {bill.statusReceipt === "COMPLETED"
                                            ? "Completed"
                                            : "Complete"}
                                    </button>
                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

            {/* Payment Slip Modal */}

            {selectedSlip && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">

                    <div className="bg-base-100 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">

                        <h2 className="text-xl font-bold mb-5">
                            Payment Details
                        </h2>

                        <div className="space-y-2">

                            <p>
                                <span className="font-bold">
                                    Shop:
                                </span>{" "}
                                {selectedSlip.bill.shopName}
                            </p>

                            <p>
                                <span className="font-bold">
                                    Member:
                                </span>{" "}
                                {selectedSlip.member.displayName}
                            </p>

                            <p>
                                <span className="font-bold">
                                    Amount:
                                </span>{" "}
                                ฿
                                {Number(
                                    selectedSlip.member.amountToPay ||
                                    0
                                ).toFixed(2)}
                            </p>

                            <p>
                                <span className="font-bold">
                                    Paid:
                                </span>{" "}
                                ฿
                                {Number(
                                    selectedSlip.member.amountPaid ||
                                    0
                                ).toFixed(2)}
                            </p>

                            <p>
                                <span className="font-bold">
                                    Status:
                                </span>{" "}
                                {selectedSlip.member.statusPay}
                            </p>

                        </div>

                        {/* Slip Image */}

                        {selectedSlip.slip?.ProofImage ? (
                            <div className="mt-5">

                                <p className="font-bold mb-2">
                                    Payment Slip
                                </p>

                                <img
                                    src={`http://localhost:8808${selectedSlip.slip.ProofImage}`}
                                    alt="Payment slip"
                                    className="w-full rounded-xl"
                                />

                            </div>
                        ) : (
                            <div className="mt-5 p-5 bg-base-200 rounded-xl text-center">
                                No payment slip uploaded
                            </div>
                        )}

                        {/* Buttons */}

                        <div className="flex gap-3 mt-6">

                            <button
                                className="btn btn-ghost flex-1"
                                onClick={() =>
                                    setSelectedSlip(null)
                                }
                            >
                                Close
                            </button>

                            {selectedSlip.slip?.StatusPay ===
                                "PENDING_VERIFY" && (
                                    <button
                                        className="btn btn-success flex-1"
                                        disabled={verifying}
                                        onClick={handleVerify}
                                    >
                                        {verifying
                                            ? "Verifying..."
                                            : "Verify"}
                                    </button>
                                )}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default VerifyPayment;

