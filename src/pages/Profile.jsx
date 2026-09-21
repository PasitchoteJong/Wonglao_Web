import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import { getMyProfile, updateMyProfile } from "../services/profile.service.js";

export default function Profile() {
  const navigate = useNavigate();

  const profileInputRef = useRef(null);

  const qrInputRef = useRef(null);

  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    birthDay: "",
    promptPay: "",
    profileImage: "",
    qrPayment: "",
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [qrPaymentFile, setQrPaymentFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [qrPreview, setQrPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const result = await getMyProfile();
        const user = result.data;

        let birthDay = "";
        const rawBirthDay = user.birthDay || user.BirthDay;

        if (rawBirthDay) {
          birthDay = new Date(rawBirthDay).toISOString().split("T")[0];
        }

        // ========================================
        // FORMAT USER DATA
        // ========================================

        const data = {
          displayName: user.DisplayName || "",
          email: user.Email || "",
          birthDay: user.BirthDay
            ? new Date(user.BirthDay).toISOString().split("T")[0]
            : "",
          promptPay: user.PromptPay || "",
          profileImage: user.ProfileImage || "",
          qrPayment: user.QRpayment || "",
        };

        setProfile(data);

        setProfilePreview(data.profileImage);

        setQrPreview(data.qrPayment);
      } catch (err) {
        console.error("Load profile error:", err);

        setError(err.response?.data?.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ========================================
  // CHANGE TEXT INPUT
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,

      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ========================================
  // PROFILE IMAGE
  // ========================================

  const handleProfileImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");

      return;
    }

    setProfileImageFile(file);

    const preview = URL.createObjectURL(file);

    setProfilePreview(preview);

    setError("");
    setSuccess("");
  };

  // ========================================
  // QR PAYMENT IMAGE
  // ========================================

  const handleQrImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");

      return;
    }

    setQrPaymentFile(file);

    const preview = URL.createObjectURL(file);

    setQrPreview(preview);

    setError("");
    setSuccess("");
  };

  // ========================================
  // SAVE BUTTON
  // ========================================

  const handleSaveClick = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ========================================
    // VALIDATE
    // ========================================

    if (!profile.displayName.trim()) {
      setError("Display name is required.");

      return;
    }

    if (profile.email && !profile.email.includes("@")) {
      setError("Please enter a valid email.");

      return;
    }

    // ========================================
    // OPEN CONFIRM MODAL
    // ========================================

    setConfirmOpen(true);
  };

  // ========================================
  // CONFIRM SAVE
  // ========================================

  const handleConfirmSave = async () => {
    try {
      setSaving(true);

      setError("");
      setSuccess("");

      // ========================================
      // FORM DATA
      // ========================================

      const formData = new FormData();

      formData.append("displayName", profile.displayName.trim());
      formData.append("email", profile.email.trim());
      formData.append("birthDay", profile.birthDay);
      formData.append("promptPay", profile.promptPay.trim());
      if (profileImageFile) formData.append("profileImage", profileImageFile);
      if (qrPaymentFile) formData.append("qrPayment", qrPaymentFile);

      // ========================================
      // API
      // ========================================

      const result = await updateMyProfile(formData);

      const updated = result.data;

      // ========================================
      // UPDATED BIRTH DAY
      // ========================================

      let updatedBirthDay = profile.birthDay;

      const rawBirthDay = updated.birthDay || updated.BirthDay;

      if (rawBirthDay) {
        updatedBirthDay = new Date(rawBirthDay).toISOString().split("T")[0];
      }

      // ========================================
      // UPDATE PROFILE STATE
      // ========================================

      const updatedProfile = {
        displayName:
          updated.displayName || updated.DisplayName || profile.displayName,

        email: updated.email || updated.Email || profile.email,

        birthDay: updatedBirthDay,

        promptPay: updated.promptPay || updated.PromptPay || profile.promptPay,

        profileImage:
          updated.profileImage || updated.ProfileImage || profile.profileImage,

        qrPayment: updated.qrPayment || updated.QRpayment || profile.qrPayment,
      };

      setProfile(updatedProfile);

      // ========================================
      // UPDATE PREVIEW
      // ========================================

      if (updatedProfile.profileImage) {
        setProfilePreview(updatedProfile.profileImage);
      }

      if (updatedProfile.qrPayment) {
        setQrPreview(updatedProfile.qrPayment);
      }

      // ========================================
      // CLEAR FILE
      // ========================================

      setProfileImageFile(null);

      setQrPaymentFile(null);

      // ========================================
      // CLOSE MODAL
      // ========================================

      setConfirmOpen(false);

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Update profile error:", err);

      setError(err.response?.data?.message || "Unable to update profile.");

      setConfirmOpen(false);
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // LOADING
  // ใช้ Component Loading เดิมของคุณ
  // ========================================

  if (loading) {
    return <Loading message="Loading profile..." />;
  }

  return (
    <>
      {/* ========================================
          PAGE
      ========================================= */}

      <div
        className="
          min-h-screen

          bg-black
          text-white

          px-5
          py-7
        "
      >
        <div
          className="
            max-w-3xl
            mx-auto
          "
        >
          {/* ========================================
              HEADER
          ========================================= */}

          <div
            className="
              flex
              items-center
              gap-4

              mb-8
            "
          >
            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                w-11
                h-11

                flex
                items-center
                justify-center

                rounded-xl

                bg-[#1C1C1E]

                border
                border-[#2C2C2E]

                text-lg

                transition-all

                hover:border-[#F8B500]
                hover:text-[#F8B500]

                hover:scale-105

                active:scale-95
              "
            >
              ←
            </button>

            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                "
              >
                Profile
              </h1>

              <p
                className="
                  text-sm
                  text-[#A0A0A0]
                "
              >
                Manage your personal information
              </p>
            </div>
          </div>

          {/* ========================================
              PROFILE FORM
          ========================================= */}

          <form
            onSubmit={handleSaveClick}
            className="
              bg-[#1C1C1E]

              border
              border-[#2C2C2E]

              rounded-3xl

              p-6
              sm:p-8
            "
          >
            {/* ========================================
                PROFILE IMAGE
            ========================================= */}

            <div
              className="
                flex
                flex-col
                items-center

                mb-8
              "
            >
              <div
                className="
                  relative
                "
              >
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="
                      w-32
                      h-32

                      rounded-full

                      object-cover

                      border-4
                      border-[#2C2C2E]
                    "
                  />
                ) : (
                  <div
                    className="
                      w-32
                      h-32

                      rounded-full

                      bg-[#2C2C2E]

                      border-4
                      border-[#3A3A3C]

                      flex
                      items-center
                      justify-center

                      text-4xl
                      font-bold

                      text-[#F8B500]
                    "
                  >
                    {profile.displayName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                {/* ========================================
                    EDIT PROFILE IMAGE BUTTON
                ========================================= */}

                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  className="
                    absolute

                    right-0
                    bottom-0

                    w-10
                    h-10

                    rounded-full

                    bg-[#F8B500]

                    text-black

                    border-4
                    border-[#1C1C1E]

                    flex
                    items-center
                    justify-center

                    font-bold

                    hover:bg-[#E0A300]

                    transition-all
                  "
                >
                  ✎
                </button>

                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImage}
                  className="hidden"
                />
              </div>

              <p
                className="
                  mt-3

                  text-sm
                  text-[#A0A0A0]
                "
              >
                Change your profile image
              </p>
            </div>

            {/* ========================================
                DISPLAY NAME
            ========================================= */}

            <ProfileField label="Display Name">
              <input
                type="text"
                name="displayName"
                value={profile.displayName}
                onChange={handleChange}
                placeholder="Display name"
                className="
                  input

                  w-full

                  bg-[#252527]

                  border
                  border-[#3A3A3C]

                  focus:border-[#F8B500]

                  text-white

                  rounded-xl
                "
              />
            </ProfileField>

            {/* ========================================
                EMAIL
            ========================================= */}

            <ProfileField label="Email">
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="
                  input

                  w-full

                  bg-[#252527]

                  border
                  border-[#3A3A3C]

                  focus:border-[#F8B500]

                  text-white

                  rounded-xl
                "
              />
            </ProfileField>

            {/* ========================================
                BIRTH DAY
            ========================================= */}

            <ProfileField label="Birth Day">
              <input
                type="date"
                name="birthDay"
                value={profile.birthDay}
                onChange={handleChange}
                className="
                  input

                  w-full

                  bg-[#252527]

                  border
                  border-[#3A3A3C]

                  focus:border-[#F8B500]

                  text-white

                  rounded-xl

                  [color-scheme:dark]
                "
              />
            </ProfileField>

            {/* ========================================
                PROMPTPAY
            ========================================= */}

            <ProfileField label="PromptPay">
              <input
                type="text"
                name="promptPay"
                value={profile.promptPay}
                onChange={handleChange}
                placeholder="Phone number or PromptPay ID"
                className="
                  input

                  w-full

                  bg-[#252527]

                  border
                  border-[#3A3A3C]

                  focus:border-[#F8B500]

                  text-white

                  rounded-xl
                "
              />
            </ProfileField>

            {/* ========================================
                QR PAYMENT
            ========================================= */}

            <ProfileField label="QR Payment">
              <div
                className="
                  bg-[#252527]

                  border
                  border-[#3A3A3C]

                  rounded-2xl

                  p-5
                "
              >
                {/* ========================================
                    QR PREVIEW
                ========================================= */}

                {qrPreview ? (
                  <div
                    className="
                      flex
                      justify-center
                    "
                  >
                    <img
                      src={qrPreview}
                      alt="QR Payment"
                      className="
                        max-w-[230px]
                        max-h-[230px]

                        rounded-xl

                        object-contain

                        bg-white

                        p-2
                      "
                    />
                  </div>
                ) : (
                  <div
                    className="
                      h-44

                      flex
                      flex-col

                      items-center
                      justify-center

                      text-[#A0A0A0]
                    "
                  >
                    <span
                      className="
                        text-5xl
                      "
                    >
                      ▦
                    </span>

                    <p
                      className="
                        text-sm
                        mt-2
                      "
                    >
                      No QR payment image
                    </p>
                  </div>
                )}

                {/* ========================================
                    QR INPUT
                ========================================= */}

                <input
                  ref={qrInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleQrImage}
                  className="hidden"
                />

                {/* ========================================
                    CHANGE QR
                ========================================= */}

                <button
                  type="button"
                  onClick={() => qrInputRef.current?.click()}
                  className="
                    w-full

                    mt-4

                    px-4
                    py-3

                    rounded-xl

                    border
                    border-[#F8B500]

                    text-[#F8B500]

                    font-semibold

                    transition-all

                    hover:bg-[#F8B500]/10

                    active:scale-[0.98]
                  "
                >
                  {qrPreview ? "Change QR Payment" : "Upload QR Payment"}
                </button>
              </div>
            </ProfileField>

            {/* ========================================
                ERROR
            ========================================= */}

            {error && (
              <div
                className="
                  mt-5

                  p-4

                  rounded-xl

                  bg-red-500/10

                  border
                  border-red-500/30

                  text-red-400

                  text-sm
                "
              >
                {error}
              </div>
            )}

            {/* ========================================
                SUCCESS
            ========================================= */}

            {success && (
              <div
                className="
                  mt-5

                  p-4

                  rounded-xl

                  bg-green-500/10

                  border
                  border-green-500/30

                  text-green-400

                  text-sm
                "
              >
                {success}
              </div>
            )}

            {/* ========================================
                SAVE BUTTON
            ========================================= */}

            <button
              type="submit"
              className="
                btn

                w-full

                mt-8

                h-12

                bg-[#F8B500]

                hover:bg-[#E0A300]

                border-none

                text-black
                font-bold

                rounded-xl
              "
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>

      {/* ========================================
          CONFIRM MODAL
      ========================================= */}

      {confirmOpen && (
        <ConfirmProfileModal
          profile={profile}
          profilePreview={profilePreview}
          qrPreview={qrPreview}
          saving={saving}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleConfirmSave}
        />
      )}

      {/* ========================================
          SAVING LOADING
      ========================================= */}

      {saving && <Loading message="Saving profile..." />}
    </>
  );
}

// ======================================================
// PROFILE FIELD
// ======================================================

function ProfileField({ label, children }) {
  return (
    <div
      className="
        mb-6
      "
    >
      <label
        className="
          block

          text-sm
          font-semibold

          mb-2
        "
      >
        {label}
      </label>

      {children}
    </div>
  );
}

// ======================================================
// CONFIRM PROFILE MODAL
// ======================================================

function ConfirmProfileModal({
  profile,
  profilePreview,
  qrPreview,
  saving,
  onCancel,
  onConfirm,
}) {
  return (
    <div
      className="
        fixed
        inset-0

        z-[100]

        bg-black/75
        backdrop-blur-sm

        flex
        items-center
        justify-center

        p-4
      "
    >
      <div
        className="
          w-full
          max-w-md

          max-h-[90vh]
          overflow-y-auto

          bg-[#1C1C1E]

          border
          border-[#2C2C2E]

          rounded-3xl

          p-6
        "
      >
        {/* ========================================
            TITLE
        ========================================= */}

        <h2
          className="
            text-xl
            font-bold

            text-center
          "
        >
          Confirm Changes
        </h2>

        <p
          className="
            text-sm
            text-[#A0A0A0]

            text-center

            mt-2
          "
        >
          Please review your information before saving.
        </p>

        {/* ========================================
            PROFILE IMAGE
        ========================================= */}

        <div
          className="
            flex
            justify-center

            mt-6
          "
        >
          {profilePreview ? (
            <img
              src={profilePreview}
              alt="Profile"
              className="
                w-20
                h-20

                rounded-full

                object-cover

                border-2
                border-[#2C2C2E]
              "
            />
          ) : (
            <div
              className="
                w-20
                h-20

                rounded-full

                bg-[#2C2C2E]

                flex
                items-center
                justify-center

                text-2xl
                text-[#F8B500]

                font-bold
              "
            >
              {profile.displayName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        {/* ========================================
            USER DATA
        ========================================= */}

        <div
          className="
            mt-6

            space-y-3
          "
        >
          <ConfirmRow label="Display Name" value={profile.displayName || "-"} />

          <ConfirmRow label="Email" value={profile.email || "-"} />

          <ConfirmRow label="Birth Day" value={profile.birthDay || "-"} />

          <ConfirmRow label="PromptPay" value={profile.promptPay || "-"} />

          <ConfirmRow
            label="QR Payment"
            value={qrPreview ? "QR image selected" : "No QR image"}
          />
        </div>

        {/* ========================================
            CONFIRM MESSAGE
        ========================================= */}

        <div
          className="
            mt-6

            rounded-xl

            bg-[#F8B500]/10

            border
            border-[#F8B500]/20

            p-4

            text-sm
            text-[#F8B500]
          "
        >
          Your profile information will be updated after confirmation.
        </div>

        {/* ========================================
            BUTTON
        ========================================= */}

        <div
          className="
            grid
            grid-cols-2

            gap-3

            mt-6
          "
        >
          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="
              btn

              bg-[#2C2C2E]

              border
              border-[#3A3A3C]

              text-white

              rounded-xl

              hover:bg-[#3A3A3C]
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={onConfirm}
            className="
              btn

              bg-[#F8B500]

              hover:bg-[#E0A300]

              border-none

              text-black
              font-bold

              rounded-xl
            "
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// CONFIRM ROW
// ======================================================

function ConfirmRow({ label, value }) {
  return (
    <div
      className="
        flex
        justify-between
        items-start

        gap-5

        bg-[#252527]

        rounded-xl

        px-4
        py-3
      "
    >
      <span
        className="
          text-sm
          text-[#A0A0A0]

          shrink-0
        "
      >
        {label}
      </span>

      <span
        className="
          text-sm
          font-semibold

          text-right

          break-all
        "
      >
        {value}
      </span>
    </div>
  );
}
