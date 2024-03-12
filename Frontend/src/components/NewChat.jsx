import React, { useEffect, useState } from 'react'
import { useAppState } from '../AppStateContext';

import { useNavigate } from 'react-router-dom';
import Dropdown from './Form/Dropdown';
import { ReactComponent as ChevronRightIcon } from '../images/Landing Page/Icons/chevron_right.svg'
import { requireConfig } from '../util';


function NewChat({ onSendConfig }) {
    const { input, setInput, messages, setMessages, setIsLoggedIn, setNewChat, generateConfig } = useAppState()
    const navigate = useNavigate();

    const classArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const subjectsArray = [
        'Mathematics',
        'Science',
        'Hindi',
        'History',
        'Geography',
    ];


    return (
        <div
            className='flex flex-col flex-grow text-white  mb-20'>
            <div className='relative h-full w-full '>
                <div className='relative top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2
                    flex flex-col justify-center items-center w-[500px] '>
                    <h1 className='text-[42px] font-primary2 font-semibold text-wrap leading-snug text-center px-4'>What Shall We Learn Today?</h1>
                    <div
                        className='flex flex-col items-center w-full px-[20px] pt-6 gap-5'>
                        <div className="flex flex-col w-full" >
                            <p className={`pl-5 pt-9 pb-1 text-white font-secondary2`}>Select Class</p>
                            <Dropdown
                                items={classArray.map((classItem) => classItem)}
                                label="Class"
                                type={"class"}
                            />
                        </div>
                        <div className="flex flex-col w-full" >
                            <p className={`pl-5 pt-5 pb-1 text-white font-secondary2`}>Select Subject</p>
                            <Dropdown
                                items={subjectsArray.map((Subject) => `${Subject}`)}
                                label="Subject"
                                type={"subject"}
                            />
                        </div>
                        <button className="relative cursor-pointer mt-4 " disabled={generateConfig} onClick={() => onSendConfig()}>
                            <div className={`relative rounded-3xl blur-[1px]  ${input.subject === "" || generateConfig ? 'bg-slate-400' : 'bg-[#04D99D]'}  h-[50px] w-[220px]`}></div>
                            <div className='relative mt-[-45px] ml-[15px]  flex items-center justify-center ' >
                                <div className='text-[20px] font-tertiary2 font-semibold text-[#13002D]'>Start Learning</div>
                                <ChevronRightIcon className='fill-[#13002D]' />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewChat