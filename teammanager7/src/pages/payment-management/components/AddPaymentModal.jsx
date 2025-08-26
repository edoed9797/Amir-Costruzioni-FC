import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddPaymentModal = ({ isOpen, onClose, onSave, teamPlayers = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    dueDate: '',
    category: 'Monthly Fees',
    assignTo: 'all', // 'all' or specific player IDs
    selectedPlayers: [],
    recurring: false,
    recurringPeriod: 'monthly'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categoryOptions = [
    { value: 'Monthly Fees', label: 'Monthly Fees' },
    { value: 'Tournament Entry', label: 'Tournament Entry' },
    { value: 'Equipment', label: 'Equipment' },
    { value: 'Training Camp', label: 'Training Camp' },
    { value: 'Referee Fees', label: 'Referee Fees' },
    { value: 'Other', label: 'Other' }
  ];

  const assignOptions = [
    { value: 'all', label: 'All Active Players' },
    { value: 'selected', label: 'Selected Players' }
  ];

  const recurringOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const playerOptions = teamPlayers?.map(player => ({
    value: player.id,
    label: `${player.name} (#${player.jerseyNumber})`
  })) || [];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.title?.trim()) {
      newErrors.title = 'Payment title is required';
    }
    
    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!formData?.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(formData?.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    if (formData?.assignTo === 'selected' && formData?.selectedPlayers?.length === 0) {
      newErrors.selectedPlayers = 'Please select at least one player';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const paymentData = {
        ...formData,
        amount: parseFloat(formData?.amount),
        id: `PAY${Date.now()}`,
        status: 'pending',
        createdAt: new Date()?.toISOString()
      };
      
      await onSave(paymentData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        dueDate: '',
        category: 'Monthly Fees',
        assignTo: 'all',
        selectedPlayers: [],
        recurring: false,
        recurringPeriod: 'monthly'
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setErrors({});
      onClose();
    }
  };

  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // 30 days from now
    return date.toISOString().split('T')[0];
  };

  React.useEffect(() => {
    if (isOpen && !formData?.dueDate) {
      setFormData(prev => ({
        ...prev,
        dueDate: getDefaultDueDate()
      }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-1200 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg modal-shadow w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Plus" size={20} className="text-primary" />
            Add New Payment Request
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isLoading}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input
            label="Payment Title"
            type="text"
            value={formData?.title}
            onChange={(e) => handleInputChange('title', e?.target?.value)}
            placeholder="e.g., Monthly Team Fee - September 2025"
            error={errors?.title}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description (Optional)</label>
            <textarea
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              placeholder="Additional details about this payment..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount (USD)"
              type="number"
              step="0.01"
              min="0"
              value={formData?.amount}
              onChange={(e) => handleInputChange('amount', e?.target?.value)}
              placeholder="0.00"
              error={errors?.amount}
              required
            />

            <Input
              label="Due Date"
              type="date"
              value={formData?.dueDate}
              onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
              error={errors?.dueDate}
              required
            />
          </div>

          <Select
            label="Category"
            options={categoryOptions}
            value={formData?.category}
            onChange={(value) => handleInputChange('category', value)}
            required
          />

          <Select
            label="Assign To"
            options={assignOptions}
            value={formData?.assignTo}
            onChange={(value) => handleInputChange('assignTo', value)}
            required
          />

          {formData?.assignTo === 'selected' && (
            <Select
              label="Select Players"
              options={playerOptions}
              value={formData?.selectedPlayers}
              onChange={(value) => handleInputChange('selectedPlayers', value)}
              multiple={true}
              searchable={true}
              placeholder="Choose players..."
              error={errors?.selectedPlayers}
            />
          )}

          {/* Recurring Payment Option */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recurring"
                checked={formData?.recurring}
                onChange={(e) => handleInputChange('recurring', e?.target?.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="recurring" className="text-sm font-medium text-foreground">
                Recurring Payment
              </label>
            </div>

            {formData?.recurring && (
              <Select
                label="Recurring Period"
                options={recurringOptions}
                value={formData?.recurringPeriod}
                onChange={(value) => handleInputChange('recurringPeriod', value)}
              />
            )}
          </div>

          {/* Preview */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <h4 className="text-sm font-medium text-foreground">Preview:</h4>
            <div className="text-sm text-muted-foreground">
              <p><strong>Title:</strong> {formData?.title || 'Payment Title'}</p>
              <p><strong>Amount:</strong> ${formData?.amount || '0.00'}</p>
              <p><strong>Due:</strong> {formData?.dueDate ? new Date(formData?.dueDate).toLocaleDateString() : 'Select date'}</p>
              <p><strong>For:</strong> {formData?.assignTo === 'all' ? 'All active players' : `${formData?.selectedPlayers?.length || 0} selected players`}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="default"
              loading={isLoading}
              disabled={isLoading}
              className="flex-1"
            >
              Create Payment Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;