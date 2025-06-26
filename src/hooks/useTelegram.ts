
import { useEffect, useState } from 'react';
import { TelegramUser } from '@/types/telegram';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg && tg.initData) {
      tg.ready();
      tg.expand();
      
      const userData = tg.initDataUnsafe?.user;
      if (userData) {
        setUser(userData);
      }
      
      setIsLoading(false);
    } else {
      // Проверяем, есть ли хотя бы объект Telegram
      if (window.Telegram) {
        // Возможно, приложение еще не полностью инициализировано
        setTimeout(() => {
          const tg = window.Telegram?.WebApp;
          if (tg) {
            tg.ready();
            tg.expand();
            const userData = tg.initDataUnsafe?.user;
            if (userData) {
              setUser(userData);
            }
          }
          setIsLoading(false);
        }, 1000);
      } else {
        // Полностью вне Telegram - только для разработки
        console.log('Running outside Telegram environment');
        setIsLoading(false);
      }
    }
  }, []);

  const showAlert = (message: string) => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.showAlert) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.showConfirm) {
      tg.showConfirm(message, callback);
    } else {
      const confirmed = confirm(message);
      callback(confirmed);
    }
  };

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(type);
    }
  };

  const notificationFeedback = (type: 'error' | 'success' | 'warning') => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.HapticFeedback) {
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
