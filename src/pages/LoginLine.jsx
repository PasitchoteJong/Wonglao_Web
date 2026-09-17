const LoginLine = () => {
  const handleLineLogin = () => {
    const clientId = import.meta.env.VITE_LINE_CHANNEL_ID;
    // console.log(import.meta.env.VITE_LINE_CHANNEL_ID)
    console.log("Channel ID:", clientId);

    const redirectUri = import.meta.env.VITE_LINE_CHANNEL_URL;

    const lineLoginUrl =
      `https://access.line.me/oauth2/v2.1/authorize` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=123456` +
      `&scope=profile%20openid`;
    console.log("Line URL:", lineLoginUrl);

    window.location.href = lineLoginUrl;
  };
  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
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
