import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import MatchResultsStatistics from './pages/match-results-statistics';
import Login from './pages/login';
import PlayerProfiles from './pages/player-profiles';
import PaymentManagement from './pages/payment-management';
import CalendarEvents from './pages/calendar-events';
import TeamDashboard from './pages/team-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CalendarEvents />} />
        <Route path="/match-results-statistics" element={<MatchResultsStatistics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player-profiles" element={<PlayerProfiles />} />
        <Route path="/payment-management" element={<PaymentManagement />} />
        <Route path="/calendar-events" element={<CalendarEvents />} />
        <Route path="/team-dashboard" element={<TeamDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
