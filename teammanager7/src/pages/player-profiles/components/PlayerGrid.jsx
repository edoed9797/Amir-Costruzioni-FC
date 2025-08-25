import React from 'react';
import PlayerCard from './PlayerCard';
import Icon from '../../../components/AppIcon';


const PlayerGrid = ({ players, onPlayerClick, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 })?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-muted rounded-full"></div>
              <div className="space-y-2 text-center w-full">
                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
              </div>
              <div className="h-6 bg-muted rounded-full w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (players?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
          <Icon name="Users" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No players found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {players?.map((player) => (
        <PlayerCard
          key={player?.id}
          player={player}
          onClick={onPlayerClick}
        />
      ))}
    </div>
  );
};

export default PlayerGrid;