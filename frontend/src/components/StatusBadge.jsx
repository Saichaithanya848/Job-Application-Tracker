import React from 'react';

/**
 * Handcrafted StatusBadge Component
 * Features a subtle border and colored dot indicator (Linear / GitHub style).
 */
const StatusBadge = ({ status, className = '' }) => {
  const getBadgeConfig = (statusName) => {
    switch (statusName) {
      case 'Interview':
        return {
          bg: '#f5f3ff',
          color: '#6d28d9',
          border: '#ddd6fe',
          dot: '#7c3aed',
          label: 'Interview',
        };
      case 'Assessment':
        return {
          bg: '#fffbeb',
          color: '#b45309',
          border: '#fde68a',
          dot: '#d97706',
          label: 'Assessment',
        };
      case 'Offer':
        return {
          bg: '#ecfdf5',
          color: '#047857',
          border: '#a7f3d0',
          dot: '#059669',
          label: 'Offer',
        };
      case 'Rejected':
        return {
          bg: '#fef2f2',
          color: '#b91c1c',
          border: '#fecaca',
          dot: '#dc2626',
          label: 'Rejected',
        };
      case 'Applied':
      default:
        return {
          bg: '#eff6ff',
          color: '#1d4ed8',
          border: '#bfdbfe',
          dot: '#2563eb',
          label: 'Applied',
        };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span
      className={`status-pill ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        borderColor: config.border,
      }}
    >
      <span className="status-dot" style={{ backgroundColor: config.dot }} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
