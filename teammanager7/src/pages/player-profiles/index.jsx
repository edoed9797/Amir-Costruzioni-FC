import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import MobileNavigationDrawer from '../../components/ui/MobileNavigationDrawer';
import SearchBar from './components/SearchBar';
import FilterChips from './components/FilterChips';
import PlayerGrid from './components/PlayerGrid';
import PlayerDetailModal from './components/PlayerDetailModal';
import AddPlayerButton from './components/AddPlayerButton';

const PlayerProfiles = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin] = useState(true); // Mock admin status

  // Mock player data
  const mockPlayers = [
    {
      id: 1,
      name: "Marcus Johnson",
      position: "Forward",
      jerseyNumber: 10,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      membershipStatus: "active",
      dateOfBirth: "March 15, 1995",
      address: "123 Soccer Street, Sports City, SC 12345",
      phone: "(555) 123-4567",
      email: "marcus.johnson@email.com",
      stats: {
        appearances: 24,
        goals: 18,
        assists: 7,
        yellowCards: 2,
        redCards: 0,
        mvpVotes: 5
      },
      paymentStatus: "paid",
      seasonFee: 250
    },
    {
      id: 2,
      name: "David Rodriguez",
      position: "Midfielder",
      jerseyNumber: 8,
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      membershipStatus: "active",
      dateOfBirth: "July 22, 1992",
      address: "456 Field Avenue, Sports City, SC 12345",
      phone: "(555) 234-5678",
      email: "david.rodriguez@email.com",
      stats: {
        appearances: 26,
        goals: 12,
        assists: 15,
        yellowCards: 4,
        redCards: 1,
        mvpVotes: 8
      },
      paymentStatus: "pending",
      seasonFee: 250
    },
    {
      id: 3,
      name: "James Wilson",
      position: "Defender",
      jerseyNumber: 4,
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      membershipStatus: "expired",
      dateOfBirth: "November 8, 1990",
      address: "789 Goal Lane, Sports City, SC 12345",
      phone: "(555) 345-6789",
      email: "james.wilson@email.com",
      stats: {
        appearances: 20,
        goals: 2,
        assists: 4,
        yellowCards: 6,
        redCards: 0,
        mvpVotes: 2
      },
      paymentStatus: "overdue",
      seasonFee: 250
    },
    {
      id: 4,
      name: "Michael Chen",
      position: "Goalkeeper",
      jerseyNumber: 1,
      photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      membershipStatus: "active",
      dateOfBirth: "January 12, 1993",
      address: "321 Keeper Court, Sports City, SC 12345",
      phone: "(555) 456-7890",
      email: "michael.chen@email.com",
      stats: {
        appearances: 28,
        goals: 0,
        assists: 1,
        yellowCards: 1,
        redCards: 0,
        mvpVotes: 12
      },
      paymentStatus: "paid",
      seasonFee: 250
    },
    {
      id: 5,
      name: "Alex Thompson",
      position: "Forward",
      jerseyNumber: 11,
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      membershipStatus: "active",
      dateOfBirth: "September 5, 1994",
      address: "654 Strike Street, Sports City, SC 12345",
      phone: "(555) 567-8901",
      email: "alex.thompson@email.com",
      stats: {
        appearances: 22,
        goals: 14,
        assists: 9,
        yellowCards: 3,
        redCards: 0,
        mvpVotes: 6
      },
      paymentStatus: "paid",
      seasonFee: 250
    },
    {
      id: 6,
      name: "Carlos Martinez",
      position: "Midfielder",
      jerseyNumber: 6,
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      membershipStatus: "active",
      dateOfBirth: "April 18, 1991",
      address: "987 Midfield Road, Sports City, SC 12345",
      phone: "(555) 678-9012",
      email: "carlos.martinez@email.com",
      stats: {
        appearances: 25,
        goals: 8,
        assists: 12,
        yellowCards: 5,
        redCards: 0,
        mvpVotes: 4
      },
      paymentStatus: "pending",
      seasonFee: 250
    },
    {
      id: 7,
      name: "Ryan O\'Connor",
      position: "Defender",
      jerseyNumber: 3,
      photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
      membershipStatus: "active",
      dateOfBirth: "December 3, 1989",
      address: "147 Defense Drive, Sports City, SC 12345",
      phone: "(555) 789-0123",
      email: "ryan.oconnor@email.com",
      stats: {
        appearances: 27,
        goals: 3,
        assists: 6,
        yellowCards: 7,
        redCards: 1,
        mvpVotes: 3
      },
      paymentStatus: "paid",
      seasonFee: 250
    },
    {
      id: 8,
      name: "Jordan Smith",
      position: "Forward",
      jerseyNumber: 9,
      photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
      membershipStatus: "expired",
      dateOfBirth: "June 25, 1996",
      address: "258 Attack Avenue, Sports City, SC 12345",
      phone: "(555) 890-1234",
      email: "jordan.smith@email.com",
      stats: {
        appearances: 18,
        goals: 11,
        assists: 5,
        yellowCards: 2,
        redCards: 0,
        mvpVotes: 3
      },
      paymentStatus: "overdue",
      seasonFee: 250
    },
    {
      id: 9,
      name: "Luis Garcia",
      position: "Midfielder",
      jerseyNumber: 7,
      photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      membershipStatus: "active",
      dateOfBirth: "October 14, 1992",
      address: "369 Center Circle, Sports City, SC 12345",
      phone: "(555) 901-2345",
      email: "luis.garcia@email.com",
      stats: {
        appearances: 23,
        goals: 6,
        assists: 11,
        yellowCards: 3,
        redCards: 0,
        mvpVotes: 7
      },
      paymentStatus: "paid",
      seasonFee: 250
    },
    {
      id: 10,
      name: "Kevin Brown",
      position: "Defender",
      jerseyNumber: 5,
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      membershipStatus: "active",
      dateOfBirth: "February 28, 1988",
      address: "741 Backline Boulevard, Sports City, SC 12345",
      phone: "(555) 012-3456",
      email: "kevin.brown@email.com",
      stats: {
        appearances: 29,
        goals: 1,
        assists: 3,
        yellowCards: 8,
        redCards: 2,
        mvpVotes: 1
      },
      paymentStatus: "paid",
      seasonFee: 250
    },
    {
      id: 11,
      name: "Tommy Anderson",
      position: "Forward",
      jerseyNumber: 21,
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      membershipStatus: "active",
      dateOfBirth: "August 17, 1997",
      address: "852 Wing Way, Sports City, SC 12345",
      phone: "(555) 123-4567",
      email: "tommy.anderson@email.com",
      stats: {
        appearances: 21,
        goals: 9,
        assists: 6,
        yellowCards: 1,
        redCards: 0,
        mvpVotes: 4
      },
      paymentStatus: "pending",
      seasonFee: 250
    },
    {
      id: 12,
      name: "Sam Williams",
      position: "Midfielder",
      jerseyNumber: 14,
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      membershipStatus: "active",
      dateOfBirth: "May 9, 1995",
      address: "963 Playmaker Place, Sports City, SC 12345",
      phone: "(555) 234-5678",
      email: "sam.williams@email.com",
      stats: {
        appearances: 19,
        goals: 4,
        assists: 8,
        yellowCards: 2,
        redCards: 0,
        mvpVotes: 2
      },
      paymentStatus: "paid",
      seasonFee: 250
    }
  ];

  const [players] = useState(mockPlayers);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort players
  const filteredPlayers = players?.filter(player => {
      const matchesSearch = player?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                          player?.jerseyNumber?.toString()?.includes(searchTerm);
      const matchesPosition = selectedPosition === 'all' || player?.position?.toLowerCase() === selectedPosition;
      const matchesStatus = selectedStatus === 'all' || player?.membershipStatus === selectedStatus;
      
      return matchesSearch && matchesPosition && matchesStatus;
    })?.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a?.name?.localeCompare(b?.name);
      } else {
        return b?.name?.localeCompare(a?.name);
      }
    });

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };

  const handleEditPlayer = (player) => {
    console.log('Edit player:', player);
    // Handle edit functionality
  };

  const handleAddPlayer = () => {
    console.log('Add new player');
    // Handle add player functionality
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        isDrawerOpen={isDrawerOpen}
        onDrawerToggle={() => setIsDrawerOpen(!isDrawerOpen)}
      />
      <MobileNavigationDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <main className="pt-14 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Player Profiles
            </h1>
            <p className="text-muted-foreground">
              Manage team roster and view player information
            </p>
          </div>

          {/* Search and Add Button */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 max-w-md">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
              </div>
              <AddPlayerButton
                isAdmin={isAdmin}
                onClick={handleAddPlayer}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <FilterChips
              selectedPosition={selectedPosition}
              onPositionChange={setSelectedPosition}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Results Count */}
          {!isLoading && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPlayers?.length} of {players?.length} players
              </p>
            </div>
          )}

          {/* Player Grid */}
          <PlayerGrid
            players={filteredPlayers}
            onPlayerClick={handlePlayerClick}
            isLoading={isLoading}
          />

          {/* Player Detail Modal */}
          <PlayerDetailModal
            player={selectedPlayer}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            isAdmin={isAdmin}
            onEdit={handleEditPlayer}
          />
        </div>
      </main>
    </div>
  );
};

export default PlayerProfiles;