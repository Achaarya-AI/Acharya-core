import React, { useState } from 'react'
import { ReactComponent as Logo } from '../images/Logo/Logo.svg';
import { ThreeDots } from 'react-loader-spinner';
import { ReactComponent as UserProfile } from '../images/HomeV2/Icons/userProfile.svg'

function ChatMessages({ text, isUser, isLoading, help, isFetching }) {
    const [reasoningToggle, setReasoningToggle] = useState(false)
    const userData = JSON.parse(localStorage.getItem('userData'));

    // Adding br in chatmessages 
    const formattedText = text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {index > 0 && <br />} {/* Add <br> after the first line */}
            {line}
        </React.Fragment>
    ));



    return (
        <div className=' w-full mb-4 '>
            <div >
                {!isUser && <div className={`flex justify-start w-[full]`}>
                    <div className='flex gap-3 w-[50%] items-end'>
                        <Logo className='h-8 w-8 rounded-full ' style={{ minWidth: '32px', minHeight: '32px' }} />
                        <div className={`relative flex h-full p-3 rounded-[25px] flex-grow ${isUser ? 'rounded-br-md' : 'rounded-bl-md'}`} style={{ backgroundColor: 'rgba(243, 235, 255, 0.25)' }}>
                            <div >
                                <h1 className='text-white text-[14px] mb-2 opacity-100 font-extrabold font-secondary2'>{isUser ? 'You ' : 'Acharya '}</h1>
                                {isFetching && <ThreeDots
                                    height="20"
                                    width="30"
                                    color={`text-white`} />}
                                <p className='text-white text-[14px] text-wrap mr-[40px]'>{formattedText}</p>
                            </div>
                            <div className='absolute right-3 h-7 w-7 bg-black '></div>
                        </div>
                    </div>
                </div>
                }
                {isUser && <div className={`flex justify-end w-full `}>
                    <div className='flex items-end gap-3 w-[50%] '>
                        <div className={` h-full p-3 rounded-[25px] w-full ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}`} style={{ backgroundColor: 'rgba(243, 235, 255, 0.25)' }}>
                            <h1 className='text-white text-[14px] mb-2 opacity-100 font-extrabold font-secondary2'>{isUser ? 'You ' : 'Acharya '}</h1>
                            <p className='text-white text-[14px]'>{formattedText}</p>
                        </div>
                        {/* <Logo className='h-[40px] w-[40px] rounded-full ' style={{ minWidth: '40px', minHeight: '40px' }} /> */}
                        {(userData && userData.profilePic) ? (
                            <img src={userData.profilePic} referrerPolicy="no-referrer" alt="Profile Pic" className="h-8 w-8 rounded-full mr-2" />
                        ) : (
                            <UserProfile className="h-8 w-8 mr-2" />
                        )}
                    </div>
                </div>
                }
            </div>
        </div>
    )
}

export default ChatMessages