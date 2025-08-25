import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import MobileNavigationDrawer from '../../components/ui/MobileNavigationDrawer';
import MatchCard from './components/MatchCard';
import TopScorersCard from './components/TopScorersCard';
import StandingsTable from './components/StandingsTable';
import PlayerStatsCard from './components/PlayerStatsCard';
import MatchRecordModal from './components/MatchRecordModal';
import StatisticsFilters from './components/StatisticsFilters';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const MatchResultsStatistics = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('matches');
  const [filters, setFilters] = useState({
    season: '2024-25',
    competition: 'all',
    venue: 'all'
  });

  // Mock user data
  const user = {
    name: 'Coach Martinez',
    role: 'Head Coach'
  };

  // Check if user is admin (coach/manager)
  const isAdmin = user?.role === 'Head Coach' || user?.role === 'Manager';

  // Mock matches data
  const [matches, setMatches] = useState([
    {
      id: 1,
      opponent: 'Thunder FC',
      date: '2024-08-20',
      venue: 'Home',
      homeScore: 3,
      awayScore: 1,
      result: 'win',
      goalScorers: [
        {
          id: 1,
          name: 'Marcus Johnson',
          minute: '15',
          assist: 'David Rodriguez',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
          id: 2,
          name: 'James Wilson',
          minute: '34',
          assist: '',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
        },
        {
          id: 3,
          name: 'Marcus Johnson',
          minute: '67',
          assist: 'Michael Brown',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        }
      ],
      cards: [
        {
          id: 1,
          player: 'Robert Davis',
          type: 'yellow',
          minute: '42',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
        }
      ],
      mvp: {
        id: '1',
        name: 'Marcus Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      }
    },
    {
      id: 2,
      opponent: 'Lightning United',
      date: '2024-08-15',
      venue: 'Away',
      homeScore: 2,
      awayScore: 2,
      result: 'draw',
      goalScorers: [
        {
          id: 4,
          name: 'Christopher Miller',
          minute: '23',
          assist: 'Daniel Garcia',
          avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
        },
        {
          id: 5,
          name: 'Matthew Martinez',
          minute: '78',
          assist: '',
          avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
        }
      ],
      cards: [],
      mvp: {
        id: '6',
        name: 'Christopher Miller',
        avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
      }
    },
    {
      id: 3,
      opponent: 'Storm City',
      date: '2024-08-10',
      venue: 'Home',
      homeScore: 1,
      awayScore: 3,
      result: 'loss',
      goalScorers: [
        {
          id: 6,
          name: 'Anthony Anderson',
          minute: '89',
          assist: 'Joshua Taylor',
          avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
        }
      ],
      cards: [
        {
          id: 2,
          player: 'Andrew Thomas',
          type: 'red',
          minute: '65',
          avatar: 'https://randomuser.me/api/portraits/men/11.jpg'
        },
        {
          id: 3,
          player: 'Daniel Garcia',
          type: 'yellow',
          minute: '33',
          avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
        }
      ],
      mvp: {
        id: '9',
        name: 'Anthony Anderson',
        avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
      }
    }
  ]);

  // Mock top scorers data
  const topScorers = [
    {
      id: '1',
      name: 'Marcus Johnson',
      jerseyNumber: 10,
      goals: 8,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: '6',
      name: 'Christopher Miller',
      jerseyNumber: 7,
      goals: 6,
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
    },
    {
      id: '3',
      name: 'James Wilson',
      jerseyNumber: 9,
      goals: 5,
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      id: '8',
      name: 'Matthew Martinez',
      jerseyNumber: 11,
      goals: 4,
      avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
    },
    {
      id: '9',
      name: 'Anthony Anderson',
      jerseyNumber: 8,
      goals: 3,
      avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
    }
  ];

  // Mock standings data
  const standings = [
    {
      id: 1,
      name: 'Eagles FC',
      played: 12,
      wins: 9,
      draws: 2,
      losses: 1,
      goalsFor: 28,
      goalsAgainst: 8,
      goalDifference: 20,
      points: 29,
      isCurrentTeam: false
    },
    {
      id: 2,
      name: 'TeamManager7',
      played: 12,
      wins: 7,
      draws: 3,
      losses: 2,
      goalsFor: 22,
      goalsAgainst: 12,
      goalDifference: 10,
      points: 24,
      isCurrentTeam: true
    },
    {
      id: 3,
      name: 'Thunder FC',
      played: 12,
      wins: 6,
      draws: 4,
      losses: 2,
      goalsFor: 19,
      goalsAgainst: 15,
      goalDifference: 4,
      points: 22,
      isCurrentTeam: false
    },
    {
      id: 4,
      name: 'Lightning United',
      played: 12,
      wins: 5,
      draws: 5,
      losses: 2,
      goalsFor: 18,
      goalsAgainst: 14,
      goalDifference: 4,
      points: 20,
      isCurrentTeam: false
    },
    {
      id: 5,
      name: 'Storm City',
      played: 12,
      wins: 4,
      draws: 3,
      losses: 5,
      goalsFor: 16,
      goalsAgainst: 20,
      goalDifference: -4,
      points: 15,
      isCurrentTeam: false
    },
    {
      id: 6,
      name: 'Wolves United',
      played: 12,
      wins: 2,
      draws: 2,
      losses: 8,
      goalsFor: 9,
      goalsAgainst: 25,
      goalDifference: -16,
      points: 8,
      isCurrentTeam: false
    }
  ];

  // Mock player stats data
  const playerStats = [
    {
      id: '1',
      name: 'Marcus Johnson',
      jerseyNumber: 10,
      position: 'Forward',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      appearances: 12,
      goals: 8,
      assists: 4,
      yellowCards: 2,
      redCards: 0,
      mvpAwards: 3,
      rating: 8.5
    },
    {
      id: '2',
      name: 'David Rodriguez',
      jerseyNumber: 4,
      position: 'Midfielder',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      appearances: 11,
      goals: 2,
      assists: 6,
      yellowCards: 3,
      redCards: 0,
      mvpAwards: 1,
      rating: 7.8
    },
    {
      id: '3',
      name: 'James Wilson',
      jerseyNumber: 9,
      position: 'Forward',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      appearances: 10,
      goals: 5,
      assists: 2,
      yellowCards: 1,
      redCards: 0,
      mvpAwards: 2,
      rating: 7.6
    },
    {
      id: '4',
      name: 'Michael Brown',
      jerseyNumber: 5,
      position: 'Defender',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      appearances: 12,
      goals: 1,
      assists: 3,
      yellowCards: 4,
      redCards: 1,
      mvpAwards: 0,
      rating: 7.2
    }
  ];

  const tabs = [
    { id: 'matches', label: 'Recent Matches', icon: 'Calendar' },
    { id: 'scorers', label: 'Top Scorers', icon: 'Target' },
    { id: 'standings', label: 'Standings', icon: 'Trophy' },
    { id: 'players', label: 'Player Stats', icon: 'Users' }
  ];

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setIsRecordModalOpen(true);
  };

  const handleSaveMatch = (matchData) => {
    if (editingMatch) {
      setMatches(prev => prev?.map(match => 
        match?.id === editingMatch?.id ? matchData : match
      ));
    } else {
      setMatches(prev => [matchData, ...prev]);
    }
    setEditingMatch(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      season: '2024-25',
      competition: 'all',
      venue: 'all'
    });
  };

  // Close drawer when clicking outside or on navigation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader
        isDrawerOpen={isDrawerOpen}
        onDrawerToggle={handleDrawerToggle}
        user={user}
      />
      <MobileNavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={user}
      />
      <main className="pt-14 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Match Results & Statistics
              </h1>
              <p className="text-muted-foreground mt-1">
                Track team performance and player statistics
              </p>
            </div>

            {isAdmin && (
              <Button
                onClick={() => setIsRecordModalOpen(true)}
                iconName="Plus"
                className="w-full sm:w-auto"
              >
                Record Match
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="mb-6">
            <StatisticsFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    {tab?.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'matches' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {matches?.map((match) => (
                  <MatchCard
                    key={match?.id}
                    match={match}
                    isAdmin={isAdmin}
                    onEditMatch={handleEditMatch}
                  />
                ))}
                
                {matches?.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No matches recorded</h3>
                    <p className="text-muted-foreground mb-4">Start by recording your first match result</p>
                    {isAdmin && (
                      <Button onClick={() => setIsRecordModalOpen(true)} iconName="Plus">
                        Record Match
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'scorers' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="lg:col-span-2 xl:col-span-1">
                  <TopScorersCard topScorers={topScorers} />
                </div>
                
                <div className="lg:col-span-2 xl:col-span-2">
                  <div className="bg-card border border-border rounded-lg card-shadow p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Scoring Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">47</div>
                        <div className="text-sm text-muted-foreground">Total Goals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">3.9</div>
                        <div className="text-sm text-muted-foreground">Goals/Game</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">23</div>
                        <div className="text-sm text-muted-foreground">Assists</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning">8</div>
                        <div className="text-sm text-muted-foreground">Different Scorers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'standings' && (
              <StandingsTable standings={standings} />
            )}

            {activeTab === 'players' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {playerStats?.map((player) => (
                  <PlayerStatsCard key={player?.id} player={player} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Match Record Modal */}
      <MatchRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setEditingMatch(null);
        }}
        onSave={handleSaveMatch}
        match={editingMatch}
      />
    </div>
  );
};

export default MatchResultsStatistics;