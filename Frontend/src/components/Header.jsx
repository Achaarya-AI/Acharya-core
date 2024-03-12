import { NavLink, useNavigate } from "react-router-dom"
import logo from "../images/Logo.svg"
import { useAppState } from "../AppStateContext"
import { logout } from "../api"

export default function Header() {
    const navigate = useNavigate();
    const { darkTheme, setDarkTheme, isLoggedIn, setIsLoggedIn, setInput , setMessages} = useAppState()

    const themeColors = darkTheme === true ? {
        "bg": "bg-primary-dark",
        "bg2": "bg-secondary-bg-dark",
        "bgs": "bg-secondary",
        "chatbg": "bg-chat-bg-dark",
        "reasonbg": "bg-reason-dark",
        "txt": "text-white",
        "color": "white",
        "reasonIcon": "fill-white",
    } : {
        "bg": "bg-primary",
        "bg2": "bg-secondary-bg",
        "bgs": "bg-secondary",
        "chatbg": "bg-chat-bg",
        "reasonbg": "bg-reason",
        "txt": "text-reason-dark",
        "color": "black",
        "reasonIcon": "fill-dark",
    }

    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedIsLoggedIn === null) {
        localStorage.setItem('isLoggedIn', JSON.stringify(false));
    } else if (JSON.parse(storedIsLoggedIn)) {
        setIsLoggedIn(storedIsLoggedIn)
    }


    async function handleLogout() {
        try {
            await logout();
            setIsLoggedIn(false);
            localStorage.setItem('isLoggedIn', JSON.stringify(false));
            localStorage.removeItem("userData");
            localStorage.removeItem("messageId");
            setInput({
                messages: "",
                class: 8,
                subject: ""
            });
            setMessages([]);
            console.log('User logged out successfully');
            navigate("/");
        } catch (error) {
            console.error('Failed to logout user:', error);
            // Handle error
        }
    }

    function toggle() {
        setDarkTheme(prevState => !prevState)
    }

    return (
        <div className={`header ${themeColors.bg}  shadow-lg z-10 relative `}>
            <section className="md:py-[10px]  flex flex-col md:flex-row  justify-between items-center gap-[30px] md:gap-0">
                <NavLink to="/">
                    <div className="flex md:flex-row flex-col items-center md:gap-5 gap-3">
                        <img src={logo} alt="OdiaGenAI" />
                        <p className={`text-xl font-primary ${themeColors.txt} font-bold`}>Acharya <span className="text-xl font-thin">|</span> आचार्य</p>
                    </div>
                </NavLink>
                <div className={`flex ${darkTheme ? "nav dark" : "nav"} gap-8`}>
                    <NavLink
                        to="/"
                        className={({ isActive }) => `font-bold font-secondary ${isActive ? "text-[#7B29FF] " : themeColors.txt}`}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `font-bold font-secondary  ${isActive ? "text-[#7B29FF] " : themeColors.txt}`}
                    >
                        Academic Settings
                    </NavLink>
                    <button onClick={handleLogout} className={`font-bold font-secondary  ${themeColors.txt}`}>
                        Logout
                    </button>
                    <div className="nav--toggler " >
                        <p className="nav--toggler-light font-secondary">Light</p>
                        <div
                            className="nav--toggler-slider"
                            onClick={() => toggle()}
                        >
                            <div className="nav--toggler-circle"></div>
                        </div>
                        <p className="nav--toggler-dark font-secondary">Dark</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

