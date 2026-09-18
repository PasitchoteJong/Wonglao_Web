import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. เปลี่ยนเป็น useNavigate
import { registerLineUser } from "../services/auth.service";
import { useAuthStore } from "../stores/authStore";
import Loading from "../components/Loading.jsx";

function RegisterLine() {
  const navigate = useNavigate(); // 2. ประกาศเรียกใช้งาน useNavigate
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    birthDay: "",
    promtpay: "",
    qrPayment: null,
  });

  const [previewQR, setPreviewQR] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. ดึง Query Params ปกติ
  const params = new URLSearchParams(window.location.search);
  let registerToken = params.get("token");

  // 2. ถ้าดึงปกติไม่เจอ ให้เช็คใน liff.state (กรณีวิ่งผ่าน LINE LIFF)
  if (!registerToken) {
    const liffState = params.get("liff.state");
    if (liffState) {
      // decode ค่า liff.state เพื่อดึง query parameter ที่ถูกซ่อนไว้
      const decodedState = decodeURIComponent(liffState);
      const stateParams = new URLSearchParams(decodedState);
      registerToken = stateParams.get("token");
    }
  }

  // 3. ตรวจสอบ registerToken ตามปกติ
  console.log("Real Register Token:", registerToken);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQRChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, qrPayment: file }));

    const imageURL = URL.createObjectURL(file);
    setPreviewQR(imageURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 3. ป้องกันการส่งค่า 'null' string ไปที่ Backend
    if (!registerToken || registerToken === "null") {
      alert(
        "ไม่พบ Token หรือเซสชันหมดอายุ กรุณาเข้าสู่ระบบด้วย LINE ใหม่อีกครั้ง",
      );
      navigate("/login"); // ส่งกลับไปหน้า login
      return;
    }

    if (!formData.promtpay && !formData.qrPayment) {
      alert("Please provide at least one payment method.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();

      // เมื่อผ่านเงื่อนไขด้านบน registerToken จะเป็น string token ที่ถูกต้องแน่นอน
      data.append("registerToken", registerToken);
      data.append("email", formData.email);
      data.append("birthDay", formData.birthDay);

      if (formData.promtpay) {
        data.append("promtpay", formData.promtpay);
      }
      if (formData.qrPayment) {
        data.append("qrPayment", formData.qrPayment);
      }

      const result = await registerLineUser(data);
      console.log("Register Success:", result);

      login(result.token, result.user);
      navigate("/"); // 4. เปลี่ยนหน้าสำเร็จผ่าน navigate
    } catch (error) {
      console.error("Register Error:", error);
      // 5. แก้ไขพิมพ์ผิด error.respone -> error.response
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 font-sans text-white">
        <div className="card bg-[#1C1C1E] border border-[#2C2C2E] w-full max-w-lg shadow-2xl rounded-3xl">
          <div className="card-body p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white">Register</h1>
              <p className="text-[#A0A0A0] mt-2">Complete your information</p>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="avatar">
                <div className="w-24 rounded-full ring-2 ring-[#F8B500] ring-offset-2 ring-offset-[#1C1C1E]">
                  <img src="https://placehold.co/150x150" alt="LINE Profile" />
                </div>
              </div>

              <p className="font-semibold mt-3 text-white">LINE User</p>
              <p className="text-sm text-[#A0A0A0]">Your LINE account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold text-white">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                  className="input input-bordered w-full bg-[#2C2C2E] border-transparent text-white focus:border-[#F8B500] rounded-xl placeholder-gray-500"
                />
              </div>

              <div className="form-control mb-1">
                <label className="label">
                  <span className="label-text font-semibold text-white">
                    Birthday
                  </span>
                </label>
              </div>

              <input
                type="date"
                name="birthDay"
                value={formData.birthDay}
                onChange={handleChange}
                className="input input-bordered w-full bg-[#2C2C2E] border-transparent text-white focus:border-[#F8B500] rounded-xl mb-4"
                required
              />

              <div className="divider text-[#A0A0A0] before:bg-[#2C2C2E] after:bg-[#2C2C2E]">
                Payment Information
              </div>

              <p className="text-sm text-[#A0A0A0] mb-4">
                Please Provide at least one payment method.
              </p>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold text-white">
                    PromptPay
                  </span>
                  <span className="label-text-alt text-[#A0A0A0]">
                    Optional
                  </span>
                </label>
                <input
                  type="text"
                  name="promtpay"
                  value={formData.promtpay}
                  onChange={handleChange}
                  placeholder="Your Promtpay"
                  className="input input-bordered w-full bg-[#2C2C2E] border-transparent text-white focus:border-[#F8B500] rounded-xl placeholder-gray-500"
                />
              </div>

              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-semibold text-white">
                    QR Payment
                  </span>
                  <span className="label-text-alt text-[#A0A0A0]">
                    Optional
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQRChange}
                  className="file-input file-input-bordered w-full bg-[#2C2C2E] border-transparent text-white focus:border-[#F8B500] rounded-xl"
                />
              </div>

              {previewQR && (
                <div className="flex flex-col items-center mb-6">
                  <p className="font-semibold mb-2 text-white">QR Preview</p>
                  <div className="border border-[#2C2C2E] bg-white p-2 rounded-2xl">
                    <img
                      src={previewQR}
                      alt="QR Payment Preview"
                      className="w-48 h-48 object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn w-full border-none text-[#121212] font-bold bg-[#F8B500] hover:bg-[#E0A300] rounded-xl"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
}

export default RegisterLine;
