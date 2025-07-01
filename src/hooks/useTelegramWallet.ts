
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
      console.log('Checking wallet connection...', {
        hasTg: !!tg,
        isTelegramEnv: isTelegramEnvironment,
        initDataUnsafe: tg?.initDataUnsafe
      });
      
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
    console.log('Attempting to connect wallet...', {
      isTelegramEnvironment,
      hasTg: !!tg
    });
    
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
      // Используем новый метод для подключения кошелька через Telegram WebApp
      if (tg.requestWriteAccess) {
        console.log('Requesting write access first...');
        
        return new Promise((resolve) => {
          tg.requestWriteAccess!((granted) => {
            console.log('Write access granted:', granted);
            
            if (granted) {
              // После получения доступа на запись, пытаемся подключить кошелек
              console.log('Attempting to connect wallet after write access...');
              
              // Используем invokeCustomMethod для подключения кошелька
              if (tg.invokeCustomMethod) {
                tg.invokeCustomMethod('web_app_request_wallet', {}, (error, result) => {
                  if (error) {
                    console.error('Wallet connection error:', error);
                    showAlert('Не удалось подключить кошелек. Убедитесь, что у вас установлен @wallet');
                    resolve(false);
                  } else {
                    console.log('Wallet connection result:', result);
                    if (result && result.address) {
                      const walletData = {
                        address: result.address,
                        balance: result.balance || 0
                      };
                      localStorage.setItem('telegram_wallet_data', JSON.stringify(walletData));
                      setWallet({
                        isConnected: true,
                        address: walletData.address,
                        balance: walletData.balance
                      });
                      showAlert('Кошелек успешно подключен!');
                      resolve(true);
                    } else {
                      showAlert('Не удалось получить данные кошелька');
                      resolve(false);
                    }
                  }
                });
              } else {
                // Fallback к старому методу
                console.log('invokeCustomMethod not available, using openTelegramLink...');
                if (tg.openTelegramLink) {
                  tg.openTelegramLink('https://t.me/wallet?startapp=connect');
                } else if (tg.openLink) {
                  tg.openLink('https://t.me/wallet?startapp=connect');
                }
                showAlert('Откройте @wallet, подключите кошелек и вернитесь в приложение');
                resolve(false);
              }
            } else {
              showAlert('Необходимо разрешить доступ для подключения кошелька');
              resolve(false);
            }
          });
        });
      } else {
        // Прямая попытка подключения кошелька
        console.log('Attempting direct wallet connection...');
        
        if (tg.invokeCustomMethod) {
          return new Promise((resolve) => {
            tg.invokeCustomMethod!('web_app_request_wallet', {}, (error, result) => {
              if (error) {
                console.error('Direct wallet connection error:', error);
                // Fallback к открытию @wallet
                if (tg.openTelegramLink) {
                  tg.openTelegramLink('https://t.me/wallet?startapp=connect');
                  showAlert('Подключите кошелек в @wallet и вернитесь в приложение');
                }
                resolve(false);
              } else {
                console.log('Direct wallet connection result:', result);
                if (result && result.address) {
                  const walletData = {
                    address: result.address,
                    balance: result.balance || 0
                  };
                  localStorage.setItem('telegram_wallet_data', JSON.stringify(walletData));
                  setWallet({
                    isConnected: true,
                    address: walletData.address,
                    balance: walletData.balance
                  });
                  showAlert('Кошелек успешно подключен!');
                  resolve(true);
                } else {
                  showAlert('Не удалось получить данные кошелька');
                  resolve(false);
                }
              }
            });
          });
        } else {
          // Последний fallback
          console.log('No custom methods available, using link fallback...');
          if (tg.openTelegramLink) {
            tg.openTelegramLink('https://t.me/wallet?startapp=connect');
          } else if (tg.openLink) {
            tg.openLink('https://t.me/wallet?startapp=connect');
          }
          showAlert('Установите @wallet в Telegram и повторите попытку');
          return false;
        }
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

      // Используем invokeCustomMethod для отправки платежа
      if (tg.invokeCustomMethod) {
        console.log('Using invokeCustomMethod for payment...');
        
        return new Promise((resolve) => {
          const paymentData = {
            to: toAddress,
            value: nanoAmount.toString(),
            data: comment
          };
          
          tg.invokeCustomMethod!('web_app_send_transaction', paymentData, (error, result) => {
            if (error) {
              console.error('Payment error:', error);
              showAlert('Ошибка при отправке платежа');
              resolve(false);
            } else {
              console.log('Payment result:', result);
              if (result && result.success) {
                showAlert('Платеж успешно отправлен!');
                resolve(true);
              } else {
                showAlert('Платеж отклонен или произошла ошибка');
                resolve(false);
              }
            }
          });
        });
      } else {
        // Fallback - создаем URL для платежа
        console.log('Using payment URL fallback...');
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
