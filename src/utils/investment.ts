
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

export const calculateInvestmentReturns = (percentage: number): InvestmentData => {
  const tonAmount = percentage * 1000; // 1% = 1,000 TON, so 0.001% = 1 TON
  const usdAmount = tonAmount * 1; // Assuming 1 TON ≈ 1 USD for simplicity
  
  // Calculate projected annual return based on percentage ownership
  const totalProjectedRevenue = Object.values(SERVICE_REVENUE)
    .reduce((sum, service) => sum + service.totalRevenue, 0);
  
  const projectedAnnualReturn = (percentage / 100) * totalProjectedRevenue;
  
  return {
    percentage,
    tonAmount,
    usdAmount,
    projectedAnnualReturn
  };
};

export const getInvestmentLimits = () => ({
  min: { percentage: 0.001, ton: 1 },
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
