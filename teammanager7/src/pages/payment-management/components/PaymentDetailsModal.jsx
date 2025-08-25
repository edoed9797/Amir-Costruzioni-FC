import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentDetailsModal = ({ isOpen, onClose, payment }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'paid':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
          icon: 'CheckCircle'
        };
      case 'overdue':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
          icon: 'AlertCircle'
        };
      case 'pending':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200',
          icon: 'Clock'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200',
          icon: 'Circle'
        };
    }
  };

  if (!isOpen || !payment) return null;

  const statusConfig = getStatusConfig(payment?.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-1200 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border modal-shadow w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="FileText" size={20} className="text-primary" />
            Payment Details
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border ${statusConfig?.bgColor}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon name={statusConfig?.icon} size={20} className={statusConfig?.color} />
              <span className={`font-semibold ${statusConfig?.color}`}>
                {payment?.status?.charAt(0)?.toUpperCase() + payment?.status?.slice(1)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{payment?.title}</h3>
            {payment?.description && (
              <p className="text-muted-foreground mt-1">{payment?.description}</p>
            )}
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Icon name="Info" size={16} className="text-primary" />
              Payment Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <p className="text-lg font-semibold text-foreground">{formatCurrency(payment?.amount)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                  <p className={`font-medium ${payment?.status === 'overdue' ? 'text-red-600' : 'text-foreground'}`}>
                    {formatDate(payment?.dueDate)}
                  </p>
                </div>

                {payment?.category && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <p className="text-foreground">{payment?.category}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {payment?.paidDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Paid Date</label>
                    <p className="text-green-600 font-medium">
                      {formatDate(payment?.paidDate)}
                      <span className="text-sm text-muted-foreground block">
                        at {formatTime(payment?.paidDate)}
                      </span>
                    </p>
                  </div>
                )}

                {payment?.paymentMethod && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                    <p className="text-foreground capitalize">{payment?.paymentMethod}</p>
                  </div>
                )}

                {payment?.transactionId && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                    <p className="text-foreground font-mono text-sm">{payment?.transactionId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Player Information (for admin view) */}
          {payment?.playerName && (
            <div className="space-y-4">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Icon name="User" size={16} className="text-primary" />
                Player Information
              </h4>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {payment?.playerName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{payment?.playerName}</p>
                  {payment?.playerEmail && (
                    <p className="text-sm text-muted-foreground">{payment?.playerEmail}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Payment History */}
          {payment?.history && payment?.history?.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Icon name="History" size={16} className="text-primary" />
                Payment History
              </h4>

              <div className="space-y-2">
                {payment?.history?.map((entry, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Icon 
                      name={entry?.type === 'payment' ? 'CreditCard' : 'Bell'} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{entry?.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(entry?.date)} at {formatTime(entry?.date)}
                      </p>
                    </div>
                    {entry?.amount && (
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(entry?.amount)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {payment?.notes && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Icon name="MessageSquare" size={16} className="text-primary" />
                Notes
              </h4>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-foreground">{payment?.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;