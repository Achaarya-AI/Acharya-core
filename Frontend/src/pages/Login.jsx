import { useAppState } from '../AppStateContext';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import logo from "../images/Logo.svg"
import { useGoogleLogin } from '@react-oauth/google';
import { login } from '../api';
import { useEffect } from 'react';

export default function Login() {
    const { darkTheme, setIsLoggedIn } = useAppState();
    const navigate = useNavigate();

    const themeColors = darkTheme ? {
        "bg": "bg-primary-dark",
        "bg2": "bg-secondary-bg-dark",
        "bgs": "bg-secondary",
        "chatbg": "bg-chat-bg-dark",
        "reasonbg": "bg-reason-dark",
        "txt": "text-white",
        "txtI": "text-reason-dark",
        "color": "white",
        "reasonIcon": "fill-white",
    } : {
        "bg": "bg-primary",
        "bg2": "bg-secondary-bg",
        "bgs": "bg-secondary",
        "chatbg": "bg-chat-bg",
        "reasonbg": "bg-reason",
        "txt": "text-reason-dark",
        "txtI": "text-white",
        "color": "black",
        "reasonIcon": "fill-dark",
    };

    useEffect(() => {
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
        if (storedIsLoggedIn === 'true') { // Check if storedIsLoggedIn is 'true' string
            navigate("/");
        }
    }, []);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Google login successful', tokenResponse);
            const response = await login(tokenResponse.code)
            if (response.status === "success") {
                setIsLoggedIn(true);

                // console.log("userDataObj", userData)
                localStorage.setItem('userData', JSON.stringify({
                    name: response.name,
                    email: response.email,
                    profilePic: response.profile
                }));

                localStorage.setItem('isLoggedIn', 'true'); 
                const data = JSON.parse(localStorage.getItem('userData')); 
                console.log(data.name);
                navigate("/");

            }
        },
        onError: () => {
            console.error('Google login failed');
        },
        flow: 'auth-code',
    });

    return (
        <div className={`${themeColors.bg2}`}>
            <div className='flex justify-center items-center h-screen'>
                <div className={`w-full max-w-[400px] p-[25px] ${themeColors.bg} rounded-lg shadow-custom`}>
                    <div className='flex flex-col justify-center items-center'>
                        <img src={logo} alt="OdiaGenAI" />
                        <p className={`${themeColors.txt} py-3 text-center font-semibold pb-10`}>Welcome to Acharya!</p>
                        <div className='flex justify-center align-center'>
                            <button
                                className={`flex justify-center w-70 gap-2 py-2 px-5 rounded-lg ${darkTheme ? "bg-white" : themeColors.bgs}`}
                                onClick={() => googleLogin()}><GoogleIcon className={themeColors.txtI} /><div className={themeColors.txtI} >Sign in with Google</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
