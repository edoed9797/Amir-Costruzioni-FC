import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentStatusCard = ({ payment, onPayNow, onViewDetails, userRole = 'player' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'overdue':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return 'CheckCircle';
      case 'overdue':
        return 'AlertCircle';
      case 'pending':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-smooth ${getStatusColor(payment?.status)}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon 
            name={getStatusIcon(payment?.status)} 
            size={20} 
            className={payment?.status === 'paid' ? 'text-green-600' : payment?.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'}
          />
          <h3 className="font-semibold text-foreground">{payment?.title}</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          payment?.status === 'paid' ? 'bg-green-100 text-green-800' :
          payment?.status === 'overdue'? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {payment?.status?.charAt(0)?.toUpperCase() + payment?.status?.slice(1)}
        </span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Amount:</span>
          <span className="font-semibold text-foreground">{formatCurrency(payment?.amount)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Due Date:</span>
          <span className={`text-sm font-medium ${
            payment?.status === 'overdue' ? 'text-red-600' : 'text-foreground'
          }`}>
            {formatDate(payment?.dueDate)}
          </span>
        </div>

        {payment?.paidDate && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Paid Date:</span>
            <span className="text-sm text-green-600 font-medium">
              {formatDate(payment?.paidDate)}
            </span>
          </div>
        )}

        {payment?.description && (
          <p className="text-sm text-muted-foreground mt-2">{payment?.description}</p>
        )}
      </div>
      <div className="flex gap-2">
        {payment?.status !== 'paid' && (
          <Button
            variant="default"
            size="sm"
            onClick={() => onPayNow(payment)}
            iconName="CreditCard"
            iconPosition="left"
            className="flex-1"
          >
            Pay Now
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(payment)}
          iconName="Eye"
          iconPosition="left"
          className={payment?.status !== 'paid' ? 'flex-1' : 'w-full'}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default PaymentStatusCard;