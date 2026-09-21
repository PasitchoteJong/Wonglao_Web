import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getJoinBill, joinBillMember } from "../services/joinBill.service";

export default function JoinBillMember() {
    const { billId } = useParams();
    const navigate = useNavigate();

    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(true);

    
    useEffect(() => {
        const joinBillAutomatically = async () => {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 

                const resp = await joinBillMember(billId);

            } catch (error) {
                console.error("Auto join error (might already joined):", error);
            } finally {
                setJoining(false);
            }
        };

        if (billId) {
            joinBillAutomatically();
        }
    }, [billId]);

    useEffect(() => {
        if (!billId || joining) return;

        const fetchBillStatus = async () => {
            try {
                const response = await getJoinBill(billId);
                const billData = response.data;
                setBill(billData);

                if (billData.splitMethod === "EQUAL") {
                    navigate(`/equal-split/${billId}`, { replace: true });
                } else if (billData.splitMethod === "PROPORTIONAL") {
                    navigate(`/food-splitting/${billId}`, { replace: true });
                } else if (billData.splitMethod === "ROULETTE") {
                    navigate(`/roulette/${billId}`, { replace: true });
                }
            } catch (error) {
                console.error("Failed to fetch bill status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBillStatus();
        const interval = setInterval(fetchBillStatus, 3000); 

        return () => clearInterval(interval);
    }, [billId, joining, navigate]);

    if (loading || joining) {
        return (
            <div className="min-h-screen bg-[#000000] text-[#F8B500] flex items-center justify-center font-sans">
                <p className="text-lg font-medium">Joining bill... ⏳</p>
            </div>
        );
    }

    if (!bill) {
        return (
            <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center font-sans">
                <p className="text-lg">Bill not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000] flex flex-col items-center p-4 pt-10 font-sans text-white">
            <div className="w-full max-w-md">

                {/* Main Card */}
                <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-xl p-6">

                    <h1 className="text-2xl font-bold text-white text-center">
                        Joined Bill Successfully! 🎉
                    </h1>

                    <p className="text-sm text-[#A0A0A0] text-center mt-2">
                        {bill.ShopName || "Restaurant Bill"}
                    </p>

                    {/* Member Count */}
                    <div className="text-center my-8">
                        <p className="text-sm text-[#A0A0A0]">
                            Members joined
                        </p>
                        <p className="text-4xl font-bold text-[#F8B500] mt-1">
                            {bill._count?.Billmember || 0}
                        </p>
                    </div>

                    {/* Member List */}
                    <div className="mb-6">
                        <p className="font-semibold text-white mb-3">
                            Members in this bill
                        </p>

                        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                            {bill.Billmember?.map((member) => (
                                <div
                                    key={member.Id}
                                    className="bg-[#2C2C2E] border-none rounded-xl px-4 py-3 flex justify-between items-center"
                                >
                                    <span className="font-medium text-white">
                                        {member.DisplayName}
                                    </span>
                                    <span className="text-xs text-[#06C755] font-medium">
                                        Joined
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Waiting Message (แทนปุ่ม Next/Back ที่กดไม่ได้) */}
                    <div className="bg-[#2C2C2E] rounded-2xl p-4 text-center">
                        <p className="text-sm text-[#F8B500] font-medium animate-pulse">
                            ⏳ Waiting for the host to start splitting...
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}