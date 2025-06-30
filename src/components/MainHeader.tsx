
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const MainHeader = () => {
  return (
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
  );
};
