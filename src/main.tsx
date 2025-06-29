
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

console.log('Starting Cosmo Life app...');

const root = createRoot(container);

try {
  root.render(<App />);
  console.log('App rendered successfully');
} catch (error) {
  console.error('Failed to render app:', error);
  container.innerHTML = '<div style="padding: 20px; text-align: center;">Ошибка загрузки приложения. Попробуйте обновить страницу.</div>';
}
