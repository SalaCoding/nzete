// contexts/ReplyContext.js
import { createContext, useContext, useState } from 'react';

const ReplyContext = createContext();

export function ReplyProvider({ children }) {
  const [activeReplyId, setActiveReplyId] = useState(null);
  return (
    <ReplyContext.Provider value={{ activeReplyId, setActiveReplyId }}>
      {children}
    </ReplyContext.Provider>
  );
}

export function useReplyContext() {
  return useContext(ReplyContext);
}
