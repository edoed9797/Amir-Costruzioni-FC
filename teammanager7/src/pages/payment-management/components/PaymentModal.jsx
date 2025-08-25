import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentModal = ({ isOpen, onClose, payment, onSubmitPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethodOptions = [
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash Payment' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const paymentData = {
        paymentId: payment?.id,
        method: paymentMethod,
        amount: payment?.amount,
        processedAt: new Date()?.toISOString(),
        ...(paymentMethod === 'card' && {
          cardLast4: cardNumber?.slice(-4),
          cardName
        })
      };

      onSubmitPayment(paymentData);
      setIsProcessing(false);
      onClose();
      
      // Reset form
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardName('');
    }, 2000);
  };

  const handleCardNumberChange = (e) => {
    const value = e?.target?.value?.replace(/\D/g, '');
    const formattedValue = value?.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e) => {
    const value = e?.target?.value?.replace(/\D/g, '');
    const formattedValue = value?.replace(/(\d{2})(?=\d)/, '$1/');
    setExpiryDate(formattedValue);
  };

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-1200 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border modal-shadow w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="CreditCard" size={20} className="text-primary" />
            Make Payment
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isProcessing}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Payment Details */}
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-medium text-foreground mb-2">{payment?.title}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold text-foreground">{formatCurrency(payment?.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due Date:</span>
              <span className="text-foreground">{formatDate(payment?.dueDate)}</span>
            </div>
            {payment?.description && (
              <p className="text-muted-foreground mt-2">{payment?.description}</p>
            )}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Select
            label="Payment Method"
            options={paymentMethodOptions}
            value={paymentMethod}
            onChange={setPaymentMethod}
            required
          />

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <Input
                label="Cardholder Name"
                type="text"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e?.target?.value)}
                required
              />

              <Input
                label="Card Number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  required
                />

                <Input
                  label="CVV"
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e?.target?.value?.replace(/\D/g, ''))}
                  maxLength={4}
                  required
                />
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Shield" size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">PayPal Payment</span>
              </div>
              <p className="text-sm text-blue-700">
                You will be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          )}

          {paymentMethod === 'bank' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Building" size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-800">Bank Transfer</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Account:</strong> TeamManager7 FC</p>
                <p><strong>Account Number:</strong> 1234567890</p>
                <p><strong>Routing:</strong> 021000021</p>
                <p><strong>Reference:</strong> {payment?.id}</p>
              </div>
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Banknote" size={16} className="text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Cash Payment</span>
              </div>
              <p className="text-sm text-yellow-700">
                Please bring exact change to the next training session or contact the treasurer.
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <Icon name="Lock" size={16} className="text-gray-600 mt-0.5" />
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">Secure Payment</p>
              <p>Your payment information is encrypted and secure. We never store your card details.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="default"
              loading={isProcessing}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : `Pay ${formatCurrency(payment?.amount)}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;