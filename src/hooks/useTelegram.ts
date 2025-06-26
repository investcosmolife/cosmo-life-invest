
import { useEffect, useState } from 'react';
import { TelegramUser } from '@/types/telegram';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем различные способы определения Telegram окружения
    const checkTelegramEnvironment = () => {
      // Проверка 1: window.Telegram
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        const userData = tg.initDataUnsafe?.user;
        if (userData) {
          setUser(userData);
        }
        setIsLoading(false);
        return true;
      }

      // Проверка 2: User-Agent содержит Telegram
      if (navigator.userAgent.includes('Telegram')) {
        console.log('Detected Telegram via User-Agent');
        setIsLoading(false);
        return true;
      }

      // Проверка 3: URL параметры от Telegram
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('tgWebAppData') || urlParams.has('tgWebAppVersion')) {
        console.log('Detected Telegram via URL params');
        setIsLoading(false);
        return true;
      }

      // Проверка 4: Referrer содержит t.me
      if (document.referrer && document.referrer.includes('t.me')) {
        console.log('Detected Telegram via referrer');
        setIsLoading(false);
        return true;
      }

      return false;
    };

    const isTelegram = checkTelegramEnvironment();
    
    if (!isTelegram) {
      // Для разработки - имитируем Telegram окружение
      console.log('Development mode - simulating Telegram environment');
      setIsLoading(false);
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

  // Определяем, находимся ли мы в Telegram
  const isTelegramEnvironment = () => {
    return !!(
      window.Telegram?.WebApp ||
      navigator.userAgent.includes('Telegram') ||
      new URLSearchParams(window.location.search).has('tgWebAppData') ||
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
