
import { InvestmentData } from '@/types/telegram';

// Revenue calculations for each service at 1M users
export const SERVICE_REVENUE = {
  job: {
    name: 'Cosmo Job',
    commission: 0.10,
    averageCheck: 20,
    ordersPerYear: 500000,
    totalRevenue: 10000000,
    description: 'Поиск работы'
  },
  taxi: {
    name: 'Cosmo Taxi',
    commission: 0.10,
    averageCheck: 10,
    ordersPerYear: 300000,
    totalRevenue: 3000000,
    description: 'Заказ такси'
  },
  food: {
    name: 'Cosmo Food',
    commission: 0.025,
    averageCheck: 15,
    ordersPerYear: 400000,
    totalRevenue: 1500000,
    description: 'Доставка еды'
  },
  rent: {
    name: 'Cosmo Rent',
    commission: 0.025,
    averageCheck: 50,
    ordersPerYear: 50000,
    totalRevenue: 1875000,
    description: 'Аренда недвижимости'
  }
};

// Function to get TON price from Telegram wallet
export const getTonPrice = async (): Promise<number> => {
  try {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      // Try to get TON price from Telegram wallet API
      // This is a placeholder - actual implementation depends on Telegram wallet API
      return new Promise((resolve) => {
        // Simulate API call - in real implementation this would use actual Telegram wallet API
        setTimeout(() => {
          // Default to approximately current TON price
          resolve(2.5); // TON ≈ 2.5 USD as fallback
        }, 100);
      });
    }
    
    // Fallback: try to fetch from public API
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd');
    const data = await response.json();
    return data['the-open-network']?.usd || 2.5;
  } catch (error) {
    console.log('Error fetching TON price:', error);
    // Fallback price
    return 2.5;
  }
};

export const calculateInvestmentReturns = async (percentage: number): Promise<InvestmentData> => {
  const tonAmount = percentage * 1000; // 1% = 1,000 TON, so 0.01% = 10 TON
  const tonPrice = await getTonPrice();
  const usdAmount = tonAmount * tonPrice;
  
  // Calculate projected annual return based on percentage ownership
  const totalProjectedRevenue = Object.values(SERVICE_REVENUE)
    .reduce((sum, service) => sum + service.totalRevenue, 0);
  
  const projectedAnnualReturn = (percentage / 100) * totalProjectedRevenue;
  
  return {
    percentage,
    tonAmount,
    usdAmount,
    projectedAnnualReturn,
    tonPrice
  };
};

// Synchronous version for components that need immediate calculation
export const calculateInvestmentReturnsSync = (percentage: number, tonPrice: number = 2.5): InvestmentData => {
  const tonAmount = percentage * 1000; // 1% = 1,000 TON, so 0.01% = 10 TON
  const usdAmount = tonAmount * tonPrice;
  
  // Calculate projected annual return based on percentage ownership
  const totalProjectedRevenue = Object.values(SERVICE_REVENUE)
    .reduce((sum, service) => sum + service.totalRevenue, 0);
  
  const projectedAnnualReturn = (percentage / 100) * totalProjectedRevenue;
  
  return {
    percentage,
    tonAmount,
    usdAmount,
    projectedAnnualReturn,
    tonPrice
  };
};

export const getInvestmentLimits = () => ({
  min: { percentage: 0.01, ton: 10 },
  max: { percentage: 20, ton: 20000 },
  example: { percentage: 1, ton: 1000 }
});

export const formatCurrency = (amount: number, currency: 'USD' | 'TON' = 'USD'): string => {
  if (currency === 'TON') {
    return `${amount.toLocaleString('ru-RU')} TON`;
  }
  
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Wallet address for receiving payments
export const COSMO_WALLET_ADDRESS = 'UQBDN8ARRy-7qUYEmx9v6IxaMmcfHrbTrh6ZiFVQnzmsqyBi';
