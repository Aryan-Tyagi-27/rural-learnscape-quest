import { useState, useEffect } from "react";

export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Also check network connection periodically
    const checkConnection = async () => {
      try {
        const response = await fetch('/ping', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        setIsOffline(!response.ok);
      } catch {
        setIsOffline(true);
      }
    };

    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return isOffline;
};