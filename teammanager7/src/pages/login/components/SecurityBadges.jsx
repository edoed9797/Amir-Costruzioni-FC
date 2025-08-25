import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      text: 'SSL Secured',
      description: 'Your data is encrypted and protected'
    },
    {
      icon: 'Lock',
      text: 'Privacy Protected',
      description: 'We never share your personal information'
    },
    {
      icon: 'CheckCircle',
      text: 'Trusted Platform',
      description: 'Used by 500+ soccer teams worldwide'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-center sm:text-left">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name={feature?.icon} size={16} className="text-success" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-foreground">
                {feature?.text}
              </div>
              <div className="text-xs text-muted-foreground hidden sm:block">
                {feature?.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadges;