
import { useEffect, useState } from 'react';
import { TelegramUser } from '@/types/telegram';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('useTelegram: Starting initialization...');
    
    const initializeTelegram = () => {
      try {
        console.log('useTelegram: Checking environment...', {
          hasTelegram: !!window.Telegram,
          hasWebApp: !!window.Telegram?.WebApp,
          isDev: import.meta.env.DEV,
          userAgent: navigator.userAgent.substring(0, 100)
        });

        // Сразу создаем тестового пользователя в dev режиме
        if (import.meta.env.DEV) {
          console.log('useTelegram: Development mode - creating test user');
          const testUser = {
            id: 123456789,
            is_bot: false,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser'
          };
          setUser(testUser);
          setIsLoading(false);
          console.log('useTelegram: Test user created successfully', testUser);
          return;
        }

        // Проверяем Telegram WebApp
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          console.log('useTelegram: Telegram WebApp found', {
            version: tg.version,
            platform: tg.platform
          });
          
          tg.ready();
          tg.expand();
          
          const userData = tg.initDataUnsafe?.user;
          if (userData) {
            console.log('useTelegram: Real user data found', userData);
            setUser(userData);
          } else {
            console.log('useTelegram: No user data, creating fallback');
            setUser({
              id: 987654321,
              is_bot: false,
              first_name: 'Telegram',
              last_name: 'User'
            });
          }
        } else {
          console.log('useTelegram: No Telegram WebApp, creating fallback user');
          setUser({
            id: 111111111,
            is_bot: false,
            first_name: 'Web',
            last_name: 'User'
          });
        }
        
        setIsLoading(false);
        console.log('useTelegram: Initialization completed');
      } catch (error) {
        console.error('useTelegram: Error during initialization:', error);
        // Всегда создаем fallback пользователя при ошибке
        setUser({
          id: 999999999,
          is_bot: false,
          first_name: 'Fallback',
          last_name: 'User'
        });
        setIsLoading(false);
      }
    };

    // Инициализируем сразу без задержки
    initializeTelegram();
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

  console.log('useTelegram: Current state', { user, isLoading });

  return {
    user,
    isLoading,
    showAlert,
    hapticFeedback,
    tg: window.Telegram?.WebApp,
    isTelegramEnvironment: !!window.Telegram?.WebApp
  };
};
