
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
      // Проверяем, доступен ли кошелек в Telegram
      if (typeof tg.invokeCustomMethod === 'function') {
        tg.invokeCustomMethod('web_app_request_wallet_info', {}, (error: string, result: any) => {
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
        // Для старых версий Telegram пробуем другой метод
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
      showAlert('Это приложение работает только в Telegram');
      return false;
    }

    try {
      // Пробуем подключить кошелек через Telegram
      if (typeof tg.invokeCustomMethod === 'function') {
        return new Promise<boolean>((resolve) => {
          tg.invokeCustomMethod('web_app_open_tg_link', { 
            url: 'https://t.me/wallet' 
          }, (error: string, result: any) => {
            if (error) {
              showAlert('Не удалось открыть кошелек Telegram. Убедитесь, что у вас установлен @wallet');
              resolve(false);
            } else {
              showAlert('Откройте @wallet в Telegram, подключите кошелек и вернитесь в приложение');
              // Проверяем подключение через 3 секунды
              setTimeout(() => {
                checkWalletConnection();
              }, 3000);
              resolve(true);
            }
          });
        });
      } else {
        // Fallback: открываем ссылку на кошелек
        tg.openTelegramLink('https://t.me/wallet');
        showAlert('Откройте @wallet в Telegram, подключите кошелек и вернитесь в приложение');
        return false;
      }
    } catch (error) {
      showAlert('Ошибка подключения кошелька. Убедитесь, что вы используете последнюю версию Telegram');
      return false;
    }
  };

  const sendPayment = async (amount: number, toAddress: string, comment: string) => {
    if (!wallet.isConnected || !tg) {
      showAlert('Кошелек не подключен');
      return false;
    }

    try {
      // Создаем TON платеж через Telegram кошелек
      const nanoAmount = Math.floor(amount * 1000000000); // Конвертируем в нанотоны
      
      console.log('Sending payment:', {
        amount: nanoAmount,
        toAddress,
        comment
      });
      
      // Используем Telegram кошелек для отправки платежа
      if (typeof tg.invokeCustomMethod === 'function') {
        return new Promise<boolean>((resolve) => {
          tg.invokeCustomMethod('web_app_send_transaction', {
            to: toAddress,
            value: nanoAmount.toString(),
            data: comment
          }, (error: string, result: any) => {
            if (error) {
              showAlert('Ошибка при отправке платежа: ' + error);
              resolve(false);
            } else {
              showAlert('Платеж отправлен успешно!');
              resolve(true);
            }
          });
        });
      } else {
        // Fallback: создаем TON ссылку для платежа
        const paymentUrl = `ton://transfer/${toAddress}?amount=${nanoAmount}&text=${encodeURIComponent(comment)}`;
        tg.openLink(paymentUrl);
        return true;
      }
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
