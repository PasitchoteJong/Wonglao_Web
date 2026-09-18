const LoginLine = () => {
  const handleLineLogin = () => {
  const clientId = import.meta.env.VITE_LINE_CHANNEL_ID;
  const apiUrl = import.meta.env.VITE_API_URL;

  // 1. กำหนดค่าแบบ RAW (ไม่ต้องใส่ encodeURIComponent เอง)
  const redirectUri = `${apiUrl}/api/auth/line/callback`;
  const scope = "profile openid";
  const state = "123456"; // หรือสุ่มแบบ CSRF

  // 2. ใช้ URLSearchParams จัดการ Encode
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri, // URLSearchParams จะ encode ให้เองถูกต้องรอบเดียว
    state: state,
    scope: scope,
  });

  // 3. ผลลัพธ์ที่ได้จะถูกต้องตามมาตรฐาน
  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;

  window.location.href = lineLoginUrl;
};
  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
      {/* <p className="text-white">TEST PRODUCTION LOGIN</p> */}
      <button
        onClick={handleLineLogin}
        className="btn text-lg border-none text-[#121212] rounded-2xl bg-[#F8B500] hover:bg-[#E0A300] px-10 py-3 shadow-md font-bold"
      >
        Continue with LINE
      </button>
    </div>
  );

  // return(
  //     <button onClick={handleLineLogin} className="btn btn-success">
  //         Continue with LINE
  //     </button>
  // );
};

export default LoginLine;
