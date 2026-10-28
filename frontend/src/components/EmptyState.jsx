import React from 'react';
import { Briefcase, SearchX } from 'lucide-react';

/**
 * Reusable EmptyState component
 */
const EmptyState = ({
  iconType = 'briefcase',
  title = 'No job applications found',
  description = 'Start tracking your career opportunities by adding your first job application.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {iconType === 'search' ? <SearchX size={28} /> : <Briefcase size={28} />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{description}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
