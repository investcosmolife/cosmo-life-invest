
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
      // Check if we're in Telegram environment first
      if (!isTelegramEnvironment) {
        setWallet({ isConnected: false });
        setIsLoading(false);
        return;
      }

      // Check if wallet data exists in initDataUnsafe (only if it exists)
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.wallet) {
        const walletData = tg.initDataUnsafe.wallet;
        if (walletData.address && walletData.address.length > 40) {
          setWallet({
            isConnected: true,
            address: walletData.address,
            balance: walletData.balance || 0
          });
          setIsLoading(false);
          return;
        }
      }

      // Check localStorage for saved wallet data (only real data)
      const savedWalletData = localStorage.getItem('telegram_wallet_data');
      if (savedWalletData) {
        try {
          const parsed = JSON.parse(savedWalletData);
          // Only accept if it looks like a real TON address
          if (parsed.address && 
              (parsed.address.startsWith('EQ') || parsed.address.startsWith('UQ')) && 
              parsed.address.length > 40) {
            setWallet({
              isConnected: true,
              address: parsed.address,
              balance: parsed.balance || 0
            });
          } else {
            // Remove invalid data
            localStorage.removeItem('telegram_wallet_data');
            setWallet({ isConnected: false });
          }
        } catch {
          localStorage.removeItem('telegram_wallet_data');
          setWallet({ isConnected: false });
        }
      } else {
        setWallet({ isConnected: false });
      }
    } catch (error) {
      console.error('Error checking wallet:', error);
      setWallet({ isConnected: false });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    if (!isTelegramEnvironment) {
      showAlert('Это приложение работает только в Telegram');
      return false;
    }

    if (!tg) {
      showAlert('Telegram WebApp недоступен');
      return false;
    }

    try {
      // Try to use requestWallet if available (optional method)
      if (tg.requestWallet) {
        return new Promise((resolve) => {
          tg.requestWallet!((walletData) => {
            if (walletData && walletData.address) {
              const savedData = {
                address: walletData.address,
                balance: walletData.balance || 0
              };
              localStorage.setItem('telegram_wallet_data', JSON.stringify(savedData));
              setWallet({
                isConnected: true,
                address: savedData.address,
                balance: savedData.balance
              });
              showAlert('Кошелек успешно подключен!');
              resolve(true);
            } else {
              showAlert('Не удалось подключить кошелек');
              resolve(false);
            }
          });
        });
      } else {
        // Fallback - redirect to @wallet
        if (tg.openTelegramLink) {
          tg.openTelegramLink('https://t.me/wallet');
          showAlert('Установите @wallet и настройте кошелек, затем перезапустите приложение');
        } else {
          showAlert('Функция подключения кошелька недоступна в данной версии Telegram. Установите @wallet и настройте кошелек.');
        }
        return false;
      }
    } catch (error) {
      console.error('Connect wallet error:', error);
      showAlert('Ошибка подключения кошелька. Убедитесь, что у вас установлен @wallet');
      return false;
    }
  };

  const sendPayment = async (amount: number, toAddress: string, comment: string): Promise<boolean> => {
    if (!wallet.isConnected) {
      showAlert('Кошелек не подключен');
      return false;
    }

    if (!isTelegramEnvironment || !tg) {
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

      // Try to use sendTransaction if available (optional method)
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
        // Fallback - create payment URL
        const paymentUrl = `ton://transfer/${toAddress}?amount=${nanoAmount}&text=${encodeURIComponent(comment)}`;
        
        if (tg.openLink) {
          tg.openLink(paymentUrl);
          showAlert('Откроется внешний кошелек для подтверждения платежа');
          return true;
        } else {
          showAlert('Функция отправки платежей недоступна');
          return false;
        }
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
