import { useState } from "react";
import { useAuthStore } from "../stores/authStore";

const defaultAvatar = `
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path
        fill="#000000"
        d="M458.159 404.216c-18.93-33.65-49.934-71.764-100.409-93.431
        -28.868 20.196-63.938 32.087-101.745 32.087
        -37.828 0-72.898-11.89-101.767-32.087
        -50.474 21.667-81.479 59.782-100.398 93.431
        C28.731 448.848 48.417 512 91.842 512h328.317
        c43.424 0 63.11-63.152 38-107.784z"
    />
    <path
        fill="#000000"
        d="M256.005 300.641c74.144 0 134.231-60.108
        134.231-134.242v-32.158C390.236 60.108 330.149 0 256.005 0
        c-74.155 0-134.252 60.108-134.252 134.242V166.4
        c0 74.133 60.098 134.241 134.252 134.241z"
    />
</svg>
`;

export default function UserProfile() {
    const user = useAuthStore((state) => state.user);

    const [imageError, setImageError] = useState(false);

    const avatar = `data:image/svg+xml;utf8,${encodeURIComponent(defaultAvatar)}`;

    if (!user) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="avatar">
                <div className="w-12 h-12 rounded-full bg-white shadow-md overflow-hidden">
                    <img src={!imageError && user.profileImage ? user.profileImage : avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                </div>
            </div>
        </div>
    )
}