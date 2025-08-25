import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import LoginHeader from './components/LoginHeader';
import MockCredentialsInfo from './components/MockCredentialsInfo';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, error, loading } = useAuth();
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/team-dashboard');
    }
  }, [user, loading, navigate]);

  const handleAuthSubmit = async (formData) => {
    try {
      if (isSignUpMode) {
        const { error } = await signUp(formData?.email, formData?.password, {
          fullName: formData?.fullName,
          role: formData?.role
        });
        
        if (!error) {
          // Show success message - user will need to verify email
          alert('Registration successful! Please check your email to verify your account.');
        }
      } else {
        const { error } = await signIn(formData?.email, formData?.password);
        
        if (!error) {
          navigate('/team-dashboard');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <LoginHeader 
          isSignUpMode={isSignUpMode}
          onToggleMode={toggleMode}
        />

        {/* Main Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <LoginForm 
            isSignUpMode={isSignUpMode}
            onSubmit={handleAuthSubmit}
            loading={loading}
            error={error}
          />

          {/* Mock Credentials Info */}
          <MockCredentialsInfo />

          {/* Security Badges */}
          <SecurityBadges />
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Secure team management platform powered by{' '}
            <span className="font-semibold text-blue-600">Supabase</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;