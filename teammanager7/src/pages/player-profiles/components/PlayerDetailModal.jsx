import React, { useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlayerDetailModal = ({ player, isOpen, onClose, isAdmin = false, onEdit }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event?.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !player) return null;

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-success' : 'text-error';
  };

  const getStatusBgColor = (status) => {
    return status === 'active' ? 'bg-success' : 'bg-error';
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-1050"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div className="fixed inset-0 z-1100 flex items-center justify-center p-4">
        <div 
          className="bg-card rounded-lg modal-shadow max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="player-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 id="player-modal-title" className="text-xl font-bold text-foreground">
              Player Details
            </h2>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                  onClick={() => onEdit(player)}
                >
                  Edit
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close modal"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Player Header */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={player?.photo}
                    alt={`${player?.name} profile photo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {player?.jerseyNumber}
                </div>
              </div>
              
              <div className="text-center sm:text-left space-y-2">
                <h3 className="text-2xl font-bold text-foreground">{player?.name}</h3>
                <p className="text-lg text-muted-foreground">{player?.position}</p>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(player?.membershipStatus)} text-white`}>
                  {player?.membershipStatus === 'active' ? 'Active Member' : 'Expired Membership'}
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">Personal Information</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon name="Calendar" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="text-sm font-medium text-foreground">{player?.dateOfBirth}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon name="MapPin" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-sm font-medium text-foreground">{player?.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon name="Phone" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium text-foreground">{player?.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon name="Mail" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-sm font-medium text-foreground">{player?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">Statistics</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{player?.stats?.appearances}</p>
                    <p className="text-xs text-muted-foreground">Appearances</p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{player?.stats?.goals}</p>
                    <p className="text-xs text-muted-foreground">Goals</p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{player?.stats?.assists}</p>
                    <p className="text-xs text-muted-foreground">Assists</p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{player?.stats?.mvpVotes}</p>
                    <p className="text-xs text-muted-foreground">MVP Votes</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Yellow Cards</span>
                    <span className="text-sm font-medium text-foreground">{player?.stats?.yellowCards}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Red Cards</span>
                    <span className="text-sm font-medium text-foreground">{player?.stats?.redCards}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Payment Status</h4>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Season 2024/25 Fee</p>
                    <p className="text-xs text-muted-foreground">Due: December 31, 2024</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    player?.paymentStatus === 'paid' ?'bg-success text-white' 
                      : player?.paymentStatus === 'overdue' ?'bg-error text-white' :'bg-warning text-white'
                  }`}>
                    {player?.paymentStatus === 'paid' ? 'Paid' : 
                     player?.paymentStatus === 'overdue' ? 'Overdue' : 'Pending'}
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-lg font-bold text-foreground">${player?.seasonFee}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerDetailModal;