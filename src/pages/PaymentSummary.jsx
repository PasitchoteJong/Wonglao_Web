import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getPaymentMemberDetail,
    getPaymentSummary_be
} from "../services/payment.service";

const PaymentSummary = () => {
    const { billId } = useParams();

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedMember, setSelectedMember] =
        useState(null);

    const [detailLoading, setDetailLoading] =
        useState(false);

    useEffect(() => {
        loadSummary();
    }, [billId]);

    const loadSummary = async () => {
        try {
            setLoading(true);

            const result =
                await getPaymentSummary_be(billId);

            setSummary(result.data);
        } catch (error) {
            console.error(
                "Load payment summary error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOpenMember = async (member) => {
        try {
            setDetailLoading(true);

            const result =
                await getPaymentMemberDetail(
                    billId,
                    member.Id
                );

            setSelectedMember(result.data);
        } catch (error) {
            console.error(
                "Load payment detail error:",
                error
            );
        } finally {
            setDetailLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Loading payment summary...
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="p-6">
                Payment summary not found
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-3xl mx-auto">

                <h1 className="text-3xl font-bold">
                    Payment Summary
                </h1>

                <p className="opacity-70 mt-1">
                    {summary.ShopName}
                </p>

                <div className="mt-6 space-y-4">

                    {summary.Members.map((member) => {

                        const isComplete =
                            member.PaymentAccepted;

                        const isShort =
                            member.RemainingAmount > 0 &&
                            !member.PaymentAccepted;

                        return (
                            <button
                                key={member.Id}
                                onClick={() =>
                                    handleOpenMember(member)
                                }
                                className={`
                                    w-full text-left
                                    card bg-base-100
                                    shadow-md
                                    border-2
                                    transition
                                    hover:shadow-lg
                                    ${
                                        isShort
                                            ? "border-error"
                                            : "border-base-300"
                                    }
                                `}
                            >
                                <div className="card-body">

                                    <div className="flex justify-between items-start">

                                        <div>
                                            <h2 className="card-title">
                                                {member.DisplayName}
                                            </h2>

                                            <p className="text-sm opacity-60">
                                                {member.StatusPay}
                                            </p>
                                        </div>

                                        {isComplete ? (
                                            <div className="badge badge-success">
                                                Paid
                                            </div>
                                        ) : isShort ? (
                                            <div className="badge badge-error">
                                                Short
                                            </div>
                                        ) : (
                                            <div className="badge badge-warning">
                                                Pending
                                            </div>
                                        )}

                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4">

                                        <div>
                                            <p className="text-sm opacity-60">
                                                Amount to pay
                                            </p>

                                            <p className="font-bold">
                                                ฿
                                                {member.AmountToPay.toFixed(2)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm opacity-60">
                                                Amount paid
                                            </p>

                                            <p className="font-bold">
                                                ฿
                                                {member.AmountPaid.toFixed(2)}
                                            </p>
                                        </div>

                                    </div>

                                    {member.RemainingAmount > 0 && (
                                        <div className="text-error font-semibold mt-2">
                                            Short by ฿
                                            {member.RemainingAmount.toFixed(2)}
                                        </div>
                                    )}

                                    {member.LastPaymentAt && (
                                        <p className="text-sm opacity-50 mt-2">
                                            Last payment:{" "}
                                            {new Date(
                                                member.LastPaymentAt
                                            ).toLocaleString()}
                                        </p>
                                    )}

                                </div>
                            </button>
                        );
                    })}

                </div>
            </div>

            {selectedMember && (
                <PaymentDetailModal
                    member={selectedMember}
                    loading={detailLoading}
                    onClose={() =>
                        setSelectedMember(null)
                    }
                    onRefresh={loadSummary}
                />
            )}

        </div>
    );
};

export default PaymentSummary;