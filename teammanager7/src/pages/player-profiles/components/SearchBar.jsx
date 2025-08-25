import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ searchTerm, onSearchChange, placeholder = "Search players by name or jersey number..." }) => {
  return (
    <div className="relative">
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e?.target?.value)}
        className="pl-10"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Icon name="Search" size={16} className="text-muted-foreground" />
      </div>
    </div>
  );
};

export default SearchBar;