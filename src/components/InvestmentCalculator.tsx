
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateInvestmentReturns, getInvestmentLimits, formatCurrency } from '@/utils/investment';
import { useTelegram } from '@/hooks/useTelegram';

interface InvestmentCalculatorProps {
  onInvest: (percentage: number) => void;
}

export const InvestmentCalculator = ({ onInvest }: InvestmentCalculatorProps) => {
  const [percentage, setPercentage] = useState(1);
  const { hapticFeedback, notificationFeedback } = useTelegram();
  const limits = getInvestmentLimits();
  const investment = calculateInvestmentReturns(percentage);

  const handlePercentageChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= limits.min.percentage && num <= limits.max.percentage) {
      setPercentage(num);
      hapticFeedback('light');
    }
  };

  const handleInvest = () => {
    hapticFeedback('medium');
    notificationFeedback('success');
    onInvest(percentage);
  };

  const quickSelect = (value: number) => {
    setPercentage(value);
    hapticFeedback('light');
  };

  return (
    <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-0">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          💰 Калькулятор инвестиций
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Процент владения (%):
          </label>
          <Input
            type="number"
            value={percentage}
            onChange={(e) => handlePercentageChange(e.target.value)}
            min={limits.min.percentage}
            max={limits.max.percentage}
            step={0.01}
            className="bg-white text-black"
          />
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickSelect(0.1)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              0.1%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickSelect(1)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              1%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickSelect(5)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              5%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickSelect(10)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              10%
            </Button>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span>Стоимость:</span>
            <span className="font-bold">{formatCurrency(investment.tonAmount, 'TON')}</span>
          </div>
          <div className="flex justify-between">
            <span>В USD:</span>
            <span className="font-bold">{formatCurrency(investment.usdAmount)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Прогноз доходности в год:</span>
            <span className="font-bold text-yellow-300">
              {formatCurrency(investment.projectedAnnualReturn)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-green-300">
            <span>ROI:</span>
            <span className="font-bold">
              {((investment.projectedAnnualReturn / investment.usdAmount) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <Button
          onClick={handleInvest}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 text-lg"
        >
          🚀 Купить долю {percentage}%
        </Button>

        <div className="text-xs text-center text-white/80">
          Лимиты: от {limits.min.percentage}% до {limits.max.percentage}%
        </div>
      </CardContent>
    </Card>
  );
};
