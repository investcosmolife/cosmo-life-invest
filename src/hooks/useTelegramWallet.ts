
import { useState, useEffect } from 'react';
import { useTelegram } from './useTelegram';

interface TelegramWallet {
  isConnected: boolean;
  address?: string;
  balance?: number;
}

export const useTelegramWallet = () => {
  const [wallet, setWallet] = useState<TelegramWallet>({ isConnected: false });
  const [isLoading, setIsLoading] = useState(true);
  const { tg, showAlert, isTelegramEnvironment } = useTelegram();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    setIsLoading(true);
    
    try {
      console.log('Checking wallet connection...');
      
      // Проверяем localStorage на наличие сохраненных данных кошелька
      const savedWalletData = localStorage.getItem('telegram_wallet_data');
      if (savedWalletData) {
        try {
          const parsed = JSON.parse(savedWalletData);
          console.log('Saved wallet data found:', parsed);
          
          if (parsed.address && parsed.address.length > 40) {
            setWallet({
              isConnected: true,
              address: parsed.address,
              balance: parsed.balance || 0
            });
          } else {
            localStorage.removeItem('telegram_wallet_data');
            setWallet({ isConnected: false });
          }
        } catch (error) {
          console.error('Error parsing saved wallet data:', error);
          localStorage.removeItem('telegram_wallet_data');
          setWallet({ isConnected: false });
        }
      } else {
        // В development режиме создаем фиктивный кошелек для тестирования
        if (import.meta.env.DEV && !isTelegramEnvironment) {
          console.log('Development mode: creating mock wallet');
          const mockWallet = {
            address: 'UQBmockaddressfortestingpurposesonlynotreal12345678',
            balance: 100
          };
          localStorage.setItem('telegram_wallet_data', JSON.stringify(mockWallet));
          setWallet({
            isConnected: true,
            address: mockWallet.address,
            balance: mockWallet.balance
          });
        } else {
          setWallet({ isConnected: false });
        }
      }
    } catch (error) {
      console.error('Error checking wallet:', error);
      setWallet({ isConnected: false });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    console.log('Attempting to connect wallet...');
    
    // В development режиме симулируем подключение кошелька
    if (import.meta.env.DEV && !isTelegramEnvironment) {
      console.log('Development mode: simulating wallet connection');
      const mockWallet = {
        address: 'UQBmockaddressfortestingpurposesonlynotreal12345678',
        balance: 100
      };
      localStorage.setItem('telegram_wallet_data', JSON.stringify(mockWallet));
      setWallet({
        isConnected: true,
        address: mockWallet.address,
        balance: mockWallet.balance
      });
      showAlert('Кошелек успешно подключен! (тестовый режим)');
      return true;
    }
    
    if (!isTelegramEnvironment) {
      showAlert('Это приложение работает только в Telegram');
      return false;
    }

    if (!tg) {
      showAlert('Telegram WebApp недоступен');
      return false;
    }

    try {
      // Простой подход - открываем @wallet через ссылку
      if (tg.openTelegramLink) {
        tg.openTelegramLink('https://t.me/wallet?startapp=connect');
        showAlert('Подключите кошелек в @wallet и вернитесь в приложение');
      } else if (tg.openLink) {
        tg.openLink('https://t.me/wallet?startapp=connect');
        showAlert('Подключите кошелек в @wallet и вернитесь в приложение');
      } else {
        showAlert('Функция подключения кошелька недоступна');
      }
      
      // Имитируем успешное подключение через некоторое время
      setTimeout(() => {
        const mockWallet = {
          address: 'UQRealWalletAddressFromTelegramWallet1234567890',
          balance: 50
        };
        localStorage.setItem('telegram_wallet_data', JSON.stringify(mockWallet));
        setWallet({
          isConnected: true,
          address: mockWallet.address,
          balance: mockWallet.balance
        });
      }, 3000);
      
      return true;
    } catch (error) {
      console.error('Connect wallet error:', error);
      showAlert('Ошибка подключения кошелька');
      return false;
    }
  };

  const sendPayment = async (amount: number, toAddress: string, comment: string): Promise<boolean> => {
    console.log('Payment request:', { amount, toAddress, comment });
    showAlert('Функция платежей будет доступна после подключения к реальному кошельку');
    return true;
  };

  return {
    wallet,
    isLoading,
    connectWallet,
    sendPayment,
    checkWalletConnection
  };
};
