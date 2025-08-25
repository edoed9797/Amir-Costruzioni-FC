import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentSummaryCard = ({ summary }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const summaryItems = [
    {
      label: 'Total Outstanding',
      value: formatCurrency(summary?.totalOutstanding),
      icon: 'AlertTriangle',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Total Paid',
      value: formatCurrency(summary?.totalPaid),
      icon: 'CheckCircle',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Pending Payments',
      value: summary?.pendingCount?.toString(),
      icon: 'Clock',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Next Due Date',
      value: summary?.nextDueDate ? new Date(summary.nextDueDate)?.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }) : 'None',
      icon: 'Calendar',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4 card-shadow">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="DollarSign" size={20} className="text-primary" />
        Payment Summary
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryItems?.map((item, index) => (
          <div key={index} className={`p-3 rounded-lg ${item?.bgColor} border border-opacity-20`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon name={item?.icon} size={16} className={item?.color} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {item?.label}
              </span>
            </div>
            <div className={`text-lg font-bold ${item?.color}`}>
              {item?.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentSummaryCard;