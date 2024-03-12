import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { ReactComponent as Logo } from '../images/Logo/Logo.svg'
import { ReactComponent as LeftIcon } from '../images/HomeV2/Icons/chevron_left.svg'
import { ReactComponent as RightIcon } from '../images/HomeV2/Icons/chevron_right.svg'
import { ReactComponent as NewChatIcon } from '../images/HomeV2/Icons/newChat.svg'
import { ReactComponent as UserProfile } from '../images/HomeV2/Icons/userProfile.svg'
import { ReactComponent as Logout } from '../images/HomeV2/Icons/logout.svg'
import { parse, isToday, isYesterday, isWithinInterval, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { useAppState } from "../AppStateContext"
import { logout } from "../api"
import { useNavigate } from "react-router-dom"
import messages from '../chatData'


function Sidebar(props) {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const logoutPopupRef = useRef(null);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State variable to control the visibility of the logoutPopup
    const { darkTheme, setDarkTheme, isLoggedIn, setIsLoggedIn, setInput, setMessages, newChat, setNewChat } = useAppState()


    // UseEffect hook to handle click outside of the logoutPopup
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (logoutPopupRef.current && !logoutPopupRef.current.contains(event.target)) {
                setShowLogoutPopup(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    // Function to toggle the visibility of the logoutPopup
    const logoutPopup = () => {
        setShowLogoutPopup(!showLogoutPopup);
    }

    // Function to filter the messages based on the date {Today, Yesterday, Last 7 Days, Previous}
    //TODO FIX DATABASE STRUCUTURE TO SUIT THIS
    //TODO Fix for Previous MONTH
    const filterMessages = (date) => {
        // store the current date to compare with the message date
        const currentDate = new Date();

        switch (date) {
            case 'today':
                return messages.filter(message => {
                    const messageDate = parse(message.date, "MMMM d, yyyy, HH:mm:ss", new Date());
                    return isToday(messageDate);
                });
            case 'yesterday':
                return messages.filter(message => {
                    const messageDate = parse(message.date, "MMMM d, yyyy, HH:mm:ss", new Date());
                    return isYesterday(messageDate);
                });
            case 'last7days':
                const last7daysStart = subDays(currentDate, 8); // Start from 8 days ago to exclude today and yesterday
                const last7daysEnd = subDays(currentDate, 2); // End 2 days ago to exclude today and yesterday
                return messages.filter(message => {
                    const messageDate = parse(message.date, "MMMM d, yyyy, HH:mm:ss", new Date());
                    return isWithinInterval(messageDate, { start: last7daysStart, end: last7daysEnd });
                });
            case 'lastmonth':
                const lastMonthStart = startOfMonth(subMonths(currentDate, 1)); // Start of last month
                const lastMonthEnd = endOfMonth(subMonths(currentDate, 1)); // End of last month
                return messages.filter(message => {
                    const messageDate = parse(message.date, "MMMM d, yyyy, HH:mm:ss", new Date());
                    return isWithinInterval(messageDate, { start: lastMonthStart, end: lastMonthEnd });
                });
            default:
                return [];
        }
    };

    // Define the filters to be applied for the date filter
    const filters = [
        { label: 'Today', key: 'today' },
        { label: 'Yesterday', key: 'yesterday' },
        { label: 'Last 7 Days', key: 'last7days' }
    ];

    // Function to handle logout clear all the cookies, local storage and redirect to the home page
    const handleLogout = async () => {
        try {
            await logout();
            setIsLoggedIn(false);
            // localStorage.setItem('isLoggedIn', JSON.stringify(false));
            localStorage.removeItem("appState");
            localStorage.removeItem("userData");
            localStorage.removeItem("messageId");
            console.log('User logged out successfully');
            navigate("/");
        } catch (error) {
            console.error('Failed to logout user:', error);
            // Handle error
        }
    }


    return (
        <div className={`left bg-[#100027] transition-all duration-500 ${props.sidebarOpen ? 'w-1/5' : 'w-0'}`}>
            <div className='flex h-full flex-col relative'>
                <div
                    onClick={() => setNewChat(true)}
                    className={`flex items-center justify-between p-3 pl-3 m-3 cursor-pointer hover:bg-[#310273] rounded-full bg-[#100027]`} >
                    <div className='flex items-center justify-between gap-3'>
                        <Logo className='h-[40px] w-[40px] rounded-xl' />
                        <p className='font-primary2 font-semibold text-xl text-[#F3EBFF]'>Acharya</p>
                    </div>
                    <NewChatIcon />
                </div>
                <div className='flex flex-col gap-1 py-4 flex-grow overflow-auto ' style={{ overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {filters.map(({ label, key }) => (
                        <div key={key} className="mx-3 flex flex-col gap-1">
                            {filterMessages(key).length > 0 && <h3 className='mb-[-4px] ml-4 font-secondary2 font-extrabold text-[14px] text-nowrap  text-[#F3EBFF]'>{label}</h3>}
                            {filterMessages(key).length > 0 && <div className='flex flex-col gap-1 mb-4'>
                                {filterMessages(key).map(message => (
                                    <div className='hover:bg-[#310273] text-nowrap cursor-pointer py-1 px-3 rounded-full min-w-full w-[90%] text-white' key={message.id}>{message.name}</div>
                                ))}
                            </div>}
                        </div>
                    ))}
                </div>
                <div
                    ref={logoutPopupRef}
                    className={` m-[10px] mb-5 py-[10px] px-3 rounded-full flex w-[80%] text-nowrap  hover:bg-[#310273] cursor-pointer items-center
                        ${showLogoutPopup ? 'bg-[#3a0273]' : 'bg-[#100027]'}`}
                    onClick={logoutPopup}
                >
                    {(userData && userData.profilePic) ? (
                        <img src={userData.profilePic} referrerPolicy="no-referrer" alt="Profile Pic" className="h-8 w-8 rounded-full mr-2" />
                    ) : (
                        <UserProfile className="h-8 w-8 mr-2" />
                    )}
                    {(userData && userData.name) ? (
                        <div className='font-secondary2 font-semibold text-[#F3EBFF] overflow-auto select-none' style={{ overflowX: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>{userData.name}</div>
                    ) : (
                        <div className='font-secondary2 font-semibold text-[#F3EBFF] overflow-auto select-none' style={{ overflowX: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>User</div>
                    )}
                </div>
                {
                    showLogoutPopup &&
                    <div className='absolute bottom-[70px] w-[100%] transition ease-in-out delay-150 duration-300'>
                        <div
                            className='bg-[#6b01ff] m-2 flex items-center gap-2 p-5 rounded-xl cursor-pointer'
                            onClick={() => handleLogout()}
                        >
                            <Logout className=' h-[25px] w-[25px] text-white' />
                            <p className='font-secondary2 font-semibold text-white '>Logout</p>
                        </div>
                    </div>

                }
            </div>

            <button onClick={props.toggleSidebar} className={`absolute bottom-6 transition-all duration-500 z-20 ${props.sidebarOpen ? 'left-[17%]' : 'left-2'}`}>
                {props.sidebarOpen ? <LeftIcon className='fill-[#61596D] h-[40px] w-[40px]' /> : <RightIcon className='fill-[#61596D] h-[40px] w-[40px]' />}
            </button>
        </div>
    );

}

export default Sidebar;