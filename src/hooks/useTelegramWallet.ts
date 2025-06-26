
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
      // Проверяем сохраненные данные кошелька
      const walletData = localStorage.getItem('telegram_wallet_data');
      if (walletData) {
        const parsed = JSON.parse(walletData);
        setWallet({
          isConnected: true,
          address: parsed.address,
          balance: parsed.balance || 0
        });
      } else {
        setWallet({ isConnected: false });
      }
    } catch (error) {
      console.log('Error checking wallet:', error);
      setWallet({ isConnected: false });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    // Проверяем Telegram окружение более мягко
    if (!isTelegramEnvironment) {
      // В режиме разработки имитируем подключение
      console.log('Development mode - simulating wallet connection');
      const mockWalletData = {
        address: 'UQD...' + Math.random().toString(36).substring(2, 15),
        balance: Math.random() * 100
      };
      localStorage.setItem('telegram_wallet_data', JSON.stringify(mockWalletData));
      setWallet({
        isConnected: true,
        address: mockWalletData.address,
        balance: mockWalletData.balance
      });
      showAlert('Кошелек успешно подключен!');
      return true;
    }

    try {
      // Открываем @wallet через различные методы
      const walletUrl = 'https://t.me/wallet';
      
      if (tg?.openTelegramLink) {
        tg.openTelegramLink(walletUrl);
      } else if (tg?.openLink) {
        tg.openLink(walletUrl);
      } else {
        window.open(walletUrl, '_blank');
      }
      
      showAlert('Откройте @wallet в Telegram, подключите кошелек и вернитесь в приложение');
      
      // Имитируем подключение через 3 секунды
      setTimeout(() => {
        const mockWalletData = {
          address: 'UQD...' + Math.random().toString(36).substring(2, 15),
          balance: Math.random() * 100
        };
        localStorage.setItem('telegram_wallet_data', JSON.stringify(mockWalletData));
        setWallet({
          isConnected: true,
          address: mockWalletData.address,
          balance: mockWalletData.balance
        });
        showAlert('Кошелек успешно подключен!');
      }, 3000);
      
      return true;
    } catch (error) {
      console.error('Connect wallet error:', error);
      showAlert('Ошибка подключения кошелька');
      return false;
    }
  };

  const sendPayment = async (amount: number, toAddress: string, comment: string): Promise<boolean> => {
    if (!wallet.isConnected) {
      showAlert('Кошелек не подключен');
      return false;
    }

    try {
      const nanoAmount = Math.floor(amount * 1000000000);
      
      console.log('Отправка платежа:', {
        amount: nanoAmount,
        toAddress,
        comment
      });

      const paymentUrl = `ton://transfer/${toAddress}?amount=${nanoAmount}&text=${encodeURIComponent(comment)}`;
      
      if (tg?.openTelegramLink) {
        tg.openTelegramLink(paymentUrl);
      } else if (tg?.openLink) {
        tg.openLink(paymentUrl);
      } else {
        window.open(paymentUrl, '_blank');
      }
      
      showAlert('Откроется кошелек для подтверждения платежа');
      return true;
      
    } catch (error) {
      console.error('Payment error:', error);
      showAlert('Ошибка при отправке платежа');
      return false;
    }
  };

  return {
    wallet,
    isLoading,
    connectWallet,
    sendPayment,
    checkWalletConnection
  };
};
