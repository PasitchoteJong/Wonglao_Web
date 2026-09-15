import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getFoodSelectionStatus,
    calculateProportionalSplit
} from "../services/foodSplitting.service";

const FoodSplittingWaiting = () => {
    const { billId } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] =
        useState(null);

    useEffect(() => {
        let interval;

        const fetchStatus = async () => {
            try {
                const result = await getFoodSelectionStatus(billId);

                const data = result.data;

                setStatus(data);

                if (data.completed) {
                    clearInterval(interval);

                    await calculateProportionalSplit(billId);

                    navigate(`/payment/${billId}`);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchStatus();

        interval = setInterval(fetchStatus, 3000);

        return () => clearInterval(interval);
    }, [billId, navigate]);

    if (!status) {
        return (
            <div className="flex justify-center p-10">
                Loading...
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">

            <div className="text-center">

                <h1 className="text-2xl font-bold">
                    Food Selection
                </h1>

                <p className="mt-2 text-gray-500">
                    Waiting for everyone
                    to select their food
                </p>

                <div className="mt-8">

                    <p className="text-4xl font-bold">
                        {status.submittedMembers}
                        {" / "}
                        {status.totalMembers}
                    </p>

                    <p className="mt-2">
                        members submitted
                    </p>

                </div>

                <progress
                    className="progress progress-primary w-full mt-6"
                    value={status.progress}
                    max="100"
                />

                <p className="mt-2 font-semibold">
                    {status.progress}%
                </p>

            </div>

            <div className="mt-8 space-y-3">

                {status.members.map(
                    (member) => (
                        <div
                            key={member.id}
                            className="flex justify-between items-center border rounded-lg p-4"
                        >
                            <span>
                                {member.displayName}
                            </span>

                            {member.submitted ? (
                                <span className="text-success">
                                    ✓ Submitted
                                </span>
                            ) : (
                                <span className="text-warning">
                                    Waiting...
                                </span>
                            )}
                        </div>
                    )
                )}

            </div>

        </div>
    );
};

export default FoodSplittingWaiting;