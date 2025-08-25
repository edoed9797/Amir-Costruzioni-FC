import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import MobileNavigationDrawer from '../../components/ui/MobileNavigationDrawer';
import PaymentStatusCard from './components/PaymentStatusCard';
import PaymentSummaryCard from './components/PaymentSummaryCard';
import PaymentHistoryTable from './components/PaymentHistoryTable';
import PaymentModal from './components/PaymentModal';
import PaymentDetailsModal from './components/PaymentDetailsModal';
import FinancialReportsSection from './components/FinancialReportsSection';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PaymentManagement = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [userRole, setUserRole] = useState('player'); // 'player' or 'admin'
  const [currentUser, setCurrentUser] = useState({ id: 1, name: 'John Doe', role: 'Player' });

  // Mock payment data
  const [payments, setPayments] = useState([
    {
      id: 'PAY001',
      title: 'Monthly Team Fee - August 2025',
      description: 'Regular monthly contribution for team expenses including field rental and equipment maintenance.',
      amount: 75.00,
      dueDate: '2025-08-31',
      status: 'overdue',
      category: 'Monthly Fees',
      playerName: 'John Doe',
      playerEmail: 'john.doe@email.com',
      history: [
        {
          type: 'reminder',
          action: 'Payment reminder sent',
          date: '2025-08-25T10:00:00Z'
        },
        {
          type: 'created',
          action: 'Payment request created',
          date: '2025-08-01T09:00:00Z'
        }
      ]
    },
    {
      id: 'PAY002',
      title: 'Tournament Entry Fee - Fall Championship',
      description: 'Entry fee for the Fall Championship tournament scheduled for September 2025.',
      amount: 120.00,
      dueDate: '2025-09-15',
      status: 'pending',
      category: 'Tournament Entry',
      playerName: 'John Doe',
      playerEmail: 'john.doe@email.com'
    },
    {
      id: 'PAY003',
      title: 'Monthly Team Fee - July 2025',
      description: 'Regular monthly contribution for team expenses.',
      amount: 75.00,
      dueDate: '2025-07-31',
      paidDate: '2025-07-28T14:30:00Z',
      status: 'paid',
      category: 'Monthly Fees',
      playerName: 'John Doe',
      playerEmail: 'john.doe@email.com',
      paymentMethod: 'card',
      transactionId: 'TXN789012345',
      history: [
        {
          type: 'payment',
          action: 'Payment completed via Credit Card',
          date: '2025-07-28T14:30:00Z',
          amount: 75.00
        }
      ]
    },
    {
      id: 'PAY004',
      title: 'Equipment Fund Contribution',
      description: 'Contribution towards new training equipment and jerseys for the upcoming season.',
      amount: 50.00,
      dueDate: '2025-09-01',
      status: 'pending',
      category: 'Equipment',
      playerName: 'John Doe',
      playerEmail: 'john.doe@email.com'
    },
    // Additional payments for admin view
    {
      id: 'PAY005',
      title: 'Monthly Team Fee - August 2025',
      description: 'Regular monthly contribution for team expenses.',
      amount: 75.00,
      dueDate: '2025-08-31',
      paidDate: '2025-08-20T16:45:00Z',
      status: 'paid',
      category: 'Monthly Fees',
      playerName: 'Mike Rodriguez',
      playerEmail: 'mike.rodriguez@email.com',
      paymentMethod: 'paypal',
      transactionId: 'PP123456789'
    },
    {
      id: 'PAY006',
      title: 'Tournament Entry Fee - Fall Championship',
      description: 'Entry fee for the Fall Championship tournament.',
      amount: 120.00,
      dueDate: '2025-09-15',
      status: 'overdue',
      category: 'Tournament Entry',
      playerName: 'David Wilson',
      playerEmail: 'david.wilson@email.com'
    }
  ]);

  // Calculate payment summary
  const paymentSummary = {
    totalOutstanding: payments?.filter(p => p?.status !== 'paid' && (userRole === 'admin' || p?.playerName === currentUser?.name))?.reduce((sum, p) => sum + p?.amount, 0),
    totalPaid: payments?.filter(p => p?.status === 'paid' && (userRole === 'admin' || p?.playerName === currentUser?.name))?.reduce((sum, p) => sum + p?.amount, 0),
    pendingCount: payments?.filter(p => p?.status !== 'paid' && (userRole === 'admin' || p?.playerName === currentUser?.name))?.length,
    nextDueDate: payments?.filter(p => p?.status !== 'paid' && (userRole === 'admin' || p?.playerName === currentUser?.name))?.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))?.[0]?.dueDate
  };

  // Filter payments based on user role
  const filteredPayments = userRole === 'admin' 
    ? payments 
    : payments?.filter(p => p?.playerName === currentUser?.name);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handlePayNow = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  const handleSubmitPayment = (paymentData) => {
    // Update payment status
    setPayments(prevPayments =>
      prevPayments?.map(payment =>
        payment?.id === paymentData?.paymentId
          ? {
              ...payment,
              status: 'paid',
              paidDate: paymentData?.processedAt,
              paymentMethod: paymentData?.method,
              transactionId: `TXN${Date.now()}`,
              ...(paymentData?.cardLast4 && { cardLast4: paymentData?.cardLast4 }),
              ...(paymentData?.cardName && { cardName: paymentData?.cardName })
            }
          : payment
      )
    );

    // Show success message (you can implement a toast notification here)
    console.log('Payment processed successfully:', paymentData);
  };

  const handleSendReminder = (payment) => {
    // Implement reminder functionality
    console.log('Sending reminder for payment:', payment?.id);
    
    // Update payment history
    setPayments(prevPayments =>
      prevPayments?.map(p =>
        p?.id === payment?.id
          ? {
              ...p,
              history: [
                {
                  type: 'reminder',
                  action: 'Payment reminder sent',
                  date: new Date()?.toISOString()
                },
                ...(p?.history || [])
              ]
            }
          : p
      )
    );
  };

  const handleExportReport = (reportData) => {
    // Implement export functionality
    console.log('Exporting report:', reportData);
    
    // Simulate file download
    const filename = `payment-report-${reportData?.type}-${reportData?.year}.${reportData?.format}`;
    console.log(`Downloading ${filename}...`);
  };

  const toggleUserRole = () => {
    setUserRole(userRole === 'player' ? 'admin' : 'player');
    setCurrentUser(prev => ({
      ...prev,
      role: userRole === 'player' ? 'Treasurer' : 'Player'
    }));
  };

  // Outstanding payments for quick access
  const outstandingPayments = filteredPayments?.filter(p => p?.status !== 'paid');

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader
        isDrawerOpen={isDrawerOpen}
        onDrawerToggle={handleDrawerToggle}
        user={currentUser}
      />
      <MobileNavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={currentUser}
      />
      <main className="pt-14 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Icon name="CreditCard" size={24} className="text-primary" />
                Payment Management
              </h1>
              <p className="text-muted-foreground mt-1">
                {userRole === 'admin' ?'Manage team payments and financial reports' :'View your payment status and make payments'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Role Toggle for Demo */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleUserRole}
                iconName={userRole === 'admin' ? 'User' : 'Shield'}
                iconPosition="left"
              >
                {userRole === 'admin' ? 'Player View' : 'Admin View'}
              </Button>

              {userRole === 'admin' && (
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Payment
                </Button>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mb-6">
            <PaymentSummaryCard summary={paymentSummary} />
          </div>

          {/* Outstanding Payments - Card View for Mobile */}
          {outstandingPayments?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="AlertCircle" size={20} className="text-red-600" />
                Outstanding Payments ({outstandingPayments?.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:hidden">
                {outstandingPayments?.map((payment) => (
                  <PaymentStatusCard
                    key={payment?.id}
                    payment={payment}
                    onPayNow={handlePayNow}
                    onViewDetails={handleViewDetails}
                    userRole={userRole}
                  />
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <PaymentHistoryTable
                  payments={outstandingPayments}
                  onViewDetails={handleViewDetails}
                  onSendReminder={handleSendReminder}
                  userRole={userRole}
                />
              </div>
            </div>
          )}

          {/* All Payments History */}
          <div className="mb-6">
            <PaymentHistoryTable
              payments={filteredPayments}
              onViewDetails={handleViewDetails}
              onSendReminder={handleSendReminder}
              userRole={userRole}
            />
          </div>

          {/* Financial Reports - Admin Only */}
          {userRole === 'admin' && (
            <div className="mb-6">
              <FinancialReportsSection
                payments={payments}
                onExportReport={handleExportReport}
              />
            </div>
          )}
        </div>
      </main>
      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        payment={selectedPayment}
        onSubmitPayment={handleSubmitPayment}
      />
      <PaymentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        payment={selectedPayment}
      />
    </div>
  );
};

export default PaymentManagement;