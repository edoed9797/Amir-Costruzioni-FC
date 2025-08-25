import React from 'react';
import Button from '../../../components/ui/Button';


const FilterChips = ({ 
  selectedPosition, 
  onPositionChange, 
  selectedStatus, 
  onStatusChange, 
  sortOrder, 
  onSortChange 
}) => {
  const positions = [
    { value: 'all', label: 'All Positions' },
    { value: 'goalkeeper', label: 'Goalkeeper' },
    { value: 'defender', label: 'Defender' },
    { value: 'midfielder', label: 'Midfielder' },
    { value: 'forward', label: 'Forward' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' }
  ];

  return (
    <div className="space-y-3">
      {/* Position Filters */}
      <div className="flex flex-wrap gap-2">
        {positions?.map((position) => (
          <Button
            key={position?.value}
            variant={selectedPosition === position?.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPositionChange(position?.value)}
            className="text-xs"
          >
            {position?.label}
          </Button>
        ))}
      </div>
      {/* Status and Sort Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {statuses?.map((status) => (
          <Button
            key={status?.value}
            variant={selectedStatus === status?.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStatusChange(status?.value)}
            className="text-xs"
          >
            {status?.label}
          </Button>
        ))}
        
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onSortChange}
            iconName={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
            iconPosition="right"
            className="text-xs"
          >
            Name {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterChips;