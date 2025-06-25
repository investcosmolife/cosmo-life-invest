
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
  const { tg, showAlert } = useTelegram();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    setIsLoading(true);
    
    if (!tg) {
      // For development/testing outside Telegram
      setWallet({ 
        isConnected: true, 
        address: 'UQTest...Development',
        balance: 1000 
      });
      setIsLoading(false);
      return;
    }

    try {
      // Check if wallet is available in Telegram
      if (typeof tg.invokeCustomMethod === 'function') {
        tg.invokeCustomMethod('web_app_request_wallet', {}, (error: string, result: any) => {
          if (error) {
            console.log('Wallet not connected:', error);
            setWallet({ isConnected: false });
          } else if (result && result.address) {
            setWallet({
              isConnected: true,
              address: result.address,
              balance: result.balance || 0
            });
          } else {
            setWallet({ isConnected: false });
          }
          setIsLoading(false);
        });
      } else {
        // Fallback for older Telegram versions
        setWallet({ isConnected: false });
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Error checking wallet:', error);
      setWallet({ isConnected: false });
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    if (!tg) {
      showAlert('Telegram WebApp недоступен');
      return false;
    }

    try {
      // Try to connect wallet through Telegram
      if (typeof tg.invokeCustomMethod === 'function') {
        return new Promise<boolean>((resolve) => {
          tg.invokeCustomMethod('web_app_request_wallet', { connect: true }, (error: string, result: any) => {
            if (error) {
              showAlert('Не удалось подключить кошелек');
              resolve(false);
            } else {
              setWallet({
                isConnected: true,
                address: result.address,
                balance: result.balance || 0
              });
              resolve(true);
            }
          });
        });
      } else {
        // Fallback: open wallet manually
        tg.openLink('https://wallet.ton.org/');
        showAlert('Откройте кошелек TON и вернитесь в приложение');
        return false;
      }
    } catch (error) {
      showAlert('Ошибка подключения кошелька');
      return false;
    }
  };

  const sendPayment = async (amount: number, toAddress: string, comment: string) => {
    if (!wallet.isConnected || !tg) {
      showAlert('Кошелек не подключен');
      return false;
    }

    try {
      // Create TON payment URL
      const paymentUrl = `ton://transfer/${toAddress}?amount=${amount * 1000000000}&text=${encodeURIComponent(comment)}`;
      
      console.log('Opening payment URL:', paymentUrl);
      
      // Open payment in Telegram
      tg.openLink(paymentUrl);
      
      return true;
    } catch (error) {
      console.error('Payment error:', error);
      showAlert('Ошибка при создании платежа');
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
