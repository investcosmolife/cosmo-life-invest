
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  { name: 'Поиск работы', emoji: '💼', revenue: '$5,000,000' },
  { name: 'Заказ такси', emoji: '🚗', revenue: '$3,000,000' },
  { name: 'Доставка еды', emoji: '🍔', revenue: '$2,500,000' },
  { name: 'Аренда жилья', emoji: '🏠', revenue: '$2,500,000' }
];

export const ServiceRevenue = () => {
  return (
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
  );
};
