import React from 'react';
import Icon from '../../../components/AppIcon';

const StandingsTable = ({ standings }) => {
  const getPositionColor = (position) => {
    if (position <= 3) return 'text-success';
    if (position >= standings?.length - 2) return 'text-error';
    return 'text-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg card-shadow">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="Trophy" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Championship Standings</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Pos</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Team</th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">P</th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">W</th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">D</th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">L</th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">GF</th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">GA</th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">GD</th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings?.map((team, index) => (
                <tr key={team?.id} className={`border-b border-border ${team?.isCurrentTeam ? 'bg-primary/5' : ''}`}>
                  <td className="p-3">
                    <span className={`font-medium ${getPositionColor(index + 1)}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {team?.isCurrentTeam && (
                        <Icon name="Star" size={16} className="text-primary" />
                      )}
                      <span className="font-medium text-foreground">{team?.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center text-foreground">{team?.played}</td>
                  <td className="p-3 text-center text-foreground">{team?.wins}</td>
                  <td className="p-3 text-center text-foreground">{team?.draws}</td>
                  <td className="p-3 text-center text-foreground">{team?.losses}</td>
                  <td className="p-3 text-center text-foreground">{team?.goalsFor}</td>
                  <td className="p-3 text-center text-foreground">{team?.goalsAgainst}</td>
                  <td className="p-3 text-center">
                    <span className={team?.goalDifference >= 0 ? 'text-success' : 'text-error'}>
                      {team?.goalDifference > 0 ? '+' : ''}{team?.goalDifference}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-bold text-foreground">{team?.points}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-3">
          {standings?.map((team, index) => (
            <div key={team?.id} className={`p-3 rounded-lg border border-border ${team?.isCurrentTeam ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-lg ${getPositionColor(index + 1)}`}>
                    {index + 1}
                  </span>
                  {team?.isCurrentTeam && (
                    <Icon name="Star" size={16} className="text-primary" />
                  )}
                  <span className="font-medium text-foreground">{team?.name}</span>
                </div>
                <span className="font-bold text-lg text-foreground">{team?.points} pts</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-muted-foreground">P</div>
                  <div className="font-medium text-foreground">{team?.played}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">W-D-L</div>
                  <div className="font-medium text-foreground">{team?.wins}-{team?.draws}-{team?.losses}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">GD</div>
                  <div className={`font-medium ${team?.goalDifference >= 0 ? 'text-success' : 'text-error'}`}>
                    {team?.goalDifference > 0 ? '+' : ''}{team?.goalDifference}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;