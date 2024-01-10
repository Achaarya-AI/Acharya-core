import { createContext, useContext, useState } from 'react';

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {

  const [input, setInput] = useState({
    messages: "",
    class: 8,
    subject: ""
  });

  const [messages, setMessages] = useState([]);

  return (
    <AppStateContext.Provider value={{ input, setInput, messages, setMessages }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
