import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: "Calendar",
      description: "View matches & training",
      icon: "Calendar",
      path: "/calendar-events",
      color: "text-primary"
    },
    {
      id: 2,
      title: "Players",
      description: "Team roster & profiles",
      icon: "Users",
      path: "/player-profiles",
      color: "text-secondary"
    },
    {
      id: 3,
      title: "Payments",
      description: "Fees & contributions",
      icon: "CreditCard",
      path: "/payment-management",
      color: "text-accent"
    },
    {
      id: 4,
      title: "Statistics",
      description: "Match results & stats",
      icon: "Trophy",
      path: "/match-results-statistics",
      color: "text-success"
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border card-shadow p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Zap" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions?.map((action) => (
          <Link
            key={action?.id}
            to={action?.path}
            className="flex flex-col items-center p-4 bg-muted hover:bg-muted/80 rounded-lg transition-smooth group"
          >
            <div className={`p-3 rounded-full bg-background mb-2 group-hover:scale-105 transition-transform`}>
              <Icon name={action?.icon} size={24} className={action?.color} />
            </div>
            <h3 className="text-sm font-medium text-foreground text-center mb-1">{action?.title}</h3>
            <p className="text-xs text-muted-foreground text-center">{action?.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;