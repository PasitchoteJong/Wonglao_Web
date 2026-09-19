import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPaymentSummary,
  getPaymentMemberDetail,
  verifyPaymentSlip,
  completePayment,
} from "../services/payment.service";
import Loading from "../components/Loading.jsx";
import { toast } from "../components/toast/toast";

import PaymentSummaryIcon from "../components/icons/PaymentSummaryIcon.jsx";

export default function PaymentSummary() {
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [completingBillId, setCompletingBillId] = useState(null);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [selectedMember, setSelectedMember] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // =========================
  // LOAD BILL LIST
  // =========================
  const loadBills = async () => {
    try {
      setLoading(true);

      const result = await getPaymentSummary(page, 5);

      setBills(result.data || []);

      setPagination(
        result.pagination || {
          page: 1,
          totalPages: 1,
          total: 0,
        },
      );
    } catch (error) {
      console.error("Load payment summary error:", error);

      toast.error(
        error.response?.data?.message || "ไม่สามารถโหลด Payment Summary ได้",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, [page]);

  // =========================
  // COMPLETE BILL
  // =========================
  const handleCompleteBill = async (e, billId) => {
    // ป้องกัน click แล้วเข้า detail
    e.stopPropagation();

    try {
      setCompletingBillId(billId);

      await completePayment(billId);

      toast.success("Bill completed successfully");

      // โหลดรายการใหม่
      await loadBills();
    } catch (error) {
      console.error("Complete bill error:", error);

      toast.error(error.response?.data?.message || "Unable to complete bill");
    } finally {
      setCompletingBillId(null);
    }
  };

  const handleOpenMember = async (billId, billMemberId) => {
    try {
      setDetailLoading(true);

      const result = await getPaymentMemberDetail(billId, billMemberId);

      setSelectedMember({
        billId,
        ...result.data,
      });
    } catch (error) {
      console.error("Load member detail error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load payment detail",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const handleConfirmSlip = async () => {
    if (!selectedMember) return;

    const pendingSlip = selectedMember.PaymentSlips?.find(
      (slip) => slip.StatusPay === "PENDING_VERIFY",
    );

    if (!pendingSlip) {
      toast.warning("No payment slip waiting for verification");
      return;
    }

    try {
      setVerifying(true);

      await verifyPaymentSlip(pendingSlip.Id);

      toast.success("Payment verified successfully");

      // Refresh bill list
      await loadBills();

      // Refresh modal
      const result = await getPaymentMemberDetail(
        selectedMember.billId,
        selectedMember.Id,
      );

      setSelectedMember({
        billId: selectedMember.billId,
        ...result.data,
      });
    } catch (error) {
      console.error("Verify payment error:", error);

      toast.error(error.response?.data?.message || "Unable to verify payment");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return <Loading message="Loading payments..." />;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans px-5 py-8">
      <div className="max-w-xl mx-auto">
        {/* =========================
            HEADER
        ========================== */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              w-11
              h-11

              rounded-xl

              bg-[#1C1C1E]

              border
              border-[#2C2C2E]

              flex
              items-center
              justify-center

              text-[#A0A0A0]
              text-xl

              hover:text-[#F8B500]
              hover:border-[#F8B500]

              transition-all
              active:scale-95
            "
          >
            ←
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <PaymentSummaryIcon className="w-7 h-7 text-[#F8B500]" />

              <h1 className="text-2xl font-bold">Payment Summary</h1>
            </div>

            <p className="text-[#A0A0A0] text-sm mt-1">
              Track all your bills and payments
            </p>
          </div>
        </div>

        {/* =========================
            TOTAL BILL COUNT
        ========================== */}
        <div
          className="
            bg-[#1C1C1E]
            border
            border-[#2C2C2E]

            rounded-2xl

            px-5
            py-4

            mb-6

            flex
            items-center
            justify-between
          "
        >
          <div>
            <p className="text-sm text-[#A0A0A0]">Total Bills</p>

            <p className="text-2xl font-bold mt-1">{pagination.total || 0}</p>
          </div>

          <PaymentSummaryIcon className="w-10 h-10 text-[#F8B500]" />
        </div>

        {/* =========================
            EMPTY STATE
        ========================== */}
        {bills.length === 0 && (
          <div
            className="
              bg-[#1C1C1E]
              border
              border-[#2C2C2E]

              rounded-3xl

              px-8
              py-12

              text-center
            "
          >
            <PaymentSummaryIcon className="w-14 h-14 mx-auto text-[#F8B500]" />

            <h2 className="font-bold text-lg mt-5">No bills yet</h2>

            <p className="text-[#A0A0A0] text-sm mt-2">
              Create a bill and your payment summary will appear here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/create-bill")}
              className="
                btn
                mt-6

                border-none
                rounded-xl

                bg-[#F8B500]
                hover:bg-[#E0A300]

                text-[#121212]
                font-bold
              "
            >
              Create Bill
            </button>
          </div>
        )}

        {/* =========================
            BILL LIST
        ========================== */}
        <div className="space-y-4">
          {bills.map((bill) => {
            const members = bill.members || [];

            const totalMembers = members.length;

            const paidMembers = members.filter(
              (member) => member.statusPay === "PAID",
            );

            const pendingMembers = members.filter(
              (member) => member.statusPay === "PENDING_VERIFY",
            );

            const unpaidMembers = members.filter(
              (member) => member.statusPay === "UNPAID",
            );

            const paidCount = paidMembers.length;

            const allPaid = totalMembers > 0 && paidCount === totalMembers;

            const completed = bill.statusReceipt === "COMPLETED";

            const amountPaid = members.reduce(
              (sum, member) => sum + Number(member.amountPaid || 0),
              0,
            );

            const progress =
              totalMembers > 0 ? (paidCount / totalMembers) * 100 : 0;

            return (
              <div
                key={bill.billId}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/payment-summary/${bill.billId}`)}
                className="
                  w-full
                  text-left

                  bg-[#1C1C1E]

                  border
                  border-[#2C2C2E]

                  rounded-3xl

                  p-5

                  cursor-pointer

                  transition-all
                  duration-200

                  hover:border-[#F8B500]
                  hover:-translate-y-1

                  hover:shadow-[0_8px_30px_rgb(248,181,0,0.10)]

                  active:scale-[0.99]
                "
              >
                {/* TOP */}
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h2
                      className="
                        text-lg
                        font-bold
                        text-white

                        truncate
                      "
                    >
                      {bill.shopName || "Unnamed Bill"}
                    </h2>

                    <p className="text-xs text-[#A0A0A0] mt-1">
                      {bill.createdAt
                        ? new Date(bill.createdAt).toLocaleDateString("th-TH")
                        : "-"}
                    </p>
                  </div>

                  <BillStatus
                    completed={completed}
                    allPaid={allPaid}
                    pendingCount={pendingMembers.length}
                  />
                </div>

                {/* =========================
                    TOTAL
                ========================== */}
                <div className="mt-6">
                  <p className="text-xs text-[#A0A0A0]">Total Amount</p>

                  <p className="text-3xl font-bold text-[#F8B500] mt-1">
                    ฿{Number(bill.totalAmount || 0).toFixed(2)}
                  </p>
                </div>

                {/* =========================
                    PAYMENT INFO
                ========================== */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div
                    className="
                      bg-[#2C2C2E]
                      rounded-2xl
                      px-4
                      py-3
                    "
                  >
                    <p className="text-xs text-[#A0A0A0]">Paid Members</p>

                    <p className="font-bold mt-1">
                      {paidCount}
                      <span className="text-[#A0A0A0]"> / {totalMembers}</span>
                    </p>
                  </div>

                  <div
                    className="
                      bg-[#2C2C2E]
                      rounded-2xl
                      px-4
                      py-3
                    "
                  >
                    <p className="text-xs text-[#A0A0A0]">Received</p>

                    <p className="font-bold text-[#F8B500] mt-1">
                      ฿{amountPaid.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* =========================
                    STATUS COUNTS
                ========================== */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {unpaidMembers.length > 0 && (
                    <span
                      className="
                        px-3
                        py-1

                        rounded-full

                        bg-red-500/10
                        text-red-400

                        text-xs
                      "
                    >
                      {unpaidMembers.length} Unpaid
                    </span>
                  )}

                  {pendingMembers.length > 0 && (
                    <span
                      className="
                        px-3
                        py-1

                        rounded-full

                        bg-yellow-500/10
                        text-yellow-400

                        text-xs
                      "
                    >
                      {pendingMembers.length} Pending
                    </span>
                  )}

                  {paidMembers.length > 0 && (
                    <span
                      className="
                        px-3
                        py-1

                        rounded-full

                        bg-green-500/10
                        text-green-400

                        text-xs
                      "
                    >
                      {paidMembers.length} Paid
                    </span>
                  )}
                </div>
                {/* =========================
                      MEMBERS
                  ========================== */}

                <div className="mt-5">
                  <p className="text-xs text-[#A0A0A0] mb-3">Members</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {members.map((member) => {
                      const isPaid =
                        member.statusPay === "PAID" || member.paymentAccepted;

                      const hasPendingSlip =
                        member.statusPay === "PENDING_VERIFY" ||
                        member.slips?.some(
                          (slip) => slip.StatusPay === "PENDING_VERIFY",
                        );

                      let cardStyle = "";
                      let statusText = "";

                      if (isPaid) {
                        cardStyle =
                          "border-green-500/60 bg-green-500/10 hover:border-green-400";

                        statusText = "Verified";
                      } else if (hasPendingSlip) {
                        cardStyle =
                          "border-orange-500/60 bg-orange-500/10 hover:border-orange-400";

                        statusText = "Waiting Verify";
                      } else {
                        cardStyle =
                          "border-red-500/60 bg-red-500/10 hover:border-red-400";

                        statusText = "No Slip";
                      }

                      return (
                        <button
                          key={member.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            handleOpenMember(bill.billId, member.id);
                          }}
                          className={`
            text-left

            border
            rounded-2xl

            p-4

            transition-all
            duration-200

            hover:scale-[1.03]
            hover:shadow-lg

            active:scale-[0.98]

            ${cardStyle}
          `}
                        >
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate">
                                {member.displayName}
                              </p>

                              <p className="text-xs text-[#A0A0A0] mt-1">
                                {statusText}
                              </p>
                            </div>

                            <StatusDot paid={isPaid} pending={hasPendingSlip} />
                          </div>

                          <div className="mt-4">
                            <p className="text-xs text-[#A0A0A0]">Amount</p>

                            <p className="text-xl font-bold text-white mt-1">
                              ฿{Number(member.amountToPay || 0).toFixed(2)}
                            </p>
                          </div>

                          <div className="mt-3">
                            <span
                              className={`
                text-xs
                font-semibold

                ${
                  isPaid
                    ? "text-green-400"
                    : hasPendingSlip
                      ? "text-orange-400"
                      : "text-red-400"
                }
              `}
                            >
                              {member.statusPay}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* =========================
                    PROGRESS
                ========================== */}
                {totalMembers > 0 && (
                  <div className="mt-5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-[#A0A0A0]">Payment progress</span>

                      <span className="text-white">
                        {Math.round(progress)}%
                      </span>
                    </div>

                    <div
                      className="
                        h-2
                        bg-[#2C2C2E]
                        rounded-full
                        overflow-hidden
                      "
                    >
                      <div
                        className="
                          h-full
                          bg-[#F8B500]
                          rounded-full

                          transition-all
                          duration-500
                        "
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* =========================
                    COMPLETE BILL
                ========================== */}
                {allPaid && !completed && (
                  <button
                    type="button"
                    onClick={(e) => handleCompleteBill(e, bill.billId)}
                    disabled={completingBillId === bill.billId}
                    className="
                      btn
                      w-full
                      mt-5

                      border-none

                      bg-[#F8B500]
                      hover:bg-[#E0A300]

                      text-[#121212]
                      font-bold

                      rounded-xl
                    "
                  >
                    {completingBillId === bill.billId
                      ? "Completing..."
                      : "Complete Bill"}
                  </button>
                )}

                {/* COMPLETED */}
                {completed && (
                  <div
                    className="
                      mt-5

                      bg-green-500/10
                      text-green-400

                      rounded-xl

                      text-center
                      text-sm
                      font-semibold

                      py-3
                    "
                  >
                    ✓ Bill Completed
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* =========================
            PAGINATION
        ========================== */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="
                btn

                bg-[#1C1C1E]
                hover:bg-[#2C2C2E]

                border
                border-[#2C2C2E]

                text-white

                rounded-xl

                disabled:opacity-30
              "
            >
              Previous
            </button>

            <span className="text-sm text-[#A0A0A0]">
              {page} / {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="
                btn

                border-none

                bg-[#F8B500]
                hover:bg-[#E0A300]

                text-[#121212]

                rounded-xl

                disabled:opacity-30
              "
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedMember && (
        <MemberPaymentModal
          member={selectedMember}
          loading={detailLoading}
          verifying={verifying}
          onClose={() => setSelectedMember(null)}
          onConfirm={handleConfirmSlip}
        />
      )}
    </div>
  );
}

function StatusDot({ paid, pending }) {
  let color = "bg-red-500";

  if (paid) {
    color = "bg-green-500";
  } else if (pending) {
    color = "bg-orange-500";
  }

  return (
    <span
      className={`
        w-3
        h-3
        rounded-full
        ${color}
        shadow-lg
      `}
    />
  );
}

function MemberPaymentModal({
  member,
  loading,
  verifying,
  onClose,
  onConfirm,
}) {
  if (!member) return null;

  const latestSlip = member.PaymentSlips?.[0];

  const pendingSlip = member.PaymentSlips?.find(
    (slip) => slip.StatusPay === "PENDING_VERIFY",
  );

  const isPaid = member.StatusPay === "PAID" || member.PaymentAccepted;

  const hasPendingSlip = Boolean(pendingSlip);

  const getSlipImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    const apiUrl = import.meta.env.VITE_API_URL;

    return `${apiUrl}${image}`;
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]

        bg-black/70
        backdrop-blur-sm

        flex
        items-center
        justify-center

        p-4
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          max-w-md

          max-h-[90vh]
          overflow-y-auto

          bg-[#1C1C1E]

          border
          border-[#2C2C2E]

          rounded-3xl

          shadow-2xl

          p-6
        "
      >
        {/* HEADER */}

        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {member.DisplayName}
            </h2>

            <p className="text-[#A0A0A0] text-sm mt-1">Payment Detail</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              w-9
              h-9

              rounded-xl

              bg-[#2C2C2E]

              text-[#A0A0A0]

              hover:text-white
              hover:scale-105

              transition
            "
          >
            ✕
          </button>
        </div>

        {/* STATUS */}

        <div
          className={`
            mt-6

            border

            rounded-2xl

            p-4

            ${
              isPaid
                ? "border-green-500/60 bg-green-500/10"
                : hasPendingSlip
                  ? "border-orange-500/60 bg-orange-500/10"
                  : "border-red-500/60 bg-red-500/10"
            }
          `}
        >
          <div className="flex justify-between items-center">
            <span className="text-[#A0A0A0] text-sm">Status</span>

            <span
              className={`
                font-bold

                ${
                  isPaid
                    ? "text-green-400"
                    : hasPendingSlip
                      ? "text-orange-400"
                      : "text-red-400"
                }
              `}
            >
              {isPaid
                ? "Verified"
                : hasPendingSlip
                  ? "Waiting Verify"
                  : "No Slip"}
            </span>
          </div>
        </div>

        {/* AMOUNT */}

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-[#2C2C2E] rounded-2xl p-4">
            <p className="text-xs text-[#A0A0A0]">Amount to pay</p>

            <p className="font-bold text-xl mt-1">
              ฿{Number(member.AmountToPay || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-[#2C2C2E] rounded-2xl p-4">
            <p className="text-xs text-[#A0A0A0]">Amount paid</p>

            <p className="font-bold text-xl text-[#F8B500] mt-1">
              ฿{Number(member.AmountPaid || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* =========================
            PAYMENT SLIP
        ========================== */}

        {latestSlip ? (
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Payment Slip</h3>

              <span className="text-xs text-[#A0A0A0]">
                ฿{Number(latestSlip.Amount || 0).toFixed(2)}
              </span>
            </div>

            {latestSlip.ProofImage && (
              <div
                className="
                  mt-3

                  bg-white

                  rounded-2xl

                  p-3

                  overflow-hidden
                "
              >
                <img
                  src={getSlipImageUrl(latestSlip.ProofImage)}
                  alt="Payment Slip"
                  className="
                    w-full
                    max-h-[420px]

                    object-contain

                    rounded-xl
                  "
                />
              </div>
            )}

            <div
              className="
                flex
                justify-between

                mt-3

                text-sm
              "
            >
              <span className="text-[#A0A0A0]">Slip status</span>

              <span
                className={
                  latestSlip.StatusPay === "PAID"
                    ? "text-green-400"
                    : "text-orange-400"
                }
              >
                {latestSlip.StatusPay}
              </span>
            </div>
          </div>
        ) : (
          <div
            className="
              mt-6

              border
              border-red-500/30

              bg-red-500/5

              rounded-2xl

              p-5

              text-center
            "
          >
            <p className="text-red-400 font-semibold">
              No payment slip uploaded
            </p>

            <p className="text-[#A0A0A0] text-sm mt-1">
              Waiting for member payment
            </p>
          </div>
        )}

        {/* =========================
            CONFIRM PAYMENT
        ========================== */}

        {hasPendingSlip && !isPaid && (
          <button
            type="button"
            onClick={onConfirm}
            disabled={verifying}
            className="
              btn

              w-full
              mt-6

              border-none

              rounded-xl

              bg-[#F8B500]
              hover:bg-[#E0A300]

              text-[#121212]
              font-bold
            "
          >
            {verifying ? "Verifying..." : "Confirm Payment"}
          </button>
        )}

        {/* VERIFIED */}

        {isPaid && (
          <div
            className="
              mt-6

              bg-green-500/10

              border
              border-green-500/30

              text-green-400

              text-center
              font-semibold

              rounded-xl

              py-4
            "
          >
            ✓ Payment Verified
          </div>
        )}
      </div>
    </div>
  );
}

/* =============================
   BILL STATUS
============================= */

function BillStatus({ completed, allPaid, pendingCount }) {
  if (completed) {
    return (
      <span
        className="
          px-3
          py-1

          bg-green-500/10
          text-green-400

          rounded-full

          text-xs
          font-semibold

          whitespace-nowrap
        "
      >
        Completed
      </span>
    );
  }

  if (allPaid) {
    return (
      <span
        className="
          px-3
          py-1

          bg-[#F8B500]/10
          text-[#F8B500]

          rounded-full

          text-xs
          font-semibold

          whitespace-nowrap
        "
      >
        Ready
      </span>
    );
  }

  if (pendingCount > 0) {
    return (
      <span
        className="
          px-3
          py-1

          bg-yellow-500/10
          text-yellow-400

          rounded-full

          text-xs
          font-semibold

          whitespace-nowrap
        "
      >
        Pending
      </span>
    );
  }

  return (
    <span
      className="
        px-3
        py-1

        bg-[#2C2C2E]
        text-[#A0A0A0]

        rounded-full

        text-xs
        font-semibold

        whitespace-nowrap
      "
    >
      Active
    </span>
  );
}
