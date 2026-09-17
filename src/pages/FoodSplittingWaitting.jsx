import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getFoodSelectionStatus,
  calculateProportionalSplit,
} from "../services/foodSplitting.service";
import Loading from "../components/Loading.jsx";

const FoodSplittingWaiting = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;

    const fetchStatus = async () => {
      try {
        setLoading(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    interval = setInterval(fetchStatus, 3000);

    return () => clearInterval(interval);
  }, [billId, navigate]);

  if (!status) {
    return <div className="flex justify-center p-10">Loading...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-[#000000] font-sans text-white">
        <div className="max-w-2xl mx-auto p-6 pt-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Food Selection</h1>

            <p className="mt-2 text-[#A0A0A0]">
              Waiting for everyone to select their food
            </p>

            <div className="mt-8">
              <p className="text-4xl font-bold text-[#F8B500]">
                {status.submittedMembers}

                {" / "}

                {status.totalMembers}
              </p>

              <p className="mt-2 text-[#A0A0A0]">members submitted</p>
            </div>

            <progress
              className="progress w-full mt-6 bg-[#2C2C2E] [&::-webkit-progress-value]:bg-[#F8B500] [&::-moz-progress-bar]:bg-[#F8B500]"
              value={status.progress}
              max="100"
            />

            <p className="mt-2 font-semibold text-[#F8B500]">
              {status.progress}%
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {status.members.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center bg-[#1C1C1E] border-none rounded-xl p-4"
              >
                <span className="font-semibold text-white">
                  {member.displayName}
                </span>

                {member.submitted ? (
                  <span className="font-medium text-[#06C755]">
                    ✓ Submitted
                  </span>
                ) : (
                  <span className="font-medium text-[#A0A0A0]">Waiting...</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );

  //   return (
  //     <div className="max-w-2xl mx-auto p-6">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold">Food Selection</h1>

  //         <p className="mt-2 text-gray-500">
  //           Waiting for everyone to select their food
  //         </p>

  //         <div className="mt-8">
  //           <p className="text-4xl font-bold">
  //             {status.submittedMembers}
  //             {" / "}
  //             {status.totalMembers}
  //           </p>

  //           <p className="mt-2">members submitted</p>
  //         </div>

  //         <progress
  //           className="progress progress-primary w-full mt-6"
  //           value={status.progress}
  //           max="100"
  //         />

  //         <p className="mt-2 font-semibold">{status.progress}%</p>
  //       </div>

  //       <div className="mt-8 space-y-3">
  //         {status.members.map((member) => (
  //           <div
  //             key={member.id}
  //             className="flex justify-between items-center border rounded-lg p-4"
  //           >
  //             <span>{member.displayName}</span>

  //             {member.submitted ? (
  //               <span className="text-success">✓ Submitted</span>
  //             ) : (
  //               <span className="text-warning">Waiting...</span>
  //             )}
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
};

export default FoodSplittingWaiting;
