import React, { useEffect, useRef, useState } from 'react';
import EnterButton from "../images/Enter-button.svg"

const ChatInput = ({ onSendMessage, inputDisabled }) => {
    const textAreaRef = useRef(null)
    const [inputText, setInputText] = useState('');

    // console.log(textAreaRef.current.style?.height)
    // console.log(textAreaRef.current.scrollHeight)

    function handleChange(event) {
        setInputText(event.target.value);
    }

    function handleClick() {
        onSendMessage(inputText)
        setInputText("")
    }

    useEffect(() => {


        textAreaRef.current.style.height = "auto"
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";


    }, [inputText])

    return (
        <div className="flex items-end gap-5 h-full">
            <textarea
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => handleChange(e)}
                disabled={inputDisabled}
                className="chat-input bg-primary text-white border-2 border-solid border-secondary  w-full p-2 rounded-lg active:bg-none focus:outline-none"
                rows={1}
                ref={textAreaRef}
            />
            <button
                onClick={handleClick}
                disabled={inputDisabled}
            >
            <img src={EnterButton} alt="enter-button" className='h-[40px]'/>                   
           </button>
        </div>
    );
};

export default ChatInput;