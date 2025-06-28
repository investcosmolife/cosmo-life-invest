
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
      
      // Проверяем, есть ли данные кошелька в initDataUnsafe
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.wallet) {
        const walletData = tg.initDataUnsafe.wallet;
        console.log('Wallet data found in initDataUnsafe:', walletData);
        
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

      // Проверяем localStorage на наличие сохраненных данных кошелька
      const savedWalletData = localStorage.getItem('telegram_wallet_data');
      if (savedWalletData) {
        try {
          const parsed = JSON.parse(savedWalletData);
          console.log('Saved wallet data found:', parsed);
          
          // Проверяем, что это похоже на реальный TON адрес
          if (parsed.address && 
              (parsed.address.startsWith('EQ') || parsed.address.startsWith('UQ')) && 
              parsed.address.length > 40) {
            setWallet({
              isConnected: true,
              address: parsed.address,
              balance: parsed.balance || 0
            });
          } else {
            console.log('Invalid wallet data, removing...');
            localStorage.removeItem('telegram_wallet_data');
            setWallet({ isConnected: false });
          }
        } catch (error) {
          console.error('Error parsing saved wallet data:', error);
          localStorage.removeItem('telegram_wallet_data');
          setWallet({ isConnected: false });
        }
      } else {
        console.log('No saved wallet data found');
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
    console.log('Attempting to connect wallet...');
    
    if (!isTelegramEnvironment) {
      showAlert('Это приложение работает только в Telegram');
      return false;
    }

    if (!tg) {
      showAlert('Telegram WebApp недоступен');
      return false;
    }

    try {
      // Попытка использовать requestWallet если доступно
      if (tg.requestWallet) {
        console.log('Using requestWallet method...');
        return new Promise((resolve) => {
          tg.requestWallet!((walletData) => {
            console.log('requestWallet callback:', walletData);
            
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
        // Fallback - перенаправляем на @wallet
        console.log('requestWallet not available, using fallback...');
        
        if (tg.openTelegramLink) {
          tg.openTelegramLink('https://t.me/wallet');
          showAlert('Откройте @wallet в Telegram, создайте кошелек и перезапустите приложение');
        } else if (tg.openLink) {
          tg.openLink('https://t.me/wallet');
          showAlert('Откройте @wallet в Telegram, создайте кошелек и перезапустите приложение');
        } else {
          showAlert('Установите @wallet в Telegram для подключения кошелька');
        }
        return false;
      }
    } catch (error) {
      console.error('Connect wallet error:', error);
      showAlert('Ошибка подключения кошелька. Убедитесь, что @wallet установлен в Telegram');
      return false;
    }
  };

  const sendPayment = async (amount: number, toAddress: string, comment: string): Promise<boolean> => {
    console.log('Attempting to send payment:', { amount, toAddress, comment });
    
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
      
      console.log('Payment details:', {
        amount: nanoAmount,
        toAddress,
        comment
      });

      // Попытка использовать sendTransaction если доступно
      if (tg.sendTransaction) {
        console.log('Using sendTransaction method...');
        const transaction = {
          to: toAddress,
          value: nanoAmount.toString(),
          data: comment
        };
        
        const result = await tg.sendTransaction(transaction);
        console.log('Transaction result:', result);
        
        if (result.success) {
          showAlert('Платеж успешно отправлен!');
          return true;
        } else {
          showAlert('Платеж отклонен или произошла ошибка');
          return false;
        }
      } else {
        // Fallback - создаем URL для платежа
        console.log('sendTransaction not available, using payment URL...');
        const paymentUrl = `ton://transfer/${toAddress}?amount=${nanoAmount}&text=${encodeURIComponent(comment)}`;
        
        if (tg.openLink) {
          tg.openLink(paymentUrl);
          showAlert('Откроется кошелек для подтверждения платежа');
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
