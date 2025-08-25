import React from 'react';
import Icon from '../../../components/AppIcon';

const LiveMatchScore = ({ liveMatch }) => {
  if (!liveMatch) return null;

  const formatTime = (minutes) => {
    if (minutes > 90) {
      return `90+${minutes - 90}'`;
    }
    return `${minutes}'`;
  };

  return (
    <div className="bg-card rounded-lg border border-border card-shadow p-4 md:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-error">LIVE</span>
        <Icon name="Radio" size={16} className="text-error" />
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="text-center">
            <div className="text-sm font-medium text-foreground mb-1">{liveMatch?.homeTeam}</div>
            <div className="text-2xl font-bold text-foreground">{liveMatch?.homeScore}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">VS</div>
            <div className="text-lg font-medium text-muted-foreground">-</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium text-foreground mb-1">{liveMatch?.awayTeam}</div>
            <div className="text-2xl font-bold text-foreground">{liveMatch?.awayScore}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>{formatTime(liveMatch?.currentMinute)}</span>
          <span>•</span>
          <span>{liveMatch?.venue}</span>
          <span>•</span>
          <span>{liveMatch?.competition}</span>
        </div>
        
        {liveMatch?.recentEvents && liveMatch?.recentEvents?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Recent Events</div>
            <div className="space-y-1">
              {liveMatch?.recentEvents?.map((event, index) => (
                <div key={index} className="flex items-center justify-center gap-2 text-xs">
                  <Icon 
                    name={event?.type === 'goal' ? 'Target' : event?.type === 'card' ? 'Square' : 'Clock'} 
                    size={12} 
                    className={event?.type === 'goal' ? 'text-success' : event?.type === 'card' ? 'text-warning' : 'text-muted-foreground'} 
                  />
                  <span className="text-muted-foreground">
                    {event?.minute}' {event?.player} {event?.type === 'goal' ? 'scored' : event?.type === 'card' ? 'booked' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatchScore;