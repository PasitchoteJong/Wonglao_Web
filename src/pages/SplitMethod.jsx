import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectSplitMethod } from "../services/split.service";

export default function SplitMethod() {
    const { billId } = useParams();
    const navigate = useNavigate();

    const [submitting, setSubmitting] = useState(false);

    const methods = [
        {
            id: "EQUAL",
            title: "Equal Split",
            description: "หารเท่ากัน จบ ๆ ไม่มีใครหนี",
            path: `/equal-split/${billId}`
        },
        {
            id: "PROPORTIONAL",
            title: "Food Splitting",
            description: "กินอะไร จ่ายอันนั้น กินเยอะก็อย่าทำเป็นลืม",
            path: `/food-splitting/${billId}`
        },
        {
            id: "ROULETTE",
            title: "Roulette",
            description: "วงล้อเลือกสุ่มผู้โชคดี",
            path: `/roulette/${billId}`
        }
    ];

    const handleSelect = async (method) => {
        try {
            setSubmitting(true);

            await selectSplitMethod(
                billId,
                method.id
            );

            navigate(method.path);

        } catch (error) {
            console.error(
                "Failed to select split method:",
                error
            );

            alert("Failed to select split method");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen p-8">

            <h1 className="text-3xl font-bold text-center mb-8">
                Select Split Method
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                {methods.map((method) => (
                    <button
                        key={method.id}
                        disabled={submitting}
                        onClick={() => handleSelect(method)}
                        className="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-left"
                    >
                        <div className="card-body">

                            <h2 className="card-title">
                                {method.title}
                            </h2>

                            <p>
                                {method.description}
                            </p>

                            <div className="card-actions justify-end mt-4">
                                <span className="btn btn-primary">
                                    Select
                                </span>
                            </div>

                        </div>
                    </button>
                ))}

            </div>

        </div>
    );
}