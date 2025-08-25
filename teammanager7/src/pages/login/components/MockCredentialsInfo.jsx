import React from 'react';
import { Info } from 'lucide-react';

const MockCredentialsInfo = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-blue-800 mb-2">Demo Credentials Available</p>
          <div className="text-blue-700 space-y-1">
            <p><strong>Email:</strong> coach@team.com</p>
            <p><strong>Password:</strong> password123</p>
            <p><strong>Alternative:</strong> alex.thompson@team.com</p>
          </div>
          <p className="text-blue-600 mt-2 text-xs">
            Click "Use Demo Credentials" to auto-fill the form with test data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockCredentialsInfo;