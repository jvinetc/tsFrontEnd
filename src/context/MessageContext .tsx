import { createContext, useContext, useState } from 'react';

interface Message {
  text: string;
  type?: 'success' | 'error' | 'info';
}

const MessageContext = createContext<{
  message: Message | null;
  showMessage: (msg: Message) => void;
}>({
  message: null,
  showMessage: () => {},
});

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState<Message | null>(null);

  const showMessage = (msg: Message) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000); // auto-hide
  };

  return (
    <MessageContext.Provider value={{ message, showMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);