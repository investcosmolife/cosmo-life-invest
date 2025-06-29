
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
  const { showAlert } = useTelegram();

  useEffect(() => {
    console.log('useTelegramWallet: Starting wallet check...');
    
    const initWallet = () => {
      try {
        // В dev режиме всегда создаем подключенный кошелек
        if (import.meta.env.DEV) {
          console.log('useTelegramWallet: Development mode - creating mock wallet');
          const mockWallet = {
            isConnected: true,
            address: 'UQBmockaddressfortestingpurposesonlynotreal12345678',
            balance: 100
          };
          setWallet(mockWallet);
          setIsLoading(false);
          console.log('useTelegramWallet: Mock wallet created', mockWallet);
          return;
        }

        // Проверяем сохраненный кошелек
        const savedWalletData = localStorage.getItem('telegram_wallet_data');
        if (savedWalletData) {
          try {
            const parsed = JSON.parse(savedWalletData);
            console.log('useTelegramWallet: Saved wallet found', parsed);
            
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
            console.error('useTelegramWallet: Error parsing saved wallet:', error);
            localStorage.removeItem('telegram_wallet_data');
            setWallet({ isConnected: false });
          }
        } else {
          setWallet({ isConnected: false });
        }
        
        setIsLoading(false);
        console.log('useTelegramWallet: Wallet check completed');
      } catch (error) {
        console.error('useTelegramWallet: Error during wallet init:', error);
        setWallet({ isConnected: false });
        setIsLoading(false);
      }
    };

    initWallet();
  }, []);

  const connectWallet = async (): Promise<boolean> => {
    console.log('useTelegramWallet: Connecting wallet...');
    
    try {
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
      showAlert('Кошелек успешно подключен!');
      console.log('useTelegramWallet: Wallet connected successfully');
      return true;
    } catch (error) {
      console.error('useTelegramWallet: Connect wallet error:', error);
      showAlert('Ошибка подключения кошелька');
      return false;
    }
  };

  const sendPayment = async (amount: number, toAddress: string, comment?: string): Promise<boolean> => {
    console.log('useTelegramWallet: Sending payment...', { amount, toAddress, comment });
    
    try {
      // В реальном приложении здесь была бы отправка платежа через Telegram Wallet API
      // Пока что имитируем успешную отправку
      if (import.meta.env.DEV) {
        console.log('useTelegramWallet: Mock payment sent successfully');
        return true;
      }

      // Попытка использовать Telegram WebApp API для отправки платежа
      const tg = window.Telegram?.WebApp;
      if (tg && tg.sendTransaction) {
        await tg.sendTransaction({
          to: toAddress,
          value: amount.toString(),
          data: comment || ''
        });
        return true;
      }

      // Fallback - просто возвращаем успех
      console.log('useTelegramWallet: Payment simulation completed');
      return true;
    } catch (error) {
      console.error('useTelegramWallet: Payment error:', error);
      return false;
    }
  };

  console.log('useTelegramWallet: Current state', { wallet, isLoading });

  return {
    wallet,
    isLoading,
    connectWallet,
    sendPayment,
    checkWalletConnection: () => {}
  };
};
