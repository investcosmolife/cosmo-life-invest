
import { Dashboard } from './Dashboard';

export default function Index() {
  console.log('Index component rendering...');
  
  try {
    return <Dashboard />;
  } catch (error) {
    console.error('Error rendering Dashboard:', error);
    
    // Fallback UI в случае ошибки
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Cosmo Life</h1>
          <p className="text-gray-600 mb-6">Суперприложение с ИИ-агентом</p>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-sm text-gray-500 mb-4">Загрузка приложения...</p>
            <div className="animate-pulse">
              <div className="h-2 bg-blue-200 rounded-full w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
