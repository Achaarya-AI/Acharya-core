
import Sidebar from '../components/Sidebar';
import React, { useState, useEffect } from 'react';
import { requireAuth, requireConfig } from '../util';
import { useAppState } from '../AppStateContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReactComponent as NewChatIcon } from '../images/HomeV2/Icons/newChat.svg'
import { ReactComponent as Logo } from '../images/Logo/Logo.svg'
import { getResponse } from '../api';
import { config } from '../api';

import Chat from '../components/Chat';

function HomeV2() {
    const {
        input, setInput,
        partialMessage, setPartialMessage,
        newChat, setNewChat,
        sidebarOpen, setSidebarOpen,
        inputDisabled, setInputDisabled,
        messages, setMessages,
        darkTheme, setDarkTheme,
        isLoggedIn, setIsLoggedIn,
        generateMessage, setGenerateMessage,
        generateConfig, setGenerateConfig,
        fetchData, setFetchData,
    } = useAppState()
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();




    // console.log(partialMessage, "partialMessage")

    useEffect(() => {
        async function checkAuth() {
            try {
                // console.log("top")
                // console.log("HomeV2 is LoggedIn", isLoggedIn)
                await requireAuth(isLoggedIn);
                // await requireConfig(input)

                if (newChat) {
                    setInputDisabled(true)
                }
                else {
                    // making sure the response for the syllabus is loaded
                    if (generateConfig) {
                        setInputDisabled(true)
                    } else {
                        setInputDisabled(false)
                    }
                }
                // console.log("bottom")
            } catch (path) {
                if (!isLoggedIn) {
                    navigate(path)
                } else {
                    // navigate(path)
                    setNewChat(true)
                    console.log("requireConfiggg")
                }
            }
        }
        checkAuth();
    }, [isLoggedIn, newChat, input]);


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };


    const handleConfigSubmit = async () => {
        try {

            setGenerateConfig(true);
            setGenerateMessage(true);
            setFetchData(true)
            setInputDisabled(true);

            console.log("Input from NewChat.jsx:", input)
            const userData = JSON.parse(localStorage.getItem('userData'));

            try {
                await requireConfig(input)
                setNewChat(false)

            } catch (path) {
                console.log("requireConfig error", path)
                navigate(path)
                return;
            }
            console.log("inputDisabled in HomeV2", inputDisabled)
            const response = await config(input, localStorage.getItem('messageId'), userData.email);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data.response)
            setFetchData(false)
            const modelResponse = await data.response;


            const words = modelResponse.split(' ');
            const firstTenWords = words.slice(0, 10).join(' ');
            const remainingWords = words.slice(10).join(' ');

            setPartialMessage(firstTenWords);

            let index = 10;

            const interval = setInterval(() => {
                setPartialMessage(prevPartialMessage => {
                    if (index >= words.length) {
                        clearInterval(interval);
                        setGenerateMessage(false);
                        setPartialMessage('');
                        setMessages([{ text: data.response, isUser: false, reasoning: data.reasoning, feedback: 0 }, ...messages]);
                        setInput({
                            class: 8,
                            subject: "",
                        })
                        setGenerateConfig(false)
                    }
                    return prevPartialMessage + (index === 10 ? ' ' : ' ') + words[index++];
                });
            }, 30);

            // Add a timeout to wait for the interval to finish
            await new Promise(resolve => setTimeout(resolve, words.length * 30));

        } catch (error) {

            console.error("Error:", error.message);
            setIsLoggedIn(false);
        }
        finally {
            setGenerateConfig(false)
            setGenerateMessage(false);
            console.log("inputDisabled in HomeV2", inputDisabled)
        }
    }


    const handleSendMessage = async (text) => {
        if (text.trim() !== '') {
            // Store the user message separately
            const userMessage = { text, isUser: true };

            setMessages([userMessage, ...messages]);
            setGenerateMessage(true);
            setFetchData(true)
            setInputDisabled(true);

            try {
                const userData = JSON.parse(localStorage.getItem('userData'));
                const response = await getResponse(text, localStorage.getItem('messageId'), userData.email);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }

                const data = await response.json()
                setFetchData(false)
                const modelResponse = data.response;
                const modelReasoning = data.reasoning.source_documents;

                const reasoning = modelReasoning?.map(doc => ({
                    page_content: doc.page_content || '',
                    metadata: doc.metadata || {}
                }));

                // console.log(data)

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
                            { text: modelResponse, isUser: false, reasoning: reasoning, feedback: 0 },
                            userMessage,
                            ...messages,
                        ]);
                        setGenerateMessage(false);
                        setInputDisabled(false);
                    }
                }, 50);

                // Add a timeout to wait for the interval to finish
                await new Promise(resolve => setTimeout(resolve, words.length * 50));

            } catch (error) {
                // console.log("Error:", error.message)
            } finally {
                setGenerateMessage(false);
                setInputDisabled(false);
            }
        }
    };

    return (
        <div className='w-screen h-screen flex overflow-hidden'>
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <Chat onSendConfig={handleConfigSubmit} onSendMessage={handleSendMessage} />
        </div>
    );
}

export default HomeV2;

