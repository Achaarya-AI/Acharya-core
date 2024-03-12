import { Navigate, json, redirect, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppState } from '../AppStateContext';
import Dropdown from '../components/Form/Dropdown';

import { config } from '../api';

export default function Settings() {
    const [searchParams, setSearchParams] = useSearchParams()
    const {darkTheme, setIsLoggedIn} = useAppState()
    const { messages, setMessages } = useAppState()
    const message = searchParams.get("message")
    const { input, setInput } = useAppState();
    const navigate = useNavigate();

    const classArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const subjectsArray = [
        'Mathematics',
        'Science',
        'Hindi',
        'History',
        'Geography',
    ];

    const themeColors = darkTheme === true ? {
        "bg": "bg-primary-dark",
        "bg2": "bg-secondary-bg-dark",
        "bgs": "bg-secondary",
        "chatbg": "bg-chat-bg-dark",
        "reasonbg": "bg-reason-dark",
        "txt" : "text-white",
        "color": "white",
        "reasonIcon" : "fill-white",
    } : {
        "bg": "bg-primary", 
        "bg2": "bg-secondary-bg",
        "bgs": "bg-secondary",
        "chatbg": "bg-chat-bg",
        "reasonbg": "bg-reason",
        "txt" : "text-reason-dark",
        "color": "black",
        "reasonIcon" : "fill-dark",
    }

    // console.log(input)


    function handleSubmit(event) {
        event.preventDefault()

        const submit = async () => {
            try {
                console.log(input)
                const userData = JSON.parse(localStorage.getItem('userData'));
                const response = await config(input, localStorage.getItem('messageId'), userData.email);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setMessages([{ text: data.response, isUser: false, reasoning: data.reasoning, feedback: 0 }, ...messages]);
            } catch (error) {
                console.error("Error:", error.message);
                setIsLoggedIn(false);
                // localStorage.setItem('isLoggedIn', JSON.stringify(false));
                navigate("/")
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
        <div className={`${themeColors.bg2}`}>
            <section className="content settings">
                <div className='flex justify-center items-center'>
                    <div className={`w-full max-w-[600px] md:mt-[30px] p-[25px] ${themeColors.bg} rounded-lg shadow-custom`}>
                        {message && <h1 className={`${themeColors.txt} mb-5 font-semibold`}>{message}!!</h1>}
                        <form onSubmit={handleSubmit}>
                            <div className="relative py-[20px] border-t border-line-breaks border-opacity-61 pb-[30px]">
                                <p className={`absolute px-3 top-[-8px] left-[30px] text-xs text-line-texts ${themeColors.bg}`}>Class</p>
                                <div className="flex flex-col" >
                                    <p className={`${themeColors.txt} py-3`}>Select the Class</p>
                                    <Dropdown
                                        items={classArray.map((classItem) => classItem)}
                                        label="Select Class"
                                        themeColors={themeColors}
                                        type={"class"}
                                    />
                                </div>
                            </div>
                            <div className="relative py-[20px] border-y border-line-breaks border-opacity-61 pb-[30px]">
                                <p className={`absolute px-3 top-[-8px] left-[30px] text-xs text-line-texts ${themeColors.bg}`}>Subject</p>
                                <div className="flex flex-col" >
                                    <p className={`${themeColors.txt} py-3`}>Select the Subject</p>
                                    <Dropdown
                                        items={subjectsArray.map((Subject) => `${Subject}`)}
                                        label="Select Subject"
                                        themeColors={themeColors}
                                        type={"subject"}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-5">
                                <button
                                    type="button"
                                    className={`max-w-[100px] w-[100%] mt-5 ${themeColors.txt} border-2 border-solid border-secondary py-2 px-4 rounded-lg`}
                                    onClick={handleReset}>Reset</button>
                                <button
                                    className={`max-w-[100px] w-[100%] mt-5 ${themeColors.txt} bg-secondary py-2 px-4 rounded-lg`}
                                >Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}