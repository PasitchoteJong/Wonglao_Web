import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { calculateEqualSplit } from "../services/split.service";


const EqualSplit = () => {
    const { billId } = useParams();
    const navigate = useNavigate();

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

        }
        calculate();
    }, [billId]);

    const handleNext = () => { navigate(`/payment/${billId}`) };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Calculating...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-2xl mx-auto">

                <h1 className="text-2xl font-bold mb-6">
                    Split Equally
                </h1>

                <div className="space-y-3">
                    {members.map((member) => (
                        <div
                            key={member.Id}
                            className="flex justify-between items-center p-4 bg-base-200 rounded-lg"
                        >
                            <span>
                                {member.DisplayName}
                            </span>

                            <span className="font-bold">
                                ฿{Number(member.AmountToPay).toFixed(2)}
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




}

export default EqualSplit;