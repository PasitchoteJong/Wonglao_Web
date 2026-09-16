import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getRoulette,
  updateRouletteEligibility,
  spinRoulette,
} from "../services/roulette.service";

import RouletteParticipants from "../components/roulette/RoulettePartcipants";
import RouletteWheel from "../components/roulette/RouletteWheel";
import RouletteWinnerModal from "../components/roulette/RouletteWinnerModal";
import RoulettePaymentModal from "../components/roulette/RoulettePaymentModal";

const Roulette = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [roulette, setRoulette] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadRoulette();
  }, [billId]);

  const loadRoulette = async () => {
    try {
      const response = await getRoulette(billId);

      setRoulette(response.data);
      setIsOwner(response.isOwner);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEligibilityChange = async (billMemberId, eligible) => {
    try {
      await updateRouletteEligibility(billId, billMemberId, eligible);

      await loadRoulette();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSpin = async () => {
    if (!isOwner || isSpinning) {
      return;
    }

    try {
      setIsSpinning(true);

      const response = await spinRoulette(billId);

      setWinner(response.data.winner);
    } catch (error) {
      console.error(error);

      setIsSpinning(false);
    }
  };

  const handleWheelFinish = () => {
    setIsSpinning(false);
    setShowWinnerModal(true);
  };

  const handleWinnerContinue = () => {
    setShowWinnerModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentContinue = () => {
    navigate(`/payment/${billId}`);
  };

  if (!roulette) {
    return <div className="flex justify-center p-10">Loading...</div>;
  }

  // const members = roulette.Billmember ?? [];

  // const eligibleMembers = members.filter((member) => member.RouletteEligible);
  const members = Array.isArray(roulette.Billmember) ? roulette.Billmember : [];

  const eligibleMembers = members.filter(
    (member) => member.RouletteEligible === true,
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">🍻 Roulette</h1>

        <p className="text-base-content/60">เลือกผู้โชคดีที่จะรับผิดชอบบิล</p>
      </div>

      <div className="card bg-base-200 shadow">
        <div className="card-body items-center text-center">
          <p>Total Bill</p>

          <p className="text-3xl font-bold">
            ฿{Number(roulette.TotalAmount || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <RouletteParticipants
        members={members}
        isOwner={isOwner}
        onEligibilityChange={handleEligibilityChange}
      />

      {eligibleMembers.length >= 2 && (
        <RouletteWheel
          participants={eligibleMembers}
          winner={winner}
          isSpinning={isSpinning}
          onFinish={handleWheelFinish}
        />
      )}

      {isOwner && (
        <div className="flex justify-center">
          <button
            className="btn btn-primary btn-lg"
            disabled={isSpinning || eligibleMembers.length < 2}
            onClick={handleSpin}
          >
            {isSpinning ? "Spinning..." : "SPIN"}
          </button>
        </div>
      )}

      <RouletteWinnerModal
        open={showWinnerModal}
        winner={winner}
        onContinue={handleWinnerContinue}
      />

      <RoulettePaymentModal
        open={showPaymentModal}
        winner={winner}
        totalAmount={roulette.TotalAmount}
        onContinue={handlePaymentContinue}
      />
    </div>
  );
};

export default Roulette;
