
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, User } from 'lucide-react';

interface InvestmentOpportunityProps {
  onInvestClick: () => void;
}

export const InvestmentOpportunity = ({ onInvestClick }: InvestmentOpportunityProps) => {
  return (
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
            onClick={onInvestClick}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            💰 Купить долю
          </Button>
          <Button
            variant="outline"
            onClick={onInvestClick}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Кабинет
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
