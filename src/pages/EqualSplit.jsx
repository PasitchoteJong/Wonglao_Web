import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { calculateEqualSplit } from "../services/split.service";
import { useAuthStore } from "../stores/authStore";

const EqualSplit = () => {
    const { billId } = useParams();
    const navigate = useNavigate();

    const { user } = useAuthStore();

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const calculate = async () => {
            try {
                const result = await calculateEqualSplit(billId);

                setMembers(result.data);
            } catch (error) {
                console.error("Calculate equal split error:", error);
            } finally {
                setLoading(false);
            }
        };

        calculate();
    }, [billId]);

    const currentUserId = user.id;

    const displayedMembers = members.filter(
        (member) => member.UserId === currentUserId
    );


    const handleNext = () => {
        navigate(`/payment/${billId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">

            <div className="max-w-2xl mx-auto">

                <h1 className="text-3xl font-bold mb-2">
                    Equal Split
                </h1>

                <p className="text-base-content/60 mb-6">
                    Everyone pays an equal amount
                </p>

                <div className="space-y-3">

                    {displayedMembers.map((member) => (
                        <div
                            key={member.Id}
                            className="flex justify-between items-center p-4 bg-base-200 rounded-xl"
                        >
                            <div>
                                <p className="font-semibold">
                                    {member.DisplayName}
                                </p>

                                <p className="text-sm text-base-content/60">
                                    {member.StatusPay}
                                </p>
                            </div>

                            <span className="font-bold text-lg">
                                ฿
                                {Number(
                                    member.AmountToPay
                                ).toFixed(2)}
                            </span>
                        </div>
                    ))}

                </div>

                <button
                    onClick={handleNext}
                    className="btn btn-primary w-full mt-6"
                >
                    Go to Payment
                </button>

            </div>

        </div>
    );
};

export default EqualSplit;