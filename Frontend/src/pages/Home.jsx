import { useState, useEffect } from 'react';

import { requireAuth, requireConfig } from '../util';
import { useAppState } from '../AppStateContext';
import { useNavigate } from 'react-router-dom';
import ChatMessages from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
import { getResponse } from '../api';



function Home() {
    const { input, setInput, messages, setMessages, darkTheme, isLoggedIn, setIsLoggedIn } = useAppState()
    const [loading, setLoading] = useState(false);
    const [fetchData, setFetchingData] = useState(false)
    const [partialMessage, setPartialMessage] = useState('');
    const [inputDisabled, setInputDisabled] = useState(false);

    const navigate = useNavigate();

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

    console.log("darkTHeme", darkTheme)
    console.log("messages", messages)


    useEffect(() => {
        async function checkAuth() {
            try {
                console.log("top")
                await requireAuth(isLoggedIn);
                await requireConfig(input)
                console.log("bottom")
            } catch (path) {
                if (!isLoggedIn) {
                    navigate(path)
                } else {
                    setTimeout(() => {
                        navigate(path);
                    }, 500);
                }


            }
        }

        checkAuth();
    }, [isLoggedIn, input.subject]);

    const handleSendMessage = async (text) => {
        if (text.trim() !== '') {
            // Store the user message separately
            const userMessage = { text, isUser: true, reasoning: [] };

            setMessages([userMessage, ...messages]);
            setLoading(true);
            setFetchingData(true)
            setInputDisabled(true);

            try {
                const response = await getResponse(text);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }

                const data = await response.json()
                setFetchingData(false)
                const modelResponse = data.response;
                const modelReasoning = data.reasoning.source_documents;

                const reasoning = modelReasoning?.map(doc => ({
                    page_content: doc.page_content || '',
                    metadata: doc.metadata || {}
                }));

                console.log(data)

                const words = modelResponse.split(' ');
                let partialMessage = words.slice(0, 10).join(' ');

                const interval = setInterval(() => {
                    const remainingWords = words.slice(partialMessage.split(' ').length);
                    const nextWord = remainingWords.shift();
                    if (nextWord) {
                        partialMessage += ' ' + nextWord;
                        setPartialMessage(partialMessage);
                    } else {
                        clearInterval(interval);
                        setPartialMessage('');
                        // Now update the state with both user and model responses

                        setMessages([
                            { text: modelResponse, isUser: false, reasoning: reasoning },
                            userMessage,
                            ...messages,
                        ]);
                        setLoading(false);
                        setInputDisabled(false);
                    }
                }, 50);

                // Add a timeout to wait for the interval to finish
                await new Promise(resolve => setTimeout(resolve, words.length * 50));

            } catch (error) {
                console.log("Error:", error.message)
            } finally {
                setLoading(false);
                setInputDisabled(false);
            }
        }
    };


    if (!isLoggedIn) {
        return null
    }

    return (
        <div className={`content ${themeColors.bg2} font-secondary`}>
            <section className="content w-full flex flex-col justify-end gap-5">
                <div className="h-[100%] flex flex-col-reverse justify-start chat-display overflow-y-auto gap-[40px]">
                    {loading && <ChatMessages text={partialMessage} isUser={false} isFetching={fetchData} themeColors={themeColors} />}
                    {messages.map((message, index) => (

                        <ChatMessages key={index} text={message.text} isUser={message.isUser} isLoading={loading} help={message.reasoning} themeColors={themeColors} />
                    ))}
                </div>
                <div className={`h-full ${themeColors.bg} bg-primary rounded-lg p-5 shadow-custom`}>
                    <ChatInput onSendMessage={handleSendMessage} inputDisabled={inputDisabled} themeColors={themeColors} />
                </div>
            </section>
        </div>

    )
}

export default Home;