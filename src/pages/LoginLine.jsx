const LoginLine = () =>{
    const handleLineLogin =()=>{
        const clientId = import.meta.env.VITE_LINE_CHANNEL_ID;
        // console.log(import.meta.env.VITE_LINE_CHANNEL_ID)
        console.log("Channel ID:",clientId)

        const redirectUri = "http://localhost:8808/api/auth/line/callback";

        const lineLoginUrl =
        `https://access.line.me/oauth2/v2.1/authorize`+
        `?response_type=code`+
        `&client_id=${clientId}`+
        `&redirect_uri=${encodeURIComponent(redirectUri)}`+
        `&state=123456`+
        `&scope=profile%20openid`;
console.log("Line URL:", lineLoginUrl)

        window.location.href = lineLoginUrl;
    };

    return(
        <button onClick={handleLineLogin} className="btn btn-success">
            Continue with LINE
        </button>
    );
};

export default LoginLine;