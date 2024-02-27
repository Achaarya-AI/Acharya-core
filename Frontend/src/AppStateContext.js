import React, { createContext, useContext, useEffect, useState } from 'react';

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [input, setInput] = useState({
    messages: '',
    class: 8,
    subject: ''
  });

  const [messages, setMessages] = useState([]);
  const [darkTheme, setDarkTheme] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load state from localStorage on initial render
  useEffect(() => {
    const storedState = localStorage.getItem('appState');
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      setInput(parsedState.input || input);
      setMessages(parsedState.messages || messages);
      setDarkTheme(parsedState.darkTheme || darkTheme);
      setIsLoggedIn(parsedState.isLoggedIn || isLoggedIn);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'appState',
      JSON.stringify({ input, messages, darkTheme, isLoggedIn })
    );
  }, [input, messages, darkTheme, isLoggedIn]);

  return (
    <AppStateContext.Provider
      value={{ input, setInput, messages, setMessages, darkTheme, setDarkTheme, isLoggedIn, setIsLoggedIn }}
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
