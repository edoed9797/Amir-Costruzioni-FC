import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentAlerts = ({ payments }) => {
  const overdueFees = payments?.filter(payment => payment?.status === 'overdue');
  const upcomingFees = payments?.filter(payment => payment?.status === 'upcoming');

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border card-shadow p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="CreditCard" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Payment Status</h2>
      </div>
      {overdueFees?.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">Overdue Payments</span>
          </div>
          <div className="space-y-2">
            {overdueFees?.map((payment) => (
              <div key={payment?.id} className="flex items-center justify-between p-2 bg-error/10 border border-error/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">{payment?.description}</div>
                  <div className="text-xs text-muted-foreground">Due: {formatDueDate(payment?.dueDate)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-error">{formatAmount(payment?.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {upcomingFees?.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Upcoming Payments</span>
          </div>
          <div className="space-y-2">
            {upcomingFees?.map((payment) => (
              <div key={payment?.id} className="flex items-center justify-between p-2 bg-warning/10 border border-warning/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">{payment?.description}</div>
                  <div className="text-xs text-muted-foreground">Due: {formatDueDate(payment?.dueDate)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-warning">{formatAmount(payment?.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {overdueFees?.length === 0 && upcomingFees?.length === 0 && (
        <div className="text-center py-6">
          <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">All payments are up to date!</p>
        </div>
      )}
      <Button
        variant="outline"
        fullWidth
        iconName="ExternalLink"
        iconPosition="right"
        iconSize={16}
        className="mt-4"
      >
        Manage Payments
      </Button>
    </div>
  );
};

export default PaymentAlerts;