
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  { name: 'Поиск работы', emoji: '💼' },
  { name: 'Заказ такси', emoji: '🚗' },
  { name: 'Доставка еды', emoji: '🍔' },
  { name: 'Аренда жилья', emoji: '🏠' }
];

export const AboutApp = () => {
  return (
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
  );
};
