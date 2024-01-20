import { useState, useEffect } from 'react';

import { requireAuth } from '../util';
import { useAppState } from '../AppStateContext';
import { useNavigate } from 'react-router-dom';
import ChatMessages from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
import { getResponse } from '../api';



function Home() {
    const { input, setInput, messages, setMessages } = useAppState()
    const [loading, setLoading] = useState(false);
    const [fetchData, setFetchingData] = useState(false)
    const [partialMessage, setPartialMessage] = useState('');
    const [inputDisabled, setInputDisabled] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            try {
                await requireAuth(input);
            } catch (path) {
                setTimeout(() => {
                    navigate(path);
                }, 500);

            }
        }

        checkAuth();
    }, [input.subject]);

    

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
                })) ;

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

    // console.log("loading state", loading)
    // console.log("message", messages)


    return (
        <div className="content bg-secondary-bg font-secondary ">
            <section className="content w-full flex flex-col justify-end gap-5">
                <div className="h-[100%] flex flex-col-reverse justify-start chat-display overflow-y-auto gap-[40px]">
                    {loading && <ChatMessages text={partialMessage} isUser={false} isFetching={fetchData}/>}
                    {messages.map((message, index) => (

                        <ChatMessages key={index} text={message.text} isUser={message.isUser} isLoading={loading} help={message.reasoning}/>
                    ))}
                </div>
                <div className='h-full bg-primary rounded-lg p-5'>
                    <ChatInput onSendMessage={handleSendMessage} inputDisabled={inputDisabled} />
                </div>
            </section>
        </div>
    )
}

export default Home;