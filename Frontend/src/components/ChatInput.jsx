import React, { useEffect, useRef, useState } from 'react';
import EnterButton from "../images/Enter-button.svg";

const ChatInput = ({ onSendMessage, inputDisabled, themeColors }) => {
    const textAreaRef = useRef(null);
    const [inputText, setInputText] = useState('');

    function handleChange(event) {
        setInputText(event.target.value);
    }

    function handleClick() {
        onSendMessage(inputText);
        setInputText("");
    }

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    }, [inputText]);

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
    }, []);

    return (
        <div className="flex items-end gap-5 h-full">
            <textarea
                placeholder="Type your message in hindi ex Mera naam... ctrl + G to stop translate"
                value={inputText}
                onChange={handleChange}
                disabled={inputDisabled}
                className={`chat-input ${themeColors.bg} ${themeColors.txt}`}
                style={{ width: "100%", border: `2px solid #7B29FF`, padding: "10px", borderRadius: "8px", outline: "none", "fontFamily":"Inter" }}
                rows={1}
                ref={textAreaRef}
                id="transliterateTextarea"
            />
            <button
                onClick={handleClick}
                disabled={inputDisabled}
            >
                <img src={EnterButton} alt="enter-button" className="h-[40px]" />
            </button>
        </div>
    );
};

export default ChatInput;
