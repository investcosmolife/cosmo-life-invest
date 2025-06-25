import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTelegram } from '@/hooks/useTelegram';
import { useTelegramWallet } from '@/hooks/useTelegramWallet';
import { calculateInvestmentReturnsSync, formatCurrency, COSMO_WALLET_ADDRESS, getTonPrice } from '@/utils/investment';
import { UserInvestment, Dividend } from '@/types/telegram';
import { ArrowLeft, Wallet, TrendingUp, Download, Plus, CheckCircle } from 'lucide-react';

interface PersonalCabinetProps {
  onBack: () => void;
}

export const PersonalCabinet = ({ onBack }: PersonalCabinetProps) => {
  const [percentage, setPercentage] = useState(0.01);
  const [tonPrice, setTonPrice] = useState(2.5);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, showAlert, hapticFeedback, notificationFeedback } = useTelegram();
  const { wallet, sendPayment } = useTelegramWallet();

  // Fetch TON price on component mount
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

  // Mock data for demonstration
  useEffect(() => {
    // Simulate existing investments
    const mockInvestments: UserInvestment[] = [
      {
        id: '1',
        userId: user?.id || 0,
        percentage: 1,
        tonAmount: 1000,
        usdAmount: 1000 * tonPrice,
        purchaseDate: new Date('2024-01-15'),
        status: 'completed',
        transactionHash: 'abc123'
      }
    ];

    const mockDividends: Dividend[] = [
      {
        id: '1',
        userId: user?.id || 0,
        amount: 13645.83,
        currency: 'USDT',
        date: new Date('2024-06-01'),
        status: 'paid',
        transactionHash: 'div123'
      }
    ];

    setInvestments(mockInvestments);
    setDividends(mockDividends);
  }, [user?.id, tonPrice]);

  const investment = calculateInvestmentReturnsSync(percentage, tonPrice);
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.percentage, 0);
  const totalDividends = dividends.reduce((sum, div) => sum + div.amount, 0);

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
      const comment = `CosmoLife_${percentage}%_${user?.id}`;
      
      console.log('Sending payment:', {
        amount,
        toAddress: COSMO_WALLET_ADDRESS,
        comment
      });
      
      const success = await sendPayment(amount, COSMO_WALLET_ADDRESS, comment);
      
      if (success) {
        showAlert(`Платеж на сумму ${investment.tonAmount} TON отправлен. После подтверждения транзакции доля будет добавлена в ваш портфель.`);
        notificationFeedback('success');
        
        // Add pending investment
        const newInvestment: UserInvestment = {
          id: Date.now().toString(),
          userId: user?.id || 0,
          percentage,
          tonAmount: investment.tonAmount,
          usdAmount: investment.usdAmount,
          purchaseDate: new Date(),
          status: 'pending'
        };
        
        setInvestments(prev => [...prev, newInvestment]);
        setPercentage(0.01); // Reset form
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      showAlert('Ошибка при отправке платежа');
      notificationFeedback('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawDividends = (dividendId: string, currency: 'TON' | 'USDT') => {
    hapticFeedback('light');
    showAlert(`Запрос на вывод дивидендов в ${currency} отправлен. Средства поступят на ваш кошелек в течение 24 часов.`);
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

      {/* Current Holdings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Мои инвестиции
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalInvestment}%</div>
              <div className="text-sm text-gray-600">Общая доля</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(totalInvestment * 163750 / 100)}
              </div>
              <div className="text-sm text-gray-600">Прогноз/год</div>
            </div>
          </div>

          {investments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">История покупок:</h4>
              {investments.map((inv) => (
                <div key={inv.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{inv.percentage}%</div>
                    <div className="text-xs text-gray-600">
                      {inv.purchaseDate.toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{inv.tonAmount} TON</div>
                    <div className="text-xs text-gray-500">{formatCurrency(inv.usdAmount)}</div>
                    <div className={`text-xs ${
                      inv.status === 'completed' ? 'text-green-600' : 
                      inv.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {inv.status === 'completed' ? 'Завершено' : 
                       inv.status === 'pending' ? 'Ожидание' : 'Ошибка'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Buy More Shares */}
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

      {/* Dividends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Дивиденды
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-3 bg-yellow-50 rounded-lg mb-4">
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(totalDividends)}
            </div>
            <div className="text-sm text-gray-600">Общая сумма дивидендов</div>
          </div>

          {dividends.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">История дивидендов:</h4>
              {dividends.map((dividend) => (
                <div key={dividend.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">
                      {dividend.amount.toLocaleString('ru-RU')} {dividend.currency}
                    </div>
                    <div className="text-xs text-gray-600">
                      {dividend.date.toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs mb-1 ${
                      dividend.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {dividend.status === 'paid' ? 'Выплачено' : 'Ожидание'}
                    </div>
                    {dividend.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWithdrawDividends(dividend.id, 'TON')}
                          className="text-xs px-2 py-1 h-6"
                        >
                          TON
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWithdrawDividends(dividend.id, 'USDT')}
                          className="text-xs px-2 py-1 h-6"
                        >
                          USDT
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

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
