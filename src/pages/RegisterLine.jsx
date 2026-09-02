import { useState } from "react";
import { registerLineUser } from "../services/auth.service";

function RegisterLine() {
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        birthDay: "",
        promtpay: "",
        qrPayment: null
    });

    const [previewQR, setPreviewQR] = useState(null);

    const params = new URLSearchParams(window.location.search);
    const registerToken = params.get("token");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQRChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setFormData((prev) => ({ ...prev, qrPayment: file }));

        const imageURL = URL.createObjectURL(file);
        setPreviewQR(imageURL);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Register Data:", formData);

        if (!formData.promtpay && !formData.qrPayment) {
            alert("Please provide at least one paynemt method.")
            return;
        }

        try {
            const data = new FormData();

            data.append("registerToken", registerToken);
            data.append("email", formData.email);
            data.append("birthDay", formData.birthDay);

            if (formData.promtpay) { data.append("promtpay", formData.promtpay) };
            if (formData.qrPayment) { data.append("qrPayment", formData.qrPayment) };

            const result = await registerLineUser(data);
            console.log("Register Success:", result)

            window.location.href = `/home?token=${result.token}`;

        } catch (error) {
            console.error("Register Error:", error)

            alert(
                error.respone?.data?.message || "Registration failed"
            )
        }

    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card bg-base-100 w-full max-w-lg shadow-xl">
                <div className="card-body">

                    <div className="text-center mb-4">
                        <h1 className="text-3xl">Register</h1>
                        <p className="text-base-content/60 mt-2">Complete your information</p>
                    </div>

                    <div className="flex flex-col items-center mb-6">
                        <div className="avatar">
                            <div className="w-24 rounded-full ring ring-success ring-offset-base-100 ring-offset-2">
                                <img src="https://placehold.co/150x150" alt="LINE Profile" />
                            </div>
                        </div>

                        <p className="font-semibold mt-3">LINE User</p>
                        <p className="text-sm text-base-content/60">Your LINE account</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-semibold">Diaplay Name</span>
                            </label>

                            <input
                                type="text"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                placeholder="Enter your display name"
                                className="input input-bordered w-full"
                                required
                            />
                        </div> */}

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-semibold">Email</span>
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@mail.com"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-semibold">Birthday</span>
                            </label>
                        </div>

                        <input
                            type="date"
                            name="birthDay"
                            value={formData.birthDay}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />

                        <div className="divider">
                            Payment Information
                        </div>
                        <p>Please Provide at least one payment method.</p>

                        {/* <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-semibold">PromtPay</span>
                                <span className="label-text-alt">Optional</span>
                            </label>
                            <input
                                type="text"
                                name="promtpay"
                                value={formData.promtpay}
                                onChange={handleChange}
                                placeholder="Your Promtpay"
                                className="input input-bordered w-full"
                            />
                        </div> */}

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text font-semibold">PromptPay</span>

                                <span className="label-text-alt">Optional</span>
                            </label>
                            <input
                                type="text"
                                name="promtpay"
                                value={formData.promtpay}
                                onChange={handleChange}
                                placeholder="Your Promtpay"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text font-semibold">QR Payment</span>

                                <span className="label-text-alt">Optional</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleQRChange}
                                className="file-input file-bordered w-full"
                            />
                        </div>

                        {previewQR && (
                            <div className="flex flex-col items-center mb-6">
                                <p className="font-semibold mb-2">QR Preview</p>

                                <div className="border rounded-xl p-2">
                                    <img
                                        src={previewQR}
                                        alt="QR Payment Preview"
                                        className="w-48 h-48 object-contain"
                                    />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-success w-full">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default RegisterLine;