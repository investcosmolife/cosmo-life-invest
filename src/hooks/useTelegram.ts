
import { useEffect, useState } from 'react';
import { TelegramUser } from '@/types/telegram';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTelegram = () => {
      try {
        console.log('Initializing Telegram...', {
          hasTelegram: !!window.Telegram,
          hasWebApp: !!window.Telegram?.WebApp,
          userAgent: navigator.userAgent,
          location: window.location.href
        });

        // Проверяем наличие Telegram WebApp
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          console.log('Telegram WebApp detected', {
            version: tg.version,
            platform: tg.platform,
            initData: tg.initData,
            initDataUnsafe: tg.initDataUnsafe
          });
          
          // Инициализируем WebApp
          tg.ready();
          tg.expand();
          
          // Получаем данные пользователя
          const userData = tg.initDataUnsafe?.user;
          if (userData) {
            console.log('User data found:', userData);
            setUser(userData);
          } else {
            console.log('No user data in initDataUnsafe');
            // В development режиме создаем фиктивного пользователя
            if (import.meta.env.DEV) {
              console.log('Development mode: creating mock user');
              setUser({
                id: 123456789,
                is_bot: false,
                first_name: 'Test',
                last_name: 'User',
                username: 'testuser'
              });
            }
          }
          
          setIsLoading(false);
          return;
        }

        // Проверяем другие признаки Telegram среды
        const isTelegramUA = navigator.userAgent.includes('Telegram');
        const hasTelemgramParams = window.location.search.includes('tgWebApp');
        const isTelegramReferrer = document.referrer.includes('t.me');

        console.log('Telegram environment check:', {
          isTelegramUA,
          hasTelemgramParams,
          isTelegramReferrer,
          referrer: document.referrer
        });

        if (isTelegramUA || hasTelemgramParams || isTelegramReferrer) {
          console.log('Telegram environment detected via alternative method');
        } else {
          console.log('Running in development/web mode');
          // В development режиме создаем фиктивного пользователя
          if (import.meta.env.DEV) {
            console.log('Development mode: creating mock user');
            setUser({
              id: 123456789,
              is_bot: false,
              first_name: 'Test',
              last_name: 'User',
              username: 'testuser'
            });
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Telegram:', error);
        setIsLoading(false);
      }
    };

    // Небольшая задержка для инициализации Telegram
    const timeout = setTimeout(initializeTelegram, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  const showAlert = (message: string) => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.showAlert) {
        tg.showAlert(message);
      } else {
        alert(message);
      }
    } catch (error) {
      console.error('Error showing alert:', error);
      alert(message);
    }
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.showConfirm) {
        tg.showConfirm(message, callback);
      } else {
        const confirmed = confirm(message);
        callback(confirmed);
      }
    } catch (error) {
      console.error('Error showing confirm:', error);
      const confirmed = confirm(message);
      callback(confirmed);
    }
  };

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(type);
      }
    } catch (error) {
      console.error('Error with haptic feedback:', error);
    }
  };

  const notificationFeedback = (type: 'error' | 'success' | 'warning') => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred(type);
      }
    } catch (error) {
      console.error('Error with notification feedback:', error);
    }
  };

  const isTelegramEnvironment = () => {
    return !!(
      window.Telegram?.WebApp ||
      navigator.userAgent.includes('Telegram') ||
      window.location.search.includes('tgWebApp') ||
      (document.referrer && document.referrer.includes('t.me'))
    );
  };

  return {
    user,
    isLoading,
    showAlert,
    showConfirm,
    hapticFeedback,
    notificationFeedback,
    tg: window.Telegram?.WebApp,
    isTelegramEnvironment: isTelegramEnvironment()
  };
};
