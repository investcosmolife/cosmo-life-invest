
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
      setWallet({ isConnected: false });
      setIsLoading(false);
      return;
    }

    try {
      // Проверяем подключение кошелька через Telegram WebApp API
      if (tg.initDataUnsafe?.user) {
        // Используем реальный API проверки кошелька
        const checkWallet = () => {
          try {
            // Запрашиваем информацию о кошельке
            tg.invokeCustomMethod?.('web_app_request_wallet', {}, (error: any, result: any) => {
              if (!error && result) {
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
          } catch (err) {
            console.log('Wallet check error:', err);
            setWallet({ isConnected: false });
            setIsLoading(false);
          }
        };

        // Проверяем кошелек
        checkWallet();
      } else {
        setWallet({ isConnected: false });
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Error checking wallet:', error);
      setWallet({ isConnected: false });
      setIsLoading(false);
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    if (!tg) {
      showAlert('Это приложение работает только в Telegram');
      return false;
    }

    try {
      // Открываем @wallet бота для подключения
      tg.openTelegramLink('https://t.me/wallet');
      showAlert('Откройте @wallet в Telegram, подключите кошелек и вернитесь в приложение');
      
      // Через 5 секунд проверяем подключение
      setTimeout(() => {
        checkWalletConnection();
      }, 5000);
      
      return true;
    } catch (error) {
      console.error('Connect wallet error:', error);
      showAlert('Ошибка подключения кошелька');
      return false;
    }
  };

  const sendPayment = async (amount: number, toAddress: string, comment: string): Promise<boolean> => {
    if (!wallet.isConnected || !tg) {
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

      // Отправляем платеж через Telegram Wallet
      const paymentUrl = `ton://transfer/${toAddress}?amount=${nanoAmount}&text=${encodeURIComponent(comment)}`;
      
      if (tg.openInvoice) {
        tg.openInvoice(paymentUrl, (status: string) => {
          if (status === 'paid') {
            showAlert('Платеж успешно отправлен!');
          } else {
            showAlert('Платеж отменен или не выполнен');
          }
        });
      } else {
        tg.openLink(paymentUrl);
        showAlert('Откроется кошелек для подтверждения платежа');
      }
      
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
