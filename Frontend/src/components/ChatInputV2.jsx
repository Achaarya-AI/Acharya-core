import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as SubmitButton } from '../images/HomeV2/Icons/submitButton.svg';
import { useAppState } from '../AppStateContext';

function ChatInput({ onSendMessage, }) {
    const { newChat, inputDisabled, setInputDisabled } = useAppState();
    const textAreaRef = useRef(null);
    const [inputText, setInputText] = useState('');

    console.log("inputDisabled in ChatInput", inputDisabled);

    // handleChange function is used to update the inputText
    function handleChange(event) {
        setInputText(event.target.value);
    }

    // hadleClick function is used to send the message
    function handleClick() {
        onSendMessage(inputText);
        setInputText("");
    }

    // useEffect is used to update the height of the textarea
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    }, [inputText]);

    // useEffect is used to load the Google Transliterate API and clear the input text on newChat
    useEffect(() => {
        const onLoad = () => {
            const options = {
                // eslint-disable-next-line no-undef
                sourceLanguage: google.elements.transliteration.LanguageCode.ENGLISH,
                // eslint-disable-next-line no-undef
                destinationLanguage: [google.elements.transliteration.LanguageCode.HINDI],
                shortcutKey: 'ctrl+g',
                transliterationEnabled: true
            };
            // eslint-disable-next-line no-undef
            const control = new google.elements.transliteration.TransliterationControl(options);
            control.makeTransliteratable(['transliterateTextarea']);

        };

        // Ensure that the Google Transliterate API is loaded before calling onLoad
        if (typeof google !== 'undefined') {

            onLoad();
        }

        // If newChat is true, clear the input text
        if (newChat) {
            setInputText("")
        }

    }, [newChat]);

    return (
        <div className='relative flex justify-between items-end h-full w-full pr-4 bg-[#F3EBFF] rounded-[30px] '>
            <textarea
                placeholder='Ask Acharya...'
                value={inputText}
                onChange={handleChange}
                disabled={inputDisabled}
                className="min-h-[55px] h-full max-h-[175px] w-[95%] p-2 outline-none bg-transparent py-5 pl-4"
                style={{ color: "#310273", fontWeight: "500" }}
                rows={1}
                ref={textAreaRef}
                id="transliterateTextarea"
            ></textarea>
            <SubmitButton className={`mb-[0.875rem] w-8 h-8 ${inputDisabled ? "cursor-not-allowed fill-[#61596D]" : "cursor-pointer fill-[#310273]"} `}
                onClick={() => handleClick()}
            />
        </div>
    )
}

export default ChatInput