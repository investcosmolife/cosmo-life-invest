
import { useEffect, useState } from 'react';
import { TelegramUser } from '@/types/telegram';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      tg.ready();
      tg.expand();
      
      const userData = tg.initDataUnsafe?.user;
      if (userData) {
        setUser(userData);
      }
      
      setIsLoading(false);
    } else {
      // For development/testing outside Telegram
      setUser({
        id: 123456789,
        is_bot: false,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        language_code: 'ru'
      });
      setIsLoading(false);
    }
  }, []);

  const showAlert = (message: string) => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.showConfirm(message, callback);
    } else {
      const confirmed = confirm(message);
      callback(confirmed);
    }
  };

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.HapticFeedback.impactOccurred(type);
    }
  };

  const notificationFeedback = (type: 'error' | 'success' | 'warning') => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.HapticFeedback.notificationOccurred(type);
    }
  };

  return {
    user,
    isLoading,
    showAlert,
    showConfirm,
    hapticFeedback,
    notificationFeedback,
    tg: window.Telegram?.WebApp
  };
};
