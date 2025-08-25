import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingEvents = ({ events, onRSVP, userRSVPs }) => {
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'match': return 'Trophy';
      case 'training': return 'Target';
      case 'team-event': return 'Users';
      default: return 'Calendar';
    }
  };
  
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'match': return 'text-red-600';
      case 'training': return 'text-gray-900';
      case 'team-event': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    
    if (date?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === tomorrow?.toDateString()) {
      return 'Tomorrow';
    } else {
      return date?.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const getUserRSVP = (eventId) => {
    return userRSVPs?.[eventId] || null;
  };
  
  const getRSVPButtonText = (status) => {
    switch (status) {
      case 'going': return 'Going';
      case 'maybe': return 'Maybe';
      case 'not-going': return 'Can\'t Go';
      default: return 'RSVP';
    }
  };
  
  const getRSVPButtonVariant = (status) => {
    switch (status) {
      case 'going': return 'default';
      case 'maybe': return 'secondary';
      case 'not-going': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getDaysUntilEvent = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (events?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg card-shadow p-6">
        <div className="text-center">
          <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Upcoming Events</h3>
          <p className="text-muted-foreground">Check back later for new events and activities.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg card-shadow">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="Clock" size={20} />
          Upcoming Events
        </h2>
      </div>
      <div className="divide-y divide-border">
        {events?.map((event) => {
          const userRSVP = getUserRSVP(event?.id);
          const daysUntil = getDaysUntilEvent(event?.date);
          
          return (
            <div key={event?.id} className="p-4 hover:bg-muted/50 transition-smooth">
              <div className="flex items-start gap-3">
                {/* Event Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Icon 
                      name={getEventTypeIcon(event?.type)} 
                      size={20} 
                      className={getEventTypeColor(event?.type)}
                    />
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-foreground">{event?.title}</h3>
                      {event?.opponent && (
                        <p className="text-sm text-muted-foreground">vs {event?.opponent}</p>
                      )}
                    </div>
                    
                    {daysUntil <= 1 && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {daysUntil === 0 ? 'Today' : 'Tomorrow'}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Calendar" size={14} />
                      <span>{formatDate(event?.date)} at {formatTime(event?.time)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={14} />
                      <span>{event?.location}</span>
                    </div>
                  </div>
                  
                  {/* RSVP Button */}
                  <div className="mt-3 flex items-center justify-between">
                    <Button
                      variant={getRSVPButtonVariant(userRSVP)}
                      size="sm"
                      onClick={() => onRSVP(event?.id, userRSVP === 'going' ? null : 'going')}
                      className="min-w-20"
                    >
                      {getRSVPButtonText(userRSVP)}
                    </Button>
                    
                    <div className="text-xs text-muted-foreground">
                      {(event?.rsvp?.going || 0)} attending
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingEvents;