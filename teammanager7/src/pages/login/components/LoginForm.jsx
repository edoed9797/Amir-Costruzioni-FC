import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserCheck } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const LoginForm = ({ isSignUpMode, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'player'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const roleOptions = [
    { value: 'player', label: 'Player' },
    { value: 'coach', label: 'Coach' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' }
  ];

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors?.[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData?.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData?.password) {
      errors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (isSignUpMode && !formData?.fullName?.trim()) {
      errors.fullName = 'Full name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit?.(formData);
  };

  const fillMockCredentials = () => {
    setFormData({
      email: 'coach@team.com',
      password: 'password123',
      fullName: 'Demo Coach',
      role: 'coach'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display authentication errors */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {/* Sign Up Fields */}
      {isSignUpMode && (
        <>
          <div>
            <Input
              label="Full Name"
              name="fullName"
              type="text"
              value={formData?.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              icon={<User className="h-5 w-5 text-gray-400" />}
              error={validationErrors?.fullName}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Select
              name="role"
              value={formData?.role}
              onChange={handleChange}
              options={roleOptions}
              icon={<UserCheck className="h-5 w-5 text-gray-400" />}
              disabled={loading}
            />
          </div>
        </>
      )}
      {/* Email */}
      <div>
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData?.email}
          onChange={handleChange}
          placeholder="Enter your email"
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          error={validationErrors?.email}
          disabled={loading}
        />
      </div>
      {/* Password */}
      <div>
        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData?.password}
          onChange={handleChange}
          placeholder="Enter your password"
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          error={validationErrors?.password}
          disabled={loading}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          }
        />
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={loading}
        disabled={loading}
      >
        {isSignUpMode ? 'Create Account' : 'Sign In'}
      </Button>
      {/* Mock Credentials Button */}
      {!isSignUpMode && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={fillMockCredentials}
          disabled={loading}
        >
          Use Demo Credentials
        </Button>
      )}
    </form>
  );
};

export default LoginForm;