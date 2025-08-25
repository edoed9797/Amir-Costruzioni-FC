import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const StatisticsFilters = ({ filters, onFilterChange, onReset }) => {
  const seasonOptions = [
    { value: '2024-25', label: '2024-25 Season' },
    { value: '2023-24', label: '2023-24 Season' },
    { value: '2022-23', label: '2022-23 Season' }
  ];

  const competitionOptions = [
    { value: 'all', label: 'All Competitions' },
    { value: 'league', label: 'League' },
    { value: 'cup', label: 'Cup' },
    { value: 'friendly', label: 'Friendly' }
  ];

  const viewOptions = [
    { value: 'all', label: 'All Matches' },
    { value: 'home', label: 'Home Only' },
    { value: 'away', label: 'Away Only' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg card-shadow p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Filter" size={20} className="text-primary" />
        <h3 className="font-medium text-foreground">Filters</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          label="Season"
          options={seasonOptions}
          value={filters?.season}
          onChange={(value) => onFilterChange('season', value)}
        />

        <Select
          label="Competition"
          options={competitionOptions}
          value={filters?.competition}
          onChange={(value) => onFilterChange('competition', value)}
        />

        <Select
          label="Venue"
          options={viewOptions}
          value={filters?.venue}
          onChange={(value) => onFilterChange('venue', value)}
        />

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onReset}
            iconName="RotateCcw"
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsFilters;