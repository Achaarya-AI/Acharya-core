import LayoutDesign from '../images/Landing Page/Layout Designs/Layout Design.png';
import { ReactComponent as Logo } from '../images/Logo/Logo.svg';
import { ReactComponent as WordsDesign } from '../images/Landing Page/word designs/Words.svg';
import { ReactComponent as ChevronRightIcon } from '../images/Landing Page/Icons/chevron_right.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppState } from '../AppStateContext';


function LandingPg() {
    const { isLoggedIn, setIsLoggedIn } = useAppState();
    const navigate = useNavigate()


    useEffect(() => {
        setTimeout(() => {
            const appState = JSON.parse(localStorage.getItem('appState'));
            if (appState && appState.isLoggedIn === true) {
                navigate("/");
            }
        }, 1000); // Delay for 100 milliseconds
    }, [isLoggedIn]);
    

    const handleClick = () => {
        navigate("/loginv2")
    }


    return (
        // DESKTOP RESPONSIVENESS 
        <div className="relative  bg-[#13002D] w-screen h-screen overflow-hidden ">
            <img src={LayoutDesign} alt='design' className="w-screen h-screen" />
            <div className='absolute right-0 bottom-0 mr-[-45px]'>
                <WordsDesign className='h-[85vh]' />
            </div>
            <div className='myWorkingArea absolute top-0 left-1/2 transform -translate-x-1/2 max-w-[1920px] w-full h-screen'>
                {/* LOGO */}
                <div className='absolute top-[40px] left-[50px]'>
                    <Logo />
                </div>
                {/* HEADERS */}
                <div className='absolute top-[40px] right-[60px] flex w-[600px] justify-between font-tertiary2 text-white text-2xl text-center'>
                    <div className='w-[145px] font-tertiary2 font-normal py-2 cursor-pointer'>Home</div>
                    <div className='w-[145px] font-tertiary2 font-normal py-2 cursor-pointer'>Contact</div>
                    <div className='h-full cursor-pointer' onClick={() => handleClick()}>
                        <div className='relative rounded-3xl blur-[1px]  bg-[#13002D] bg-opacity-60 h-[50px] w-[225px]'></div>
                        <div className='relative mt-[-48px] ml-[24px] flex items-center justify-center ' >
                            <div className='text-2xl font-tertiary2 font-normal'>Get Started</div>
                            <ChevronRightIcon className='fill-white' />
                        </div>
                    </div>
                </div>
                {/* CENTER TEXTS  */}
                <div className="absolute top-[35%] left-[100px] flex flex-col items-start justify-center gap-3">
                    <div className="font-primary2 font-light text-6xl leading-[75px] text-white">
                        Revolutionizing <br />
                        Education with <span className="font-semibold text-[#04D99D]">Acharya</span>
                    </div>
                    <div className=" text-[22px] text-white font-secondary2 font-semibold italic">Acharya is your friendly AI tutor, here to make learning fun.</div>

                    <div className='relative mt-9 cursor-pointer' onClick={() => handleClick()}>
                        <div className='relative rounded-3xl blur-[1px]  bg-[#04D99D] h-[50px] w-[200px]'></div>
                        <div className='relative mt-[-45px] ml-[24px] flex items-center justify-center ' >
                            <div className='text-2xl font-tertiary2 font-semibold'>Get Started</div>
                            <ChevronRightIcon className='fill-[#13002D]' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPg;