import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TopScorersCard = ({ topScorers }) => {
  const getRankIcon = (position) => {
    switch (position) {
      case 1: return { icon: 'Trophy', color: 'text-accent' };
      case 2: return { icon: 'Medal', color: 'text-muted-foreground' };
      case 3: return { icon: 'Award', color: 'text-warning' };
      default: return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg card-shadow">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="Target" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Top Scorers</h2>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {topScorers?.map((player, index) => {
            const rank = index + 1;
            const rankIcon = getRankIcon(rank);
            
            return (
              <div key={player?.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-smooth">
                <div className="flex items-center justify-center w-8 h-8">
                  {rankIcon ? (
                    <Icon name={rankIcon?.icon} size={16} className={rankIcon?.color} />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
                  )}
                </div>
                <Image
                  src={player?.avatar}
                  alt={player?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">{player?.name}</div>
                  <div className="text-sm text-muted-foreground">#{player?.jerseyNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">{player?.goals}</div>
                  <div className="text-xs text-muted-foreground">goals</div>
                </div>
              </div>
            );
          })}
        </div>

        {topScorers?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Target" size={48} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No goals scored yet this season</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopScorersCard;