import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentHistoryTable = ({ payments, onViewDetails, onSendReminder, userRole = 'player' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'playerName', label: 'Player Name' },
    { value: 'status', label: 'Status' }
  ];

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', icon: 'CheckCircle' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: 'Clock' },
      overdue: { color: 'bg-red-100 text-red-800', icon: 'AlertCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const filteredAndSortedPayments = payments?.filter(payment => {
      const matchesSearch = userRole === 'admin' 
        ? payment?.playerName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          payment?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        : payment?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || payment?.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];

      if (sortBy === 'dueDate' || sortBy === 'paidDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border card-shadow">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="History" size={20} className="text-primary" />
          Payment History
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder={userRole === 'admin' ? "Search by player or payment..." : "Search payments..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
              className="w-40"
            />
            
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              className="w-40"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {userRole === 'admin' && (
                <th className="text-left p-3 font-medium text-muted-foreground">
                  <button
                    onClick={() => handleSort('playerName')}
                    className="flex items-center gap-1 hover:text-foreground transition-smooth"
                  >
                    Player
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
              )}
              
              <th className="text-left p-3 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-1 hover:text-foreground transition-smooth"
                >
                  Payment
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              
              <th className="text-left p-3 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center gap-1 hover:text-foreground transition-smooth"
                >
                  Amount
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              
              <th className="text-left p-3 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center gap-1 hover:text-foreground transition-smooth"
                >
                  Due Date
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              
              <th className="text-left p-3 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1 hover:text-foreground transition-smooth"
                >
                  Status
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              
              <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {filteredAndSortedPayments?.map((payment) => (
              <tr key={payment?.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
                {userRole === 'admin' && (
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {payment?.playerName?.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{payment?.playerName}</span>
                    </div>
                  </td>
                )}
                
                <td className="p-3">
                  <div>
                    <div className="font-medium text-foreground">{payment?.title}</div>
                    {payment?.description && (
                      <div className="text-sm text-muted-foreground">{payment?.description}</div>
                    )}
                  </div>
                </td>
                
                <td className="p-3">
                  <span className="font-semibold text-foreground">
                    {formatCurrency(payment?.amount)}
                  </span>
                </td>
                
                <td className="p-3">
                  <span className={`text-sm ${
                    payment?.status === 'overdue' ? 'text-red-600 font-medium' : 'text-foreground'
                  }`}>
                    {formatDate(payment?.dueDate)}
                  </span>
                  {payment?.paidDate && (
                    <div className="text-xs text-green-600">
                      Paid: {formatDate(payment?.paidDate)}
                    </div>
                  )}
                </td>
                
                <td className="p-3">
                  {getStatusBadge(payment?.status)}
                </td>
                
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(payment)}
                      iconName="Eye"
                    >
                      View
                    </Button>
                    
                    {userRole === 'admin' && payment?.status !== 'paid' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSendReminder(payment)}
                        iconName="Bell"
                      >
                        Remind
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedPayments?.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No payments found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryTable;