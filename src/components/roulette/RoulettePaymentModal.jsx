const RoulettePaymentModal = ({ open, winner, totalAmount, onContinue }) => {
  if (!open || !winner) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h2
          className="
                    text-2xl
                    font-bold
                    text-center
                    mb-6
                "
        >
          Roulette Result
        </h2>

        <div
          className="
                    text-center
                    space-y-3
                "
        >
          <p>ยอดรวมของบิล</p>

          <p
            className="
                        text-3xl
                        font-bold
                    "
          >
            ฿{Number(totalAmount || 0).toLocaleString()}
          </p>

          <p>ผู้รับผิดชอบการจ่าย</p>

          <p
            className="
                        text-xl
                        font-bold
                        text-primary
                    "
          >
            {winner.DisplayName}
          </p>
        </div>

        <div
          className="
                    modal-action
                    justify-center
                "
        >
          <button className="btn btn-primary" onClick={onContinue}>
            ไป Payment
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default RoulettePaymentModal;
