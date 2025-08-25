import React from 'react';
import Image from '../../../components/AppImage';


const PlayerCard = ({ player, onClick }) => {
  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-success' : 'bg-error';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Active' : 'Expired';
  };

  return (
    <div 
      className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-smooth"
      onClick={() => onClick(player)}
    >
      <div className="flex flex-col items-center space-y-3">
        {/* Player Photo */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
            <Image
              src={player?.photo}
              alt={`${player?.name} profile photo`}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Jersey Number Badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
            {player?.jerseyNumber}
          </div>
        </div>

        {/* Player Info */}
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-sm text-foreground truncate max-w-full">
            {player?.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {player?.position}
          </p>
        </div>

        {/* Membership Status */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(player?.membershipStatus)} text-white`}>
          {getStatusText(player?.membershipStatus)}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;