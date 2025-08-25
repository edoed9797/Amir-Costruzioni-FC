import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import MobileNavigationDrawer from '../../components/ui/MobileNavigationDrawer';
import TeamBanner from './components/TeamBanner';
import UpcomingMatches from './components/UpcomingMatches';
import TrainingSessions from './components/TrainingSessions';
import PaymentAlerts from './components/PaymentAlerts';
import QuickActions from './components/QuickActions';
import Announcements from './components/Announcements';
import LiveMatchScore from './components/LiveMatchScore';

// Import services
import { useAuth } from '../../contexts/AuthContext';
import { teamService } from '../../services/teamService';
import { matchService } from '../../services/matchService';
import { trainingService } from '../../services/trainingService';
import { paymentService } from '../../services/paymentService';
import { announcementService } from '../../services/announcementService';

const TeamDashboard = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Data states
  const [teamData, setTeamData] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [trainingSessions, setTrainingSessions] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [liveMatch, setLiveMatch] = useState(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load dashboard data
  const loadDashboardData = async () => {
    if (!user?.id || !userProfile) return;

    try {
      setLoading(true);
      setError('');

      // Get user's teams
      const teams = await teamService?.getUserTeams(user?.id);
      
      if (!teams || teams?.length === 0) {
        setError('You are not a member of any team yet.');
        return;
      }

      // Use the first team (in a real app, user might select which team)
      const currentTeam = teams?.[0];
      setTeamData(currentTeam);

      // Load all dashboard data in parallel
      const [matches, trainings, payments, announcements, live] = await Promise.all([
        matchService?.getUpcomingMatches(currentTeam?.id, 3),
        trainingService?.getUpcomingTrainingSessions(currentTeam?.id, 2),
        paymentService?.getPaymentAlerts(user?.id, currentTeam?.id),
        announcementService?.getActiveAnnouncements(currentTeam?.id, 3),
        matchService?.getLiveMatch(currentTeam?.id)
      ]);

      setUpcomingMatches(matches || []);
      setTrainingSessions(trainings || []);
      setPaymentData(payments || []);
      setAnnouncements(announcements || []);
      setLiveMatch(live);

    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        setError('Cannot connect to the server. Your Supabase project may be paused or inactive. Please check your Supabase dashboard.');
      } else {
        setError('Failed to load dashboard data. Please try refreshing the page.');
      }
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user && userProfile) {
      loadDashboardData();
    }
  }, [user, userProfile, authLoading]);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // Close drawer on route change or window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
            <p className="font-medium">Unable to load dashboard</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button 
            onClick={loadDashboardData}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <NavigationHeader
        isDrawerOpen={isDrawerOpen}
        onDrawerToggle={handleDrawerToggle}
        user={userProfile}
      />

      {/* Mobile Navigation Drawer */}
      <MobileNavigationDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        user={userProfile}
      />

      {/* Main Content */}
      <main className="pt-14 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          {/* Team Banner */}
          <TeamBanner team={teamData} />

          {/* Live Match Score (if available) */}
          <LiveMatchScore liveMatch={liveMatch} />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Primary Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Matches */}
              <UpcomingMatches matches={upcomingMatches} />

              {/* Training Sessions */}
              <TrainingSessions sessions={trainingSessions} />

              {/* Announcements */}
              <Announcements announcements={announcements} />
            </div>

            {/* Right Column - Secondary Content */}
            <div className="space-y-6">
              {/* Payment Alerts */}
              <PaymentAlerts payments={paymentData} />

              {/* Quick Actions */}
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamDashboard;