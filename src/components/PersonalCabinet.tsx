
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTelegram } from '@/hooks/useTelegram';
import { useTelegramWallet } from '@/hooks/useTelegramWallet';
import { calculateInvestmentReturnsSync, formatCurrency, COSMO_WALLET_ADDRESS, getTonPrice } from '@/utils/investment';
import { ArrowLeft, Wallet, TrendingUp, Plus, CheckCircle } from 'lucide-react';

interface PersonalCabinetProps {
  onBack: () => void;
}

export const PersonalCabinet = ({ onBack }: PersonalCabinetProps) => {
  const [percentage, setPercentage] = useState(0.01);
  const [tonPrice, setTonPrice] = useState(2.5);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { user, showAlert, hapticFeedback, notificationFeedback } = useTelegram();
  const { wallet, sendPayment } = useTelegramWallet();

  // Загружаем курс TON при монтировании компонента
  useEffect(() => {
    const fetchTonPrice = async () => {
      try {
        const price = await getTonPrice();
        setTonPrice(price);
      } catch (error) {
        console.log('Failed to fetch TON price, using fallback');
      } finally {
        setIsLoadingPrice(false);
      }
    };
    
    fetchTonPrice();
  }, []);

  const investment = calculateInvestmentReturnsSync(percentage, tonPrice);

  // Реальные данные - пока нулевые, так как нет покупок
  const totalInvestment = 0; // Реальная сумма инвестиций пользователя
  const totalDividends = 0; // Реальная сумма дивидендов

  const handlePurchase = async () => {
    if (!wallet.isConnected) {
      showAlert('Кошелек не подключен');
      return;
    }

    if (percentage < 0.01 || percentage > 20) {
      showAlert('Доля должна быть от 0.01% до 20%');
      return;
    }

    setIsLoading(true);
    hapticFeedback('medium');

    try {
      const amount = investment.tonAmount;
      const comment = `CosmoLife_${percentage}%_${user?.id || 'user'}`;
      
      console.log('Sending payment:', {
        amount,
        toAddress: COSMO_WALLET_ADDRESS,
        comment
      });
      
      const success = await sendPayment(amount, COSMO_WALLET_ADDRESS, comment);
      
      if (success) {
        showAlert(`Платеж на сумму ${investment.tonAmount} TON отправлен. После подтверждения транзакции доля будет добавлена в ваш портфель.`);
        notificationFeedback('success');
        setPercentage(0.01); // Сбрасываем форму
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      showAlert('Ошибка при отправке платежа');
      notificationFeedback('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with wallet info */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <CardTitle className="text-xl">Личный кабинет</CardTitle>
              <p className="text-blue-100 text-sm">
                {user?.first_name} {user?.last_name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="h-4 w-4 text-green-300" />
                <span className="text-green-300 text-xs">
                  Кошелек: {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </span>
              </div>
              {!isLoadingPrice && (
                <p className="text-blue-200 text-xs">
                  Курс TON: ${tonPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Holdings - показываем реальные данные */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Мои инвестиции
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{totalInvestment}%</div>
              <div className="text-sm text-gray-600">Общая доля</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-600">
                {formatCurrency(totalInvestment * 163750 / 100)}
              </div>
              <div className="text-sm text-gray-600">Прогноз/год</div>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm py-4">
            У вас пока нет инвестиций в проект
          </div>
        </CardContent>
      </Card>

      {/* Buy Shares */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Купить долю
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Процент владения (от 0.01% до 20%):
            </label>
            <Input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
              min={0.01}
              max={20}
              step={0.01}
              placeholder="0.01"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Стоимость:</span>
              <span className="font-bold">{investment.tonAmount} TON</span>
            </div>
            <div className="flex justify-between">
              <span>В USD:</span>
              <span className="font-bold">{formatCurrency(investment.usdAmount)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Прогноз доходности в год:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(investment.projectedAnnualReturn)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Адрес получения:</span>
              <span className="font-mono text-xs">
                {COSMO_WALLET_ADDRESS.slice(0, 8)}...{COSMO_WALLET_ADDRESS.slice(-8)}
              </span>
            </div>
            {!isLoadingPrice && (
              <div className="text-xs text-gray-600">
                Курс TON: ${tonPrice.toFixed(2)}
              </div>
            )}
          </div>

          <Button
            onClick={handlePurchase}
            disabled={isLoading || isLoadingPrice || percentage < 0.01 || percentage > 20 || !wallet.isConnected}
            className="w-full bg-green-600 hover:bg-green-700 font-bold py-3"
          >
            {isLoading ? 'Отправка платежа...' : 
             isLoadingPrice ? 'Загрузка курса...' :
             !wallet.isConnected ? 'Кошелек не подключен' :
             `💰 Купить ${percentage}% за ${investment.tonAmount} TON`}
          </Button>

          <div className="text-xs text-center text-gray-500">
            💡 Платеж будет отправлен через ваш кошелек Telegram
          </div>
        </CardContent>
      </Card>

      {/* Dividends - показываем реальные данные */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Дивиденды
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-3 bg-gray-50 rounded-lg mb-4">
            <div className="text-2xl font-bold text-gray-600">
              {formatCurrency(totalDividends)}
            </div>
            <div className="text-sm text-gray-600">Общая сумма дивидендов</div>
          </div>

          <div className="text-center text-gray-500 text-sm py-4">
            У вас пока нет дивидендов
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 Дивиденды выплачиваются ежемесячно на основе фактической прибыли проекта. 
              Вы можете выбрать валюту для получения: TON или USDT в сети TON.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
