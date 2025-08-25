import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MatchRecordModal = ({ isOpen, onClose, onSave, match = null }) => {
  const [formData, setFormData] = useState({
    opponent: match?.opponent || '',
    date: match?.date || new Date()?.toISOString()?.split('T')?.[0],
    venue: match?.venue || 'Home',
    homeScore: match?.homeScore || 0,
    awayScore: match?.awayScore || 0,
    goalScorers: match?.goalScorers || [],
    cards: match?.cards || [],
    mvpId: match?.mvp?.id || ''
  });

  const [goalScorer, setGoalScorer] = useState({ playerId: '', minute: '', assist: '' });
  const [cardData, setCardData] = useState({ playerId: '', type: 'yellow', minute: '' });

  // Mock players data
  const players = [
    { value: '1', label: 'Marcus Johnson' },
    { value: '2', label: 'David Rodriguez' },
    { value: '3', label: 'James Wilson' },
    { value: '4', label: 'Michael Brown' },
    { value: '5', label: 'Robert Davis' },
    { value: '6', label: 'Christopher Miller' },
    { value: '7', label: 'Daniel Garcia' },
    { value: '8', label: 'Matthew Martinez' },
    { value: '9', label: 'Anthony Anderson' },
    { value: '10', label: 'Joshua Taylor' },
    { value: '11', label: 'Andrew Thomas' }
  ];

  const venueOptions = [
    { value: 'Home', label: 'Home' },
    { value: 'Away', label: 'Away' },
    { value: 'Neutral', label: 'Neutral' }
  ];

  const cardTypeOptions = [
    { value: 'yellow', label: 'Yellow Card' },
    { value: 'red', label: 'Red Card' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addGoalScorer = () => {
    if (goalScorer?.playerId && goalScorer?.minute) {
      const player = players?.find(p => p?.value === goalScorer?.playerId);
      const newGoal = {
        id: Date.now(),
        playerId: goalScorer?.playerId,
        name: player?.label,
        minute: goalScorer?.minute,
        assist: goalScorer?.assist,
        avatar: `https://randomuser.me/api/portraits/men/${goalScorer?.playerId}.jpg`
      };
      
      setFormData(prev => ({
        ...prev,
        goalScorers: [...prev?.goalScorers, newGoal]
      }));
      
      setGoalScorer({ playerId: '', minute: '', assist: '' });
    }
  };

  const addCard = () => {
    if (cardData?.playerId && cardData?.minute) {
      const player = players?.find(p => p?.value === cardData?.playerId);
      const newCard = {
        id: Date.now(),
        playerId: cardData?.playerId,
        player: player?.label,
        type: cardData?.type,
        minute: cardData?.minute,
        avatar: `https://randomuser.me/api/portraits/men/${cardData?.playerId}.jpg`
      };
      
      setFormData(prev => ({
        ...prev,
        cards: [...prev?.cards, newCard]
      }));
      
      setCardData({ playerId: '', type: 'yellow', minute: '' });
    }
  };

  const removeGoalScorer = (id) => {
    setFormData(prev => ({
      ...prev,
      goalScorers: prev?.goalScorers?.filter(goal => goal?.id !== id)
    }));
  };

  const removeCard = (id) => {
    setFormData(prev => ({
      ...prev,
      cards: prev?.cards?.filter(card => card?.id !== id)
    }));
  };

  const handleSave = () => {
    const result = {
      ...formData,
      id: match?.id || Date.now(),
      result: formData?.homeScore > formData?.awayScore ? 'win' : 
              formData?.homeScore < formData?.awayScore ? 'loss' : 'draw',
      mvp: formData?.mvpId ? {
        id: formData?.mvpId,
        name: players?.find(p => p?.value === formData?.mvpId)?.label,
        avatar: `https://randomuser.me/api/portraits/men/${formData?.mvpId}.jpg`
      } : null
    };
    
    onSave(result);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-1050 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg modal-shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {match ? 'Edit Match' : 'Record New Match'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Match Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Opponent"
              value={formData?.opponent}
              onChange={(e) => handleInputChange('opponent', e?.target?.value)}
              placeholder="Enter opponent team name"
              required
            />
            
            <Input
              label="Match Date"
              type="date"
              value={formData?.date}
              onChange={(e) => handleInputChange('date', e?.target?.value)}
              required
            />
            
            <Select
              label="Venue"
              options={venueOptions}
              value={formData?.venue}
              onChange={(value) => handleInputChange('venue', value)}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Our Score"
                type="number"
                min="0"
                value={formData?.homeScore}
                onChange={(e) => handleInputChange('homeScore', parseInt(e?.target?.value) || 0)}
              />
              <Input
                label="Their Score"
                type="number"
                min="0"
                value={formData?.awayScore}
                onChange={(e) => handleInputChange('awayScore', parseInt(e?.target?.value) || 0)}
              />
            </div>
          </div>

          {/* Goal Scorers */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Goal Scorers</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
              <Select
                placeholder="Select player"
                options={players}
                value={goalScorer?.playerId}
                onChange={(value) => setGoalScorer(prev => ({ ...prev, playerId: value }))}
              />
              <Input
                placeholder="Minute"
                type="number"
                min="1"
                max="120"
                value={goalScorer?.minute}
                onChange={(e) => setGoalScorer(prev => ({ ...prev, minute: e?.target?.value }))}
              />
              <Input
                placeholder="Assist (optional)"
                value={goalScorer?.assist}
                onChange={(e) => setGoalScorer(prev => ({ ...prev, assist: e?.target?.value }))}
              />
              <Button onClick={addGoalScorer} iconName="Plus">
                Add Goal
              </Button>
            </div>

            {formData?.goalScorers?.length > 0 && (
              <div className="space-y-2">
                {formData?.goalScorers?.map((goal) => (
                  <div key={goal?.id} className="flex items-center justify-between bg-muted rounded-lg p-2">
                    <span className="text-sm">
                      {goal?.name} ({goal?.minute}') {goal?.assist && `- Assist: ${goal?.assist}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeGoalScorer(goal?.id)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Cards</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
              <Select
                placeholder="Select player"
                options={players}
                value={cardData?.playerId}
                onChange={(value) => setCardData(prev => ({ ...prev, playerId: value }))}
              />
              <Select
                options={cardTypeOptions}
                value={cardData?.type}
                onChange={(value) => setCardData(prev => ({ ...prev, type: value }))}
              />
              <Input
                placeholder="Minute"
                type="number"
                min="1"
                max="120"
                value={cardData?.minute}
                onChange={(e) => setCardData(prev => ({ ...prev, minute: e?.target?.value }))}
              />
              <Button onClick={addCard} iconName="Plus">
                Add Card
              </Button>
            </div>

            {formData?.cards?.length > 0 && (
              <div className="space-y-2">
                {formData?.cards?.map((card) => (
                  <div key={card?.id} className="flex items-center justify-between bg-muted rounded-lg p-2">
                    <span className="text-sm">
                      {card?.player} - {card?.type === 'yellow' ? 'Yellow' : 'Red'} Card ({card?.minute}')
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCard(card?.id)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MVP Selection */}
          <div>
            <Select
              label="Man of the Match"
              placeholder="Select MVP (optional)"
              options={players}
              value={formData?.mvpId}
              onChange={(value) => handleInputChange('mvpId', value)}
            />
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {match ? 'Update Match' : 'Save Match'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchRecordModal;