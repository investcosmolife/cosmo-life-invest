
import { Dashboard } from './Dashboard';

export default function Index() {
  console.log('Index component rendering...');
  try {
    return <Dashboard />;
  } catch (error) {
    console.error('Error rendering Dashboard:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cosmo Life</h1>
          <p className="text-gray-600">Загрузка приложения...</p>
        </div>
      </div>
    );
  }
}
