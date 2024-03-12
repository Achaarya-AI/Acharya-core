import React from 'react'
import ChatInput from './ChatInputV2';
import LayoutDesign from '../images/HomeV2/layoutDesign/layoutDesign.png';
import { ReactComponent as Logo } from '../images/Logo/Logo.svg';
import { ReactComponent as NewChatIcon } from '../images/HomeV2/Icons/newChat.svg';
import NewChat from './NewChat';
import ChatMessages from './ChatMessagesV2';
import { useAppState } from '../AppStateContext';

function Chat({ onSendMessage, onSendConfig }) {
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
    // console.log("statuses in Chat.jsx", states)
    // console.log("messages in Chat.jsx", messages)
    // console.log("inputDisabled in Chat.jsx", inputDisabled)

    return (
        <div className={`right z-10 bg-[#13002D] transition-all duration-500 ${sidebarOpen ? 'w-4/5' : 'w-screen'} overflow-hidden`}>
            <div className={`relative flex h-screen w-full text-noselect`}>
                <img src={LayoutDesign} alt='design' className='absolute bottom-0 w-full' />
                {!sidebarOpen && <div className='absolute top-3 right-10 w-[250px] flex items-center justify-between p-3 pl-3 m-3 ' >
                    <div className='flex items-center justify-between gap-3'>
                        <Logo className='h-[40px] w-[40px] rounded-xl' />
                        <p className='font-primary2 font-semibold text-xl text-[#F3EBFF]'>Acharya</p>
                    </div>
                    <div 
                    className=' cursor-pointer hover:bg-[#310273] rounded-full p-4' 
                    onClick={() => setNewChat(true)}>
                        <NewChatIcon className='h-[25px] w-[25px]' />
                    </div>
                </div>}
                <div className=' absolute top-0 pt-[100px] pb-5 left-1/2 transform -translate-x-1/2 max-w-[1366px] w-[70vw] h-screen flex flex-col justify-end gap-5 z-20'>
                    <div className='flex flex-col h-full relative justify-end'>
                        {newChat ?
                            <NewChat onSendConfig={onSendConfig} />
                            : <div className='flex flex-col-reverse overflow-auto  mb-20'>
                                {generateMessage && <ChatMessages text={partialMessage} isUser={false} isFetching={fetchData} />}
                                {messages?.map((message, index) => (
                                    <ChatMessages key={index} text={message.text} isUser={message.isUser} isLoading={generateMessage} help={message.reasoning} />
                                ))}
                            </div>}
                        <div className=''>
                            <ChatInput newChat={newChat} onSendMessage={onSendMessage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat