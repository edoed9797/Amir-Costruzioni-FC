import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EventModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  event = null,
  selectedDate = null 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'training',
    date: '',
    time: '',
    location: '',
    opponent: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const eventTypeOptions = [
    { value: 'match', label: 'Match' },
    { value: 'training', label: 'Training Session' },
    { value: 'team-event', label: 'Team Event' }
  ];
  
  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Editing existing event
        setFormData({
          title: event?.title || '',
          type: event?.type || 'training',
          date: event?.date || '',
          time: event?.time || '',
          location: event?.location || '',
          opponent: event?.opponent || '',
          description: event?.description || ''
        });
      } else {
        // Creating new event
        const dateString = selectedDate ? 
          selectedDate?.toISOString()?.split('T')?.[0] : 
          new Date()?.toISOString()?.split('T')?.[0];
          
        setFormData({
          title: '',
          type: 'training',
          date: dateString,
          time: '18:00',
          location: '',
          opponent: '',
          description: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, event, selectedDate]);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.title?.trim()) {
      newErrors.title = 'Event title is required';
    }
    
    if (!formData?.date) {
      newErrors.date = 'Event date is required';
    }
    
    if (!formData?.time) {
      newErrors.time = 'Event time is required';
    }
    
    if (!formData?.location?.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData?.type === 'match' && !formData?.opponent?.trim()) {
      newErrors.opponent = 'Opponent is required for matches';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };
  
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const eventData = {
        ...formData,
        id: event?.id || Date.now()?.toString(),
        rsvp: event?.rsvp || { going: 0, maybe: 0, 'not-going': 0 }
      };
      
      await onSave(eventData);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-1050 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg modal-shadow w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isLoading}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
        
        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input
            label="Event Title"
            type="text"
            value={formData?.title}
            onChange={(e) => handleInputChange('title', e?.target?.value)}
            placeholder="Enter event title"
            error={errors?.title}
            required
          />
          
          <Select
            label="Event Type"
            options={eventTypeOptions}
            value={formData?.type}
            onChange={(value) => handleInputChange('type', value)}
            error={errors?.type}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={formData?.date}
              onChange={(e) => handleInputChange('date', e?.target?.value)}
              error={errors?.date}
              required
            />
            
            <Input
              label="Time"
              type="time"
              value={formData?.time}
              onChange={(e) => handleInputChange('time', e?.target?.value)}
              error={errors?.time}
              required
            />
          </div>
          
          <Input
            label="Location"
            type="text"
            value={formData?.location}
            onChange={(e) => handleInputChange('location', e?.target?.value)}
            placeholder="Enter location"
            error={errors?.location}
            required
          />
          
          {formData?.type === 'match' && (
            <Input
              label="Opponent"
              type="text"
              value={formData?.opponent}
              onChange={(e) => handleInputChange('opponent', e?.target?.value)}
              placeholder="Enter opponent team name"
              error={errors?.opponent}
              required
            />
          )}
          
          <Input
            label="Description"
            type="text"
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            placeholder="Optional description"
          />
          
          {/* Modal Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              loading={isLoading}
              className="flex-1"
            >
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;