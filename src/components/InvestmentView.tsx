
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InvestmentViewProps {
  onBack: () => void;
}

export const InvestmentView = ({ onBack }: InvestmentViewProps) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
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
};
