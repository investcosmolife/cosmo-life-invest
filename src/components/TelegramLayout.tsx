
import { useEffect } from 'react';
import { useTelegram } from '@/hooks/useTelegram';

interface TelegramLayoutProps {
  children: React.ReactNode;
}

export const TelegramLayout = ({ children }: TelegramLayoutProps) => {
  const { tg } = useTelegram();

  useEffect(() => {
    if (tg) {
      // Set up Telegram WebApp theme
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor);
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
      document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
      document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color);
      document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
      document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
      
      // Prevent zoom and enable smooth scrolling
      document.body.style.overscrollBehavior = 'none';
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    }
  }, [tg]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2 max-w-md">
        {children}
      </div>
    </div>
  );
};
