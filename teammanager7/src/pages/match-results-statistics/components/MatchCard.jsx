import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MatchCard = ({ match, isAdmin = false, onEditMatch }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'win': return 'text-success bg-success/10';
      case 'loss': return 'text-error bg-error/10';
      case 'draw': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getResultText = (result) => {
    switch (result) {
      case 'win': return 'W';
      case 'loss': return 'L';
      case 'draw': return 'D';
      default: return '-';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg card-shadow">
      {/* Match Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getResultColor(match?.result)}`}>
              {getResultText(match?.result)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{match?.opponent}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(match?.date)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">
                {match?.homeScore} - {match?.awayScore}
              </div>
              <div className="text-xs text-muted-foreground">{match?.venue}</div>
            </div>
            
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditMatch(match)}
                className="ml-2"
              >
                <Icon name="Edit" size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Match Details Toggle */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between p-0 h-auto"
        >
          <span className="text-sm font-medium">Match Details</span>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </Button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* Goal Scorers */}
            {match?.goalScorers && match?.goalScorers?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Goal Scorers</h4>
                <div className="space-y-2">
                  {match?.goalScorers?.map((scorer, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <Image
                          src={scorer?.avatar}
                          alt={scorer?.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">{scorer?.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {scorer?.minute}' {scorer?.assist && `(${scorer?.assist})`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cards */}
            {match?.cards && match?.cards?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Cards</h4>
                <div className="space-y-2">
                  {match?.cards?.map((card, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <Image
                          src={card?.avatar}
                          alt={card?.player}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">{card?.player}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-6 rounded-sm ${card?.type === 'yellow' ? 'bg-warning' : 'bg-error'}`}></div>
                        <span className="text-sm text-muted-foreground">{card?.minute}'</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MVP */}
            {match?.mvp && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Man of the Match</h4>
                <div className="flex items-center gap-2 bg-accent/10 rounded-lg p-2">
                  <Image
                    src={match?.mvp?.avatar}
                    alt={match?.mvp?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground">{match?.mvp?.name}</div>
                    <div className="text-xs text-muted-foreground">MVP</div>
                  </div>
                  <Icon name="Star" size={16} className="text-accent ml-auto" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;