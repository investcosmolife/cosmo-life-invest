
import { Card, CardContent } from '@/components/ui/card';
import { SERVICE_REVENUE } from '@/utils/investment';
import { formatCurrency } from '@/utils/investment';

interface ServiceCardProps {
  serviceKey: keyof typeof SERVICE_REVENUE;
  userPercentage?: number;
}

export const ServiceCard = ({ serviceKey, userPercentage = 1 }: ServiceCardProps) => {
  const service = SERVICE_REVENUE[serviceKey];
  const userRevenue = (userPercentage / 100) * service.totalRevenue;

  return (
    <Card className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-blue-900">{service.name}</h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Ваша доля {userPercentage}%</div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(userRevenue)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <span className="font-medium">Комиссия:</span> {(service.commission * 100)}%
          </div>
          <div>
            <span className="font-medium">Средний чек:</span> {formatCurrency(service.averageCheck)}
          </div>
          <div>
            <span className="font-medium">Заказов в год:</span> {service.ordersPerYear.toLocaleString('ru-RU')}
          </div>
          <div>
            <span className="font-medium">Общий доход:</span> {formatCurrency(service.totalRevenue)}
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-white rounded-lg border">
          <p className="text-xs text-gray-600">{service.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
