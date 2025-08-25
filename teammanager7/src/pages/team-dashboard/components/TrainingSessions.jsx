import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrainingSessions = ({ sessions }) => {
  const [rsvpStatus, setRsvpStatus] = useState({});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };

  const handleRSVP = (sessionId, status) => {
    setRsvpStatus(prev => ({
      ...prev,
      [sessionId]: status
    }));
  };

  return (
    <div className="bg-card rounded-lg border border-border card-shadow p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Users" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Training Sessions</h2>
      </div>
      <div className="space-y-4">
        {sessions?.map((session) => (
          <div key={session?.id} className="p-3 bg-muted rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-foreground mb-1">{session?.type}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDate(session?.date)}</span>
                  <span>{formatTime(session?.date)}</span>
                  <span>{session?.location}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {session?.attendees}/{session?.maxAttendees}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="xs"
                variant={rsvpStatus?.[session?.id] === 'going' ? 'default' : 'outline'}
                onClick={() => handleRSVP(session?.id, 'going')}
                iconName="Check"
                iconSize={14}
                className="flex-1"
              >
                Going
              </Button>
              <Button
                size="xs"
                variant={rsvpStatus?.[session?.id] === 'maybe' ? 'secondary' : 'outline'}
                onClick={() => handleRSVP(session?.id, 'maybe')}
                iconName="HelpCircle"
                iconSize={14}
                className="flex-1"
              >
                Maybe
              </Button>
              <Button
                size="xs"
                variant={rsvpStatus?.[session?.id] === 'not-going' ? 'destructive' : 'outline'}
                onClick={() => handleRSVP(session?.id, 'not-going')}
                iconName="X"
                iconSize={14}
                className="flex-1"
              >
                Can't Go
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingSessions;