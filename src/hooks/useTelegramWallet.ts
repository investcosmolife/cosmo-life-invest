
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
    
    try {
      // Проверяем только реальные данные кошелька из Telegram Web App
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.wallet) {
        const walletData = tg.initDataUnsafe.wallet;
        setWallet({
          isConnected: true,
          address: walletData.address,
          balance: walletData.balance || 0
        });
      } else {
        // Проверяем сохраненные данные только если они содержат реальный адрес
        const walletData = localStorage.getItem('telegram_wallet_data');
        if (walletData) {
          const parsed = JSON.parse(walletData);
          // Проверяем что это не фейковый адрес (начинается с реального TON адреса)
          if (parsed.address && (parsed.address.startsWith('EQ') || parsed.address.startsWith('UQ')) && parsed.address.length > 40) {
            setWallet({
              isConnected: true,
              address: parsed.address,
              balance: parsed.balance || 0
            });
          } else {
            localStorage.removeItem('telegram_wallet_data');
            setWallet({ isConnected: false });
          }
        } else {
          setWallet({ isConnected: false });
        }
      }
    } catch (error) {
      console.log('Error checking wallet:', error);
      setWallet({ isConnected: false });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    if (!tg) {
      showAlert('Это приложение работает только в Telegram');
      return false;
    }

    try {
      // Используем только реальный Telegram Wallet API
      if (tg.requestWallet) {
        // Новый API для подключения кошелька
        const walletResult = await tg.requestWallet();
        if (walletResult && walletResult.address) {
          const walletData = {
            address: walletResult.address,
            balance: walletResult.balance || 0
          };
          localStorage.setItem('telegram_wallet_data', JSON.stringify(walletData));
          setWallet({
            isConnected: true,
            address: walletData.address,
            balance: walletData.balance
          });
          showAlert('Кошелек успешно подключен!');
          return true;
        }
      } else if (tg.openTelegramLink) {
        // Открываем @wallet для подключения
        tg.openTelegramLink('https://t.me/wallet/start?startapp=connect');
        showAlert('Откройте @wallet в Telegram и подключите кошелек, затем вернитесь в приложение');
        
        // Ожидаем подключения кошелька через события
        return new Promise((resolve) => {
          const checkConnection = setInterval(() => {
            if (tg.initDataUnsafe && tg.initDataUnsafe.wallet) {
              clearInterval(checkConnection);
              checkWalletConnection();
              resolve(true);
            }
          }, 1000);
          
          // Таймаут через 30 секунд
          setTimeout(() => {
            clearInterval(checkConnection);
            resolve(false);
          }, 30000);
        });
      } else {
        showAlert('Функция подключения кошелька недоступна в данной версии Telegram');
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Connect wallet error:', error);
      showAlert('Ошибка подключения кошелька. Убедитесь, что у вас установлен @wallet в Telegram');
      return false;
    }
  };

  const sendPayment = async (amount: number, toAddress: string, comment: string): Promise<boolean> => {
    if (!wallet.isConnected) {
      showAlert('Кошелек не подключен');
      return false;
    }

    if (!tg) {
      showAlert('Это приложение работает только в Telegram');
      return false;
    }

    try {
      const nanoAmount = Math.floor(amount * 1000000000);
      
      console.log('Отправка платежа:', {
        amount: nanoAmount,
        toAddress,
        comment
      });

      // Используем Telegram Web App API для отправки платежа
      if (tg.sendTransaction) {
        const transaction = {
          to: toAddress,
          value: nanoAmount.toString(),
          data: comment
        };
        
        const result = await tg.sendTransaction(transaction);
        if (result.success) {
          showAlert('Платеж успешно отправлен!');
          return true;
        } else {
          showAlert('Платеж отклонен или произошла ошибка');
          return false;
        }
      } else {
        // Fallback - открываем кошелек с параметрами транзакции
        const paymentUrl = `ton://transfer/${toAddress}?amount=${nanoAmount}&text=${encodeURIComponent(comment)}`;
        
        if (tg.openTelegramLink) {
          tg.openTelegramLink(paymentUrl);
        } else if (tg.openLink) {
          tg.openLink(paymentUrl);
        }
        
        showAlert('Откроется кошелек для подтверждения платежа');
        return true;
      }
      
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
