
import { useState } from 'react';
import { MainHeader } from '@/components/MainHeader';
import { InvestmentOpportunity } from '@/components/InvestmentOpportunity';
import { ServiceRevenue } from '@/components/ServiceRevenue';
import { AboutApp } from '@/components/AboutApp';
import { InvestmentView } from '@/components/InvestmentView';

const Dashboard = () => {
  const [showInvestment, setShowInvestment] = useState(false);

  if (showInvestment) {
    return <InvestmentView onBack={() => setShowInvestment(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <MainHeader />
        <InvestmentOpportunity onInvestClick={() => setShowInvestment(true)} />
        <ServiceRevenue />
        <AboutApp />
      </div>
    </div>
  );
};

export default Dashboard;
