import React, { createContext, useContext, useEffect, useState } from 'react';

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [input, setInput] = useState({
    class: 8,
    subject: ''
  });
  const [partialMessage, setPartialMessage] = useState('');
  const [newChat, setNewChat] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [darkTheme, setDarkTheme] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [generateMessage, setGenerateMessage] = useState(false);
  const [generateConfig, setGenerateConfig] = useState(false);
  const [fetchData, setFetchData] = useState(false);

  // Load state from localStorage on initial render
  useEffect(() => {
    const storedState = localStorage.getItem('appState');
    if (storedState) {
      const parsedState = JSON.parse(storedState);

      setInput(parsedState.input || input);
      setPartialMessage(parsedState.partialMessage || partialMessage);
      setNewChat(parsedState.newChat || newChat);
      setSidebarOpen(parsedState.sidebarOpen || sidebarOpen);
      setInputDisabled(parsedState.inputDisabled || inputDisabled);
      setMessages(parsedState.messages || messages);
      setDarkTheme(parsedState.darkTheme || darkTheme);
      setIsLoggedIn(parsedState.isLoggedIn || isLoggedIn);
      setGenerateMessage(parsedState.generateMessage || generateMessage);
      setGenerateConfig(parsedState.generateConfig || generateConfig);
      setFetchData(parsedState.fetchData || fetchData);

      console.log("Initial render")
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'appState',
      JSON.stringify({ input, partialMessage, newChat,sidebarOpen, inputDisabled, messages, darkTheme, isLoggedIn, generateMessage, generateConfig, fetchData,  })
    );
  }, [input,partialMessage, newChat, sidebarOpen, inputDisabled,messages, darkTheme, isLoggedIn, generateMessage, generateConfig, fetchData, ]);

  return (
    <AppStateContext.Provider
      value={{
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
      }}
    >

      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
