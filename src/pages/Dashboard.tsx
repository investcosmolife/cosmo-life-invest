
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TelegramLayout } from '@/components/TelegramLayout';
import { ArrowUp, TrendingUp, Users, User, Wallet } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';
import { useTelegramWallet } from '@/hooks/useTelegramWallet';

// Обновленные данные для сервисов (месячная доходность)
const SERVICE_MONTHLY_REVENUE = {
  jobSearch: { monthlyRevenue: 5000000 },
  taxi: { monthlyRevenue: 3000000 },
  food: { monthlyRevenue: 2500000 },
  housing: { monthlyRevenue: 2500000 }
};

// Общие прогнозы
const TOTAL_YEARLY_FORECAST = 156000000; // USD/год
const INVESTMENT_AMOUNT = 100; // TON за 0.01%
const YEARLY_RETURN = 15600; // USD/год при покупке 0.01%
const ROI_PERCENTAGE = 5200; // % ROI в год

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

// Простой компонент личного кабинета
const PersonalCabinet = ({ onBack }: { onBack: () => void }) => {
  const { wallet } = useTelegramWallet();
  
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowUp className="h-4 w-4 rotate-[-90deg]" />
            </Button>
            <CardTitle className="text-xl font-bold">Личный кабинет</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm">Кошелек подключен</p>
              <p className="text-xs">{wallet.address?.slice(0, 8)}...{wallet.address?.slice(-8)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>💰 Инвестиционные возможности</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0.01% = {INVESTMENT_AMOUNT} TON</div>
              <div className="text-sm text-gray-600">Минимальная инвестиция</div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Купить долю
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Компонент подключения кошелька
const WalletConnection = ({ onConnect }: { onConnect: () => void }) => {
  const { wallet, connectWallet, isLoading } = useTelegramWallet();
  
  const handleConnect = async () => {
    try {
      await connectWallet();
      onConnect();
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Подключение кошелька</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Для доступа к инвестициям необходимо подключить кошелек
          </p>
          <Button 
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Подключение...' : 'Подключить кошелек'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  const [showCabinet, setShowCabinet] = useState(false);
  const [showWalletConnection, setShowWalletConnection] = useState(false);
  
  const { user, hapticFeedback } = useTelegram();
  const { wallet, isLoading: walletLoading } = useTelegramWallet();

  const handleLoginToCabinet = () => {
    if (!wallet.isConnected) {
      hapticFeedback('medium');
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

  const totalMonthlyRevenue = Object.values(SERVICE_MONTHLY_REVENUE)
    .reduce((sum, service) => sum + (service?.monthlyRevenue || 0), 0);

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

  // Показываем личный кабинет
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <TrendingUp className="h-5 w-5" />
              Прогноз Инвестиционных возможностей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {formatCurrency(TOTAL_YEARLY_FORECAST)}/год
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Прогнозируемая годовая доходность при покупке 0,01% за {INVESTMENT_AMOUNT} TON = {formatCurrency(YEARLY_RETURN)}/год
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-blue-600">{ROI_PERCENTAGE.toLocaleString()}%</div>
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

        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-blue-800 flex items-center justify-center gap-2">
              🚀 Прогнозируемая Доходность наших сервисов в месяц - {formatCurrency(totalMonthlyRevenue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg border">
                <div className="text-2xl mb-2">💼</div>
                <div className="text-sm font-medium mb-1">Поиск работы</div>
                <div className="text-xs text-blue-600 font-bold">
                  {formatCurrency(SERVICE_MONTHLY_REVENUE.jobSearch.monthlyRevenue)}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border">
                <div className="text-2xl mb-2">🚗</div>
                <div className="text-sm font-medium mb-1">Заказ такси</div>
                <div className="text-xs text-green-600 font-bold">
                  {formatCurrency(SERVICE_MONTHLY_REVENUE.taxi.monthlyRevenue)}
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border">
                <div className="text-2xl mb-2">🍔</div>
                <div className="text-sm font-medium mb-1">Доставка еды</div>
                <div className="text-xs text-orange-600 font-bold">
                  {formatCurrency(SERVICE_MONTHLY_REVENUE.food.monthlyRevenue)}
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border">
                <div className="text-2xl mb-2">🏠</div>
                <div className="text-sm font-medium mb-1">Аренда жилья</div>
                <div className="text-xs text-purple-600 font-bold">
                  {formatCurrency(SERVICE_MONTHLY_REVENUE.housing.monthlyRevenue)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
      </div>
    </TelegramLayout>
  );
};
