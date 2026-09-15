const RouletteWinnerModal = ({
    open,
    winner,
    onContinue
}) => {

    if (!open || !winner) {
        return null;
    }

    return (
        <dialog
            className="modal modal-open"
        >

            <div className="
                modal-box
                text-center
            ">

                <div className="text-6xl mb-4">
                    🎉
                </div>

                <h2 className="
                    text-3xl
                    font-bold
                    mb-3
                ">
                    ยินดีด้วย!
                </h2>

                <div className="
                    text-2xl
                    font-bold
                    text-primary
                    mb-3
                ">
                    {winner.DisplayName}
                </div>

                <p className="mb-6">
                    คุณได้รับ Roulette
                </p>

                {/* 
                    จุดนี้ภายหลังใส่
                    Fireworks Animation
                */}

                <button
                    className="btn btn-primary"
                    onClick={onContinue}
                >
                    ดูผลการชำระเงิน
                </button>

            </div>

        </dialog>
    );
};

export default RouletteWinnerModal;