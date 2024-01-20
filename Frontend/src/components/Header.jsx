import { NavLink } from "react-router-dom"
import logo from "../images/Logo.svg"

export default function Header() {

    return (
        <div className="header bg-primary shadow-md">
            <section className="md:py-[10px] flex flex-col md:flex-row  justify-between items-center gap-[30px] md:gap-0">
                <NavLink to="/">
                    <div className="flex md:flex-row flex-col items-center md:gap-5 gap-3">
                        <img src={logo} alt="OdiaGenAI" />
                        <p className="text-xl font-primary text-white font-bold">Acharya</p>
                    </div>
                </NavLink>
                <div >
                    <NavLink
                        to="/"
                        className={({ isActive }) => `font-bold font-secondary ${isActive ? "text-[#7B29FF] " : "text-white"}`}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `font-bold font-secondary ml-8 ${isActive ? "text-[#7B29FF] " : "text-white"}`}
                    >
                        Settings
                    </NavLink>
                </div>
            </section>
        </div>
    )
}

