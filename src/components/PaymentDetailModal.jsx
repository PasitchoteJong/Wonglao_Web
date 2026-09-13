const PaymentDetailModal = ({
    member,
    loading,
    onClose,
    onRefresh
}) => {

    if (loading) {
        return (
            <div className="modal modal-open">
                <div className="modal-box">
                    Loading payment details...
                </div>
            </div>
        );
    }

    const isShort =
        member.RemainingAmount > 0 &&
        !member.PaymentAccepted;

    return (
        <div className="modal modal-open">

            <div className="modal-box max-w-2xl">

                <h3 className="font-bold text-2xl">
                    {member.DisplayName}
                </h3>

                <div className="grid grid-cols-3 gap-3 mt-6">

                    <div className="bg-base-200 rounded-lg p-3">
                        <p className="text-sm opacity-60">
                            To Pay
                        </p>

                        <p className="font-bold">
                            ฿{member.AmountToPay.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-base-200 rounded-lg p-3">
                        <p className="text-sm opacity-60">
                            Paid
                        </p>

                        <p className="font-bold">
                            ฿{member.AmountPaid.toFixed(2)}
                        </p>
                    </div>

                    <div
                        className={`
                            rounded-lg p-3
                            ${
                                member.RemainingAmount > 0
                                    ? "bg-error/10"
                                    : "bg-success/10"
                            }
                        `}
                    >
                        <p className="text-sm opacity-60">
                            Remaining
                        </p>

                        <p className="font-bold">
                            ฿
                            {member.RemainingAmount.toFixed(2)}
                        </p>
                    </div>

                </div>

                <div className="divider">
                    Payment Slips
                </div>

                {member.PaymentSlips.length === 0 ? (
                    <p className="text-center opacity-60">
                        No payment slip
                    </p>
                ) : (
                    <div className="space-y-4">

                        {member.PaymentSlips.map((slip) => (
                            <div
                                key={slip.Id}
                                className="border rounded-xl p-4"
                            >

                                <div className="flex justify-between">

                                    <div>
                                        <p className="font-bold">
                                            ฿
                                            {slip.Amount.toFixed(2)}
                                        </p>

                                        <p className="text-sm opacity-60">
                                            {new Date(
                                                slip.CreatedAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="badge">
                                        {slip.StatusPay}
                                    </div>

                                </div>

                                <img
                                    src={`http://localhost:8808${slip.ProofImage}`}
                                    alt="Payment slip"
                                    className="w-full max-h-[500px] object-contain rounded-lg mt-4"
                                />

                            </div>
                        ))}

                    </div>
                )}

                {isShort && (
                    <div className="mt-6">

                        <div className="alert alert-error">
                            <span>
                                This member still owes ฿
                                {member.RemainingAmount.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex gap-3 mt-4">

                            <button
                                className="btn btn-warning flex-1"
                            >
                                Ask to Pay More
                            </button>

                            <button
                                className="btn btn-success flex-1"
                            >
                                OK
                            </button>

                        </div>

                    </div>
                )}

                <div className="modal-action">

                    <button
                        className="btn"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>

            </div>

            <div
                className="modal-backdrop"
                onClick={onClose}
            />
        </div>
    );
};

export default PaymentDetailModal;