import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventFilters = ({ 
  activeFilters, 
  onFilterChange, 
  viewMode, 
  onViewModeChange 
}) => {
  const filterOptions = [
    { key: 'match', label: 'Matches', icon: 'Trophy', color: 'text-red-600' },
    { key: 'training', label: 'Training', icon: 'Target', color: 'text-gray-900' },
    { key: 'team-event', label: 'Team Events', icon: 'Users', color: 'text-gray-600' }
  ];
  
  const viewModes = [
    { key: 'month', label: 'Month', icon: 'Calendar' },
    { key: 'week', label: 'Week', icon: 'CalendarDays' },
    { key: 'day', label: 'Day', icon: 'CalendarCheck' }
  ];
  
  const isFilterActive = (filterKey) => {
    return activeFilters?.includes(filterKey);
  };

  return (
    <div className="bg-card border border-border rounded-lg card-shadow p-4 space-y-4">
      {/* View Mode Toggle */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-2">View</h3>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {viewModes?.map((mode) => (
            <Button
              key={mode?.key}
              variant={viewMode === mode?.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange(mode?.key)}
              className="flex-1 flex items-center gap-2"
            >
              <Icon name={mode?.icon} size={16} />
              <span className="hidden sm:inline">{mode?.label}</span>
            </Button>
          ))}
        </div>
      </div>
      {/* Event Type Filters */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-2">Event Types</h3>
        <div className="space-y-2">
          {filterOptions?.map((filter) => (
            <Button
              key={filter?.key}
              variant={isFilterActive(filter?.key) ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(filter?.key)}
              className="w-full justify-start gap-2"
            >
              <Icon 
                name={filter?.icon} 
                size={16} 
                className={!isFilterActive(filter?.key) ? filter?.color : ''} 
              />
              {filter?.label}
              {isFilterActive(filter?.key) && (
                <Icon name="Check" size={14} className="ml-auto" />
              )}
            </Button>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="border-t border-border pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange('all')}
            className="flex-1"
          >
            <Icon name="Eye" size={16} />
            <span className="ml-2">Show All</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange('clear')}
            className="flex-1"
          >
            <Icon name="EyeOff" size={16} />
            <span className="ml-2">Hide All</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;