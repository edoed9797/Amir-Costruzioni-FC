import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarGrid = ({ 
  currentDate, 
  events, 
  onDateSelect, 
  selectedDate,
  onPrevMonth,
  onNextMonth 
}) => {
  const today = new Date();
  const year = currentDate?.getFullYear();
  const month = currentDate?.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay?.getDate();
  const startingDayOfWeek = firstDay?.getDay();
  
  // Get previous month's last days to fill the grid
  const prevMonth = new Date(year, month - 1, 0);
  const prevMonthDays = prevMonth?.getDate();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate calendar days
  const calendarDays = [];
  
  // Previous month days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    let day = prevMonthDays - i;
    calendarDays?.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month - 1, day)
    });
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays?.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day)
    });
  }
  
  // Next month days to fill the grid
  const remainingDays = 42 - calendarDays?.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays?.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day)
    });
  }
  
  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events?.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate?.toDateString() === date?.toDateString();
    });
  };
  
  // Check if date is today
  const isToday = (date) => {
    return date?.toDateString() === today?.toDateString();
  };
  
  // Check if date is selected
  const isSelected = (date) => {
    return selectedDate && date?.toDateString() === selectedDate?.toDateString();
  };
  
  // Get event indicator color
  const getEventIndicatorColor = (eventType) => {
    switch (eventType) {
      case 'match': return 'bg-red-500';
      case 'training': return 'bg-gray-900';
      case 'team-event': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border card-shadow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevMonth}
          className="h-8 w-8"
        >
          <Icon name="ChevronLeft" size={16} />
        </Button>
        
        <h2 className="text-lg font-semibold text-foreground">
          {monthNames?.[month]} {year}
        </h2>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onNextMonth}
          className="h-8 w-8"
        >
          <Icon name="ChevronRight" size={16} />
        </Button>
      </div>
      {/* Day Names Header */}
      <div className="grid grid-cols-7 border-b border-border">
        {dayNames?.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-xs font-medium text-muted-foreground bg-muted"
          >
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays?.map((calendarDay, index) => {
          const dayEvents = getEventsForDate(calendarDay?.date);
          const hasEvents = dayEvents?.length > 0;
          
          return (
            <button
              key={index}
              onClick={() => onDateSelect(calendarDay?.date)}
              className={`
                relative p-2 h-16 md:h-20 border-r border-b border-border text-left hover:bg-muted transition-smooth
                ${!calendarDay?.isCurrentMonth ? 'text-muted-foreground bg-muted/30' : 'text-foreground'}
                ${isToday(calendarDay?.date) ? 'bg-primary/10 border-primary' : ''}
                ${isSelected(calendarDay?.date) ? 'bg-primary/20 border-primary' : ''}
              `}
            >
              <span className={`
                text-sm font-medium
                ${isToday(calendarDay?.date) ? 'text-primary' : ''}
                ${isSelected(calendarDay?.date) ? 'text-primary' : ''}
              `}>
                {calendarDay?.day}
              </span>
              {/* Event Indicators */}
              {hasEvents && (
                <div className="absolute bottom-1 left-1 right-1 flex gap-1 flex-wrap">
                  {dayEvents?.slice(0, 3)?.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`w-2 h-2 rounded-full ${getEventIndicatorColor(event?.type)}`}
                      title={event?.title}
                    />
                  ))}
                  {dayEvents?.length > 3 && (
                    <div className="w-2 h-2 rounded-full bg-gray-400" title={`+${dayEvents?.length - 3} more`} />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;