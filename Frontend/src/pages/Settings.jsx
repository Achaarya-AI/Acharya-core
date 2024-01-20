import { Navigate, json, redirect, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppState } from '../AppStateContext';
import Dropdown from '../components/Form/Dropdown';

import { config } from '../api';

export default function Settings() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { messages, setMessages } = useAppState()
    const message = searchParams.get("message")
    const { input, setInput } = useAppState();
    const navigate = useNavigate();

    const classArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const subjectsArray = [
        'Mathematics',
        'Science',
        'Social Science',
        'Agriculture',
        'Drawing',
        'Home Science',
        'Music Vocal'
    ];

    // console.log(input)


    function handleSubmit(event) {
        event.preventDefault()

        const submit = async () => {
            try {
                const response = await config(input);
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json();
                setMessages([{ text: data.response, isUser: false, reasoning: data.reasoning }, ...messages]);
            } catch (error) {
                console.error("Error:", error.message);
            }
        }

        submit()
        navigate("/");
    }

    function handleReset(event) {
        event.preventDefault()
        setInput({
            messages: "",
            class: 8,
            subject: "",
        })

    }
    console.log(input)

    return (
        <section className="content settings">
            <div className='flex justify-center items-center'>
                <div className="w-full max-w-[600px] md:mt-[30px] p-[25px] bg-primary rounded-lg">
                    {message && <h1 className='text-white mb-5 font-semibold'>{message}!!</h1>}
                    <form onSubmit={handleSubmit}>
                        <div className="relative py-[20px] border-t border-[#848484] border-opacity-61 pb-[30px]">
                            <p className='absolute px-3 top-[-8px] left-[30px] text-xs text-[#b5b5b5] bg-primary '>Class</p>
                            <div className="flex flex-col" >
                                <p className="text-white py-3">Select the Class</p>
                                <Dropdown
                                    items={classArray.map((classItem) => classItem)}
                                    label="Select Class"
                                    type={"class"}
                                />
                            </div>
                        </div>
                        <div className="relative py-[20px] border-y border-[#848484] border-opacity-61 pb-[30px]">
                            <p className="absolute px-3 top-[-8px] left-[30px] text-xs text-[#b5b5b5] bg-primary">Subject</p>
                            <div className="flex flex-col" >
                                <p className="text-white py-3">Select the Subject</p>
                                <Dropdown
                                    items={subjectsArray.map((Subject) => `${Subject}`)}
                                    label="Select Subject"
                                    type={"subject"}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-5">
                            <button
                                type="button"
                                className="max-w-[100px] w-[100%] mt-5 text-white border-2 border-solid border-secondary py-2 px-4 rounded-lg"
                                onClick={handleReset}>Reset</button>
                            <button
                                className="max-w-[100px] w-[100%] mt-5 text-white bg-secondary py-2 px-4 rounded-lg"
                            >Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}