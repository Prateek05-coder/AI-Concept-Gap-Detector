import { useState, useEffect } from 'react';

const SESSION_KEY = 'learning_debugger_session_id';

export function useSession() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    let stored = localStorage.getItem(SESSION_KEY);
    if (!stored) {
      stored = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, stored);
    }
    setSessionId(stored);
  }, []);

  return sessionId;
}
