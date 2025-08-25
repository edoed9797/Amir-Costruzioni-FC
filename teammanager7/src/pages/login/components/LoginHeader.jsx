import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Team Logo */}
      <Link to="/team-dashboard" className="inline-block mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <Icon name="Zap" size={32} color="white" />
        </div>
      </Link>

      {/* Welcome Text */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome Back
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Sign in to access your TeamManager7 dashboard
        </p>
      </div>

      {/* Team Name */}
      <div className="mt-4 px-4 py-2 bg-muted rounded-lg inline-block">
        <span className="text-sm font-medium text-foreground">
          TeamManager7 Soccer Club
        </span>
      </div>
    </div>
  );
};

export default LoginHeader;