// import LayoutDesign from '../images/LoginV2/Layout Design/Layout Design.png'
import LayoutDesign from '../images/LoginV2/Layout Design/layoutDesign2.png'
import { ReactComponent as WordsDesign } from '../images/LoginV2/Word Design/word design.svg'
import { ReactComponent as AcharyaLogo } from '../images/Logo/Logo.svg'
import { ReactComponent as GoogleIcon } from '../images/LoginV2/Google Logo/googleLogo.svg'
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useEffect } from 'react';
import { useAppState } from '../AppStateContext';



function Loginv2() {
    const { setIsLoggedIn, setNewChat } = useAppState();
    const navigate = useNavigate();

    useEffect(() => {
        const appState = JSON.parse(localStorage.getItem('appState'));
        if (appState && appState.isLoggedIn === true) {
            navigate("/");
        }
    }, [navigate]);
    

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            // console.log('Google login successful', tokenResponse);
            const response = await login(tokenResponse.code)
            if (response.status === "success") {
                setIsLoggedIn(true);
                setNewChat(true)
                // console.log("userDataObj", userData)
                localStorage.setItem('userData', JSON.stringify({
                    name: response.user.name,
                    email: response.user.email,
                    profilePic: response.user.profile
                }));
                localStorage.setItem('messageId', response.messages.messageId)
                // localStorage.setItem('isLoggedIn', 'true');
                const data = JSON.parse(localStorage.getItem('userData'));
                // console.log(data.name);
                navigate("/");

            }
        },
        onError: () => {
            // console.error('Google login failed');
        },
        flow: 'auth-code',
    });

    return (
        <div className="relative  bg-[#13002D] h-screen overflow-hidden ">
            <img src={LayoutDesign} className="h-screen w-screen " alt='design vector' />
            <div className='myWorkingArea absolute top-0 left-1/2 transform -translate-x-1/2 max-w-[1920px] w-full h-screen'>
                <div className='absolute top-[50%] left-[50%] transform -translate-y-1/2 -translate-x-1/2 w-[450px] py-20 px-8 flex flex-col gap-7 justify-center 
                items-center rounded-3xl drop-shadow-lg bg-[#13002D] bg-opacity-25' >
                    <AcharyaLogo className='h-24 w-24'/>
                    <div className='font-primary2 font-semibold text-white text-4xl'>Welcome to Acharya</div>
                    <div className='flex justify-center align-center'>
                        <button
                            className={`flex justify-center w-[250px] mt-3 gap-2 py-2 px-5 rounded-full border border-white`}
                            onClick={() => googleLogin()}><GoogleIcon className='h-7 w-7' /><div className='text-white' >Sign in with Google</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Loginv2;