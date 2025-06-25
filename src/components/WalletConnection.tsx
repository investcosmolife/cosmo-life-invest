
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTelegramWallet } from '@/hooks/useTelegramWallet';
import { Wallet, AlertCircle } from 'lucide-react';

interface WalletConnectionProps {
  onConnect: () => void;
}

export const WalletConnection = ({ onConnect }: WalletConnectionProps) => {
  const { wallet, isLoading, connectWallet } = useTelegramWallet();

  const handleConnect = async () => {
    const success = await connectWallet();
    if (success) {
      onConnect();
    }
  };

  if (isLoading) {
    return (
      <Card className="text-center">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <p>Проверка подключения кошелька...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (wallet.isConnected) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Wallet className="h-5 w-5" />
            Кошелек подключен
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-green-700">
              Адрес: {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-8)}
            </p>
            {wallet.balance && (
              <p className="text-sm text-green-700">
                Баланс: {wallet.balance.toFixed(2)} TON
              </p>
            )}
            <Button onClick={onConnect} className="w-full bg-green-600 hover:bg-green-700">
              Войти в личный кабинет
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          Кошелек не подключен
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-yellow-700">
            Для доступа к личному кабинету необходимо подключить кошелек TON в Telegram
          </p>
          <Button onClick={handleConnect} className="w-full bg-blue-600 hover:bg-blue-700">
            <Wallet className="h-4 w-4 mr-2" />
            Подключить кошелек
          </Button>
          <div className="text-xs text-gray-600 space-y-1">
            <p>💡 Инструкция:</p>
            <p>1. Нажмите "Подключить кошелек"</p>
            <p>2. Следуйте инструкциям Telegram</p>
            <p>3. Подтвердите подключение</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
