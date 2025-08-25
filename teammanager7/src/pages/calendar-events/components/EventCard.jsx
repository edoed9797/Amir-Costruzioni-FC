import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventCard = ({ event, onRSVP, userRSVP }) => {
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
      case 'match': return 'text-red-600 bg-red-50 border-red-200';
      case 'training': return 'text-gray-900 bg-gray-50 border-gray-200';
      case 'team-event': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const getRSVPButtonVariant = (status) => {
    if (userRSVP === status) {
      switch (status) {
        case 'going': return 'default';
        case 'not-going': return 'destructive';
        case 'maybe': return 'secondary';
        default: return 'outline';
      }
    }
    return 'outline';
  };
  
  const getRSVPCount = (status) => {
    return event?.rsvp?.[status] || 0;
  };

  return (
    <div className="bg-card border border-border rounded-lg card-shadow p-4 space-y-4">
      {/* Event Header */}
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg border ${getEventTypeColor(event?.type)}`}>
          <Icon name={getEventTypeIcon(event?.type)} size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-lg">{event?.title}</h3>
          {event?.opponent && (
            <p className="text-sm text-muted-foreground">vs {event?.opponent}</p>
          )}
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event?.type)}`}>
          {event?.type?.replace('-', ' ')?.toUpperCase()}
        </div>
      </div>
      {/* Event Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>{formatTime(event?.time)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="MapPin" size={16} />
          <span>{event?.location}</span>
        </div>
        
        {event?.description && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Icon name="FileText" size={16} className="mt-0.5 flex-shrink-0" />
            <span>{event?.description}</span>
          </div>
        )}
      </div>
      {/* RSVP Section */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Will you attend?</span>
          <div className="text-xs text-muted-foreground">
            {getRSVPCount('going') + getRSVPCount('not-going') + getRSVPCount('maybe')} responses
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={getRSVPButtonVariant('going')}
            size="sm"
            onClick={() => onRSVP(event?.id, 'going')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Icon name="Check" size={16} />
            <span className="text-xs">Going</span>
            <span className="text-xs opacity-75">{getRSVPCount('going')}</span>
          </Button>
          
          <Button
            variant={getRSVPButtonVariant('maybe')}
            size="sm"
            onClick={() => onRSVP(event?.id, 'maybe')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Icon name="HelpCircle" size={16} />
            <span className="text-xs">Maybe</span>
            <span className="text-xs opacity-75">{getRSVPCount('maybe')}</span>
          </Button>
          
          <Button
            variant={getRSVPButtonVariant('not-going')}
            size="sm"
            onClick={() => onRSVP(event?.id, 'not-going')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Icon name="X" size={16} />
            <span className="text-xs">Can't Go</span>
            <span className="text-xs opacity-75">{getRSVPCount('not-going')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;