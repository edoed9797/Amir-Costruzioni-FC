import React from 'react';
import Button from '../../../components/ui/Button';

const AddPlayerButton = ({ onClick, isAdmin = false }) => {
  if (!isAdmin) return null;

  return (
    <div className="flex justify-end">
      <Button
        variant="default"
        onClick={onClick}
        iconName="Plus"
        iconPosition="left"
      >
        Add New Player
      </Button>
    </div>
  );
};

export default AddPlayerButton;