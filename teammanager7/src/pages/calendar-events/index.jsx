import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import MobileNavigationDrawer from '../../components/ui/MobileNavigationDrawer';
import CalendarGrid from './components/CalendarGrid';
import EventCard from './components/EventCard';
import EventFilters from './components/EventFilters';
import UpcomingEvents from './components/UpcomingEvents';
import EventModal from './components/EventModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CalendarEvents = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [activeFilters, setActiveFilters] = useState(['match', 'training', 'team-event']);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [userRSVPs, setUserRSVPs] = useState({});
  
  // Mock user data
  const currentUser = {
    name: "Alex Johnson",
    role: "Player",
    isAdmin: false
  };
  
  // Mock events data
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Training Session",
      type: "training",
      date: "2025-01-15",
      time: "18:00",
      location: "City Sports Complex",
      description: "Regular training session focusing on passing and shooting drills",
      rsvp: { going: 12, maybe: 3, 'not-going': 2 }
    },
    {
      id: "2",
      title: "League Match",
      type: "match",
      date: "2025-01-18",
      time: "15:00",
      location: "Central Stadium",
      opponent: "Thunder FC",
      description: "Important league match against Thunder FC",
      rsvp: { going: 15, maybe: 1, 'not-going': 1 }
    },
    {
      id: "3",
      title: "Team Dinner",
      type: "team-event",
      date: "2025-01-20",
      time: "19:30",
      location: "Mario\'s Restaurant",
      description: "Monthly team dinner and social gathering",
      rsvp: { going: 8, maybe: 4, 'not-going': 3 }
    },
    {
      id: "4",
      title: "Training Session",
      type: "training",
      date: "2025-01-22",
      time: "18:00",
      location: "City Sports Complex",
      description: "Tactical training session with match simulation",
      rsvp: { going: 10, maybe: 2, 'not-going': 1 }
    },
    {
      id: "5",
      title: "Cup Semi-Final",
      type: "match",
      date: "2025-01-25",
      time: "14:00",
      location: "Regional Stadium",
      opponent: "Eagles United",
      description: "Cup semi-final match - win to reach the final!",
      rsvp: { going: 16, maybe: 0, 'not-going': 1 }
    }
  ]);
  
  // Initialize user RSVPs
  useEffect(() => {
    setUserRSVPs({
      "1": "going",
      "2": "going",
      "3": "maybe",
      "4": "going",
      "5": "going"
    });
  }, []);
  
  // Filter events based on active filters
  const filteredEvents = events?.filter(event => 
    activeFilters?.includes(event?.type)
  );
  
  // Get events for selected date
  const selectedDateEvents = selectedDate ? 
    filteredEvents?.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate?.toDateString() === selectedDate?.toDateString();
    }) : [];
  
  // Get upcoming events (next 5)
  const upcomingEvents = filteredEvents?.filter(event => new Date(event.date) >= new Date())?.sort((a, b) => new Date(a.date) - new Date(b.date))?.slice(0, 5);
  
  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  
  const handleFilterChange = (filterKey) => {
    if (filterKey === 'all') {
      setActiveFilters(['match', 'training', 'team-event']);
    } else if (filterKey === 'clear') {
      setActiveFilters([]);
    } else {
      setActiveFilters(prev => 
        prev?.includes(filterKey) 
          ? prev?.filter(f => f !== filterKey)
          : [...prev, filterKey]
      );
    }
  };
  
  const handleRSVP = (eventId, status) => {
    setUserRSVPs(prev => ({
      ...prev,
      [eventId]: prev?.[eventId] === status ? null : status
    }));
    
    // Update event RSVP counts
    setEvents(prev => prev?.map(event => {
      if (event?.id === eventId) {
        const newRSVP = { ...event?.rsvp };
        const oldStatus = userRSVPs?.[eventId];
        
        // Remove from old status
        if (oldStatus && newRSVP?.[oldStatus] > 0) {
          newRSVP[oldStatus]--;
        }
        
        // Add to new status
        if (status && userRSVPs?.[eventId] !== status) {
          newRSVP[status] = (newRSVP?.[status] || 0) + 1;
        }
        
        return { ...event, rsvp: newRSVP };
      }
      return event;
    }));
  };
  
  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };
  
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };
  
  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      // Update existing event
      setEvents(prev => prev?.map(event => 
        event?.id === editingEvent?.id ? eventData : event
      ));
    } else {
      // Add new event
      setEvents(prev => [...prev, eventData]);
    }
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };
  
  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader
        isDrawerOpen={isDrawerOpen}
        onDrawerToggle={handleDrawerToggle}
        user={currentUser}
      />
      <MobileNavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={currentUser}
      />
      <main className="pt-14 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Calendar & Events</h1>
              <p className="text-muted-foreground">
                Manage team schedules, matches, and events
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleGoToToday}
                className="flex items-center gap-2"
              >
                <Icon name="Calendar" size={16} />
                Today
              </Button>
              
              {currentUser?.isAdmin && (
                <Button
                  onClick={handleCreateEvent}
                  className="flex items-center gap-2"
                >
                  <Icon name="Plus" size={16} />
                  Add Event
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <EventFilters
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Calendar Grid */}
              <CalendarGrid
                currentDate={currentDate}
                events={filteredEvents}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
              
              {/* Selected Date Events */}
              {selectedDate && selectedDateEvents?.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Events on {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h2>
                  
                  <div className="grid gap-4">
                    {selectedDateEvents?.map(event => (
                      <EventCard
                        key={event?.id}
                        event={event}
                        onRSVP={handleRSVP}
                        userRSVP={userRSVPs?.[event?.id]}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Upcoming Events */}
              <UpcomingEvents
                events={upcomingEvents}
                onRSVP={handleRSVP}
                userRSVPs={userRSVPs}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        event={editingEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default CalendarEvents;