import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const FinancialReportsSection = ({ payments, onExportReport }) => {
  const [reportType, setReportType] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2025');

  const reportTypeOptions = [
    { value: 'monthly', label: 'Monthly Overview' },
    { value: 'quarterly', label: 'Quarterly Summary' },
    { value: 'yearly', label: 'Yearly Analysis' },
    { value: 'category', label: 'By Category' }
  ];

  const yearOptions = [
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', collected: 2400, pending: 800, overdue: 200 },
    { month: 'Feb', collected: 2800, pending: 600, overdue: 150 },
    { month: 'Mar', collected: 3200, pending: 400, overdue: 100 },
    { month: 'Apr', collected: 2900, pending: 700, overdue: 300 },
    { month: 'May', collected: 3500, pending: 500, overdue: 200 },
    { month: 'Jun', collected: 3800, pending: 300, overdue: 100 },
    { month: 'Jul', collected: 4200, pending: 600, overdue: 250 },
    { month: 'Aug', collected: 3900, pending: 800, overdue: 400 }
  ];

  const categoryData = [
    { name: 'Monthly Fees', value: 15600, color: '#DC2626' },
    { name: 'Tournament Entry', value: 4800, color: '#1F2937' },
    { name: 'Equipment', value: 2400, color: '#F59E0B' },
    { name: 'Training Camp', value: 3200, color: '#059669' }
  ];

  const paymentTrendData = [
    { month: 'Jan', onTime: 85, late: 15 },
    { month: 'Feb', onTime: 88, late: 12 },
    { month: 'Mar', onTime: 92, late: 8 },
    { month: 'Apr', onTime: 78, late: 22 },
    { month: 'May', onTime: 90, late: 10 },
    { month: 'Jun', onTime: 95, late: 5 },
    { month: 'Jul', onTime: 87, late: 13 },
    { month: 'Aug', onTime: 89, late: 11 }
  ];

  const handleExport = (format) => {
    onExportReport({
      type: reportType,
      year: selectedYear,
      format: format,
      data: monthlyData
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border card-shadow">
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="BarChart3" size={20} className="text-primary" />
            Financial Reports
          </h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              options={reportTypeOptions}
              value={reportType}
              onChange={setReportType}
              className="w-full sm:w-40"
            />
            
            <Select
              options={yearOptions}
              value={selectedYear}
              onChange={setSelectedYear}
              className="w-full sm:w-24"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                iconName="FileText"
                iconPosition="left"
              >
                PDF
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
                iconName="Download"
                iconPosition="left"
              >
                Excel
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">Total Collected</span>
            </div>
            <p className="text-2xl font-bold text-green-600">$26,400</p>
            <p className="text-sm text-green-700">+12% from last month</p>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">$4,800</p>
            <p className="text-sm text-yellow-700">8 payments pending</p>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="AlertTriangle" size={16} className="text-red-600" />
              <span className="text-sm font-medium text-red-800">Overdue</span>
            </div>
            <p className="text-2xl font-bold text-red-600">$1,600</p>
            <p className="text-sm text-red-700">5 payments overdue</p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Percent" size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Collection Rate</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">89%</p>
            <p className="text-sm text-blue-700">Above target (85%)</p>
          </div>
        </div>

        {/* Monthly Collection Chart */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Monthly Collection Overview</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="collected" fill="#059669" name="Collected" />
                <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                <Bar dataKey="overdue" fill="#DC2626" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Categories */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Payment Categories</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                  >
                    {categoryData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Trends */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Payment Timeliness Trend</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paymentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line 
                    type="monotone" 
                    dataKey="onTime" 
                    stroke="#059669" 
                    strokeWidth={2}
                    name="On Time"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="late" 
                    stroke="#DC2626" 
                    strokeWidth={2}
                    name="Late"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions Summary */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Recent Activity Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="ArrowUp" size={16} className="text-green-600" />
                <span className="text-sm font-medium text-foreground">This Week</span>
              </div>
              <p className="text-lg font-semibold text-foreground">$3,200</p>
              <p className="text-xs text-muted-foreground">12 payments received</p>
            </div>

            <div className="p-3 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Calendar" size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-foreground">This Month</span>
              </div>
              <p className="text-lg font-semibold text-foreground">$12,800</p>
              <p className="text-xs text-muted-foreground">48 payments received</p>
            </div>

            <div className="p-3 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Target" size={16} className="text-purple-600" />
                <span className="text-sm font-medium text-foreground">Monthly Goal</span>
              </div>
              <p className="text-lg font-semibold text-foreground">85%</p>
              <p className="text-xs text-muted-foreground">$2,400 remaining</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportsSection;