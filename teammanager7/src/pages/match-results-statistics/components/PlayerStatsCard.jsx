import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PlayerStatsCard = ({ player }) => {
  const statItems = [
    { label: 'Appearances', value: player?.appearances, icon: 'Calendar' },
    { label: 'Goals', value: player?.goals, icon: 'Target' },
    { label: 'Assists', value: player?.assists, icon: 'Users' },
    { label: 'Yellow Cards', value: player?.yellowCards, icon: 'Square', color: 'text-warning' },
    { label: 'Red Cards', value: player?.redCards, icon: 'Square', color: 'text-error' },
    { label: 'MVP Awards', value: player?.mvpAwards, icon: 'Star', color: 'text-accent' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg card-shadow">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Image
            src={player?.avatar}
            alt={player?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-foreground">{player?.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>#{player?.jerseyNumber}</span>
              <span>•</span>
              <span>{player?.position}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statItems?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Icon 
                  name={stat?.icon} 
                  size={16} 
                  className={stat?.color || 'text-muted-foreground'} 
                />
              </div>
              <div className="text-lg font-bold text-foreground">{stat?.value}</div>
              <div className="text-xs text-muted-foreground">{stat?.label}</div>
            </div>
          ))}
        </div>

        {/* Performance Rating */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Season Rating</span>
            <div className="flex items-center gap-1">
              <Icon name="Star" size={16} className="text-accent" />
              <span className="font-bold text-foreground">{player?.rating}/10</span>
            </div>
          </div>
          <div className="mt-2 bg-muted rounded-full h-2">
            <div 
              className="bg-accent rounded-full h-2 transition-all duration-300"
              style={{ width: `${(player?.rating / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsCard;