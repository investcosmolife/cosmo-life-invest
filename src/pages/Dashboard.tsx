
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/ServiceCard';
import { InvestmentCalculator } from '@/components/InvestmentCalculator';
import { PersonalCabinet } from '@/components/PersonalCabinet';
import { WalletConnection } from '@/components/WalletConnection';
import { TelegramLayout } from '@/components/TelegramLayout';
import { useTelegram } from '@/hooks/useTelegram';
import { useTelegramWallet } from '@/hooks/useTelegramWallet';
import { SERVICE_REVENUE, formatCurrency } from '@/utils/investment';
import { ArrowUp, TrendingUp, Users, User, Wallet } from 'lucide-react';

export const Dashboard = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCabinet, setShowCabinet] = useState(false);
  const [showWalletConnection, setShowWalletConnection] = useState(false);
  const { user, showAlert, hapticFeedback } = useTelegram();
  const { wallet, isLoading: walletLoading } = useTelegramWallet();

  const handleInvest = (percentage: number) => {
    if (!wallet.isConnected) {
      showAlert('Сначала подключите кошелек Telegram');
      setShowWalletConnection(true);
      return;
    }
    
    showAlert(`Перенаправление в личный кабинет для покупки ${percentage}% доли`);
    setShowCalculator(false);
    setShowCabinet(true);
    hapticFeedback('heavy');
  };

  const handleLoginToCabinet = () => {
    if (!wallet.isConnected) {
      setShowWalletConnection(true);
      return;
    }
    
    hapticFeedback('medium');
    setShowCabinet(true);
  };

  const handleWalletConnected = () => {
    setShowWalletConnection(false);
    setShowCabinet(true);
  };

  const totalProjectedRevenue = Object.values(SERVICE_REVENUE)
    .reduce((sum, service) => sum + service.totalRevenue, 0);

  // Показываем экран подключения кошелька
  if (showWalletConnection) {
    return (
      <TelegramLayout>
        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWalletConnection(false)}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <ArrowUp className="h-4 w-4 rotate-[-90deg]" />
                </Button>
                <CardTitle className="text-xl font-bold">Подключение кошелька</CardTitle>
              </div>
            </CardHeader>
          </Card>
          
          <WalletConnection onConnect={handleWalletConnected} />
        </div>
      </TelegramLayout>
    );
  }

  // Показываем личный кабинет только если кошелек подключен
  if (showCabinet && wallet.isConnected) {
    return (
      <TelegramLayout>
        <PersonalCabinet onBack={() => setShowCabinet(false)} />
      </TelegramLayout>
    );
  }

  // Если пытаемся показать кабинет без подключенного кошелька
  if (showCabinet && !wallet.isConnected) {
    setShowCabinet(false);
    setShowWalletConnection(true);
  }

  return (
    <TelegramLayout>
      <div className="space-y-4">
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <CardHeader className="text-center pb-2">
            <div className="text-3xl mb-2">🌟</div>
            <CardTitle className="text-2xl font-bold">Cosmo Life</CardTitle>
            <p className="text-purple-100">
              Суперприложение с ИИ-агентом
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-center">
              <p className="text-sm mb-2">
                Добро пожаловать, {user?.first_name || 'Инвестор'}! 👋
              </p>
              {!walletLoading && wallet.isConnected && (
                <div className="bg-white/20 rounded-lg p-2 mb-2">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Wallet className="h-4 w-4 text-green-300" />
                    <span className="text-green-300">
                      Кошелек подключен: {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                    </span>
                  </div>
                </div>
              )}
              <div className="bg-white/20 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Цель: 1M пользователей</span>
                </div>
                <div className="text-lg font-bold">
                  Общий прогноз дохода: {formatCurrency(totalProjectedRevenue)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <TrendingUp className="h-5 w-5" />
              Инвестиционная возможность
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-green-600 mb-2">
                163,750 USD/год
              </div>
              <p className="text-sm text-gray-600">
                Прогнозируемая доходность при покупке 1% за 1,000 TON
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-blue-600">1,637%</div>
                <div className="text-xs text-gray-600">ROI в год</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-purple-600">0.01-20%</div>
                <div className="text-xs text-gray-600">Доступные доли</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleLoginToCabinet}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                💰 Купить долю
              </Button>
              <Button
                variant="outline"
                onClick={handleLoginToCabinet}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Кабинет
              </Button>
            </div>
          </CardContent>
        </Card>

        <div id="services">
          <h2 className="text-xl font-bold mb-4 text-center">
            🚀 Наши сервисы
          </h2>
          
          {Object.entries(SERVICE_REVENUE).map(([key, service]) => (
            <ServiceCard
              key={key}
              serviceKey={key as keyof typeof SERVICE_REVENUE}
              userPercentage={1}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">🤖 О Cosmo Life</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700 text-center">
              Революционное суперприложение с ИИ-агентом, который автоматизирует повседневные задачи:
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-1">💼</div>
                <div className="text-xs font-medium">Поиск работы</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl mb-1">🚗</div>
                <div className="text-xs font-medium">Заказ такси</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl mb-1">🍔</div>
                <div className="text-xs font-medium">Доставка еды</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-1">🏠</div>
                <div className="text-xs font-medium">Аренда жилья</div>
              </div>
            </div>
            
            <div className="text-center pt-2">
              <div className="text-sm text-gray-600 mb-2">
                Скоро в App Store и Google Play
              </div>
              <div className="flex justify-center gap-2">
                <div className="bg-gray-100 px-3 py-1 rounded-full text-xs">Telegram ✓</div>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-xs">iOS 🔜</div>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-xs">Android 🔜</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {showCalculator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md">
              <InvestmentCalculator onInvest={handleInvest} />
              <Button
                variant="outline"
                onClick={() => setShowCalculator(false)}
                className="w-full mt-2 bg-white"
              >
                Закрыть
              </Button>
            </div>
          </div>
        )}
      </div>
    </TelegramLayout>
  );
};
