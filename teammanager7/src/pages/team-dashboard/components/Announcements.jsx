import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const Announcements = ({ announcements }) => {
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const toggleExpanded = (id) => {
    setExpandedAnnouncement(expandedAnnouncement === id ? null : id);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return { icon: 'AlertTriangle', color: 'text-error' };
      case 'medium':
        return { icon: 'Info', color: 'text-warning' };
      default:
        return { icon: 'MessageCircle', color: 'text-primary' };
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border card-shadow p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Megaphone" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Team Announcements</h2>
      </div>
      <div className="space-y-3">
        {announcements?.map((announcement) => {
          const priorityConfig = getPriorityIcon(announcement?.priority);
          const isExpanded = expandedAnnouncement === announcement?.id;
          const shouldShowExpand = announcement?.content?.length > 150;
          
          return (
            <div key={announcement?.id} className="p-3 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <Icon 
                  name={priorityConfig?.icon} 
                  size={16} 
                  className={`${priorityConfig?.color} mt-0.5 flex-shrink-0`} 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-foreground">{announcement?.title}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatDate(announcement?.createdAt)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {shouldShowExpand && !isExpanded ? (
                      <>
                        {announcement?.content?.substring(0, 150)}...
                        <button
                          onClick={() => toggleExpanded(announcement?.id)}
                          className="text-primary hover:text-primary/80 ml-1 font-medium"
                        >
                          Read more
                        </button>
                      </>
                    ) : (
                      <>
                        {announcement?.content}
                        {shouldShowExpand && isExpanded && (
                          <button
                            onClick={() => toggleExpanded(announcement?.id)}
                            className="text-primary hover:text-primary/80 ml-1 font-medium"
                          >
                            Show less
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>By {announcement?.author}</span>
                    {announcement?.pinned && (
                      <div className="flex items-center gap-1">
                        <Icon name="Pin" size={12} className="text-primary" />
                        <span className="text-primary">Pinned</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium transition-smooth">
        View All Announcements
      </button>
    </div>
  );
};

export default Announcements;