import React from 'react';
import Icon from '../../../components/AppIcon';

const UpcomingMatches = ({ matches }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border card-shadow p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Calendar" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Upcoming Matches</h2>
      </div>
      <div className="space-y-4">
        {matches?.map((match) => (
          <div key={match?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">
                  vs {match?.opponent}
                </span>
                {match?.isHome && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                    HOME
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(match?.date)}</span>
                <span>{formatTime(match?.date)}</span>
                <span>{match?.venue}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">{match?.competition}</div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium transition-smooth">
        View Full Calendar
      </button>
    </div>
  );
};

export default UpcomingMatches;