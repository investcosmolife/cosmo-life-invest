
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, User, Wallet } from 'lucide-react';

const Dashboard = () => {
  const [showInvestment, setShowInvestment] = useState(false);
  
  // Простые данные о сервисах
  const services = [
    { name: 'Поиск работы', emoji: '💼', revenue: '$5,000,000' },
    { name: 'Заказ такси', emoji: '🚗', revenue: '$3,000,000' },
    { name: 'Доставка еды', emoji: '🍔', revenue: '$2,500,000' },
    { name: 'Аренда жилья', emoji: '🏠', revenue: '$2,500,000' }
  ];

  if (showInvestment) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto space-y-4">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInvestment(false)}
                  className="text-white hover:bg-white/20"
                >
                  ← Назад
                </Button>
                <CardTitle>Инвестиции</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-3 mb-4">
                  <p className="text-sm">Кошелек подключен</p>
                  <p className="text-xs">UQBmock...12345678</p>
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
                  <div className="text-2xl font-bold text-green-600">0.01% = 100 TON</div>
                  <div className="text-sm text-gray-600">Минимальная инвестиция</div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Купить долю
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Главная карточка */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardHeader className="text-center">
            <div className="text-3xl mb-2">🌟</div>
            <CardTitle className="text-2xl font-bold">Cosmo Life</CardTitle>
            <p className="text-purple-100">Суперприложение с ИИ-агентом</p>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-sm mb-2">Добро пожаловать, Инвестор! 👋</p>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Цель: 1M пользователей</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Инвестиционные возможности */}
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <TrendingUp className="h-5 w-5" />
              Инвестиционные возможности
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-green-600 mb-2">
                $156,000,000/год
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Прогнозируемая годовая доходность при покупке 0,01% за 100 TON = $15,600/год
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-blue-600">5,200%</div>
                <div className="text-xs text-gray-600">ROI в год</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-purple-600">0.01-20%</div>
                <div className="text-xs text-gray-600">Доступные доли</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowInvestment(true)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                💰 Купить долю
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowInvestment(true)}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Кабинет
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Доходность сервисов */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-blue-800">
              🚀 Прогнозируемая доходность наших сервисов в месяц - $13,000,000
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {services.map((service, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl mb-2">{service.emoji}</div>
                  <div className="text-sm font-medium mb-1">{service.name}</div>
                  <div className="text-xs text-blue-600 font-bold">
                    {service.revenue}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* О приложении */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">🤖 О Cosmo Life</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700 text-center">
              Революционное суперприложение с ИИ-агентом, который автоматизирует повседневные задачи:
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {services.map((service, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">{service.emoji}</div>
                  <div className="text-xs font-medium">{service.name}</div>
                </div>
              ))}
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
    </div>
  );
};

export default Dashboard;
