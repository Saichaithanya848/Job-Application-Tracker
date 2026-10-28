import React from 'react';

/**
 * Reusable StatCard component
 * Displays a single key metric with a clean title, large number, and accent icon.
 */
const StatCard = ({ title, value, icon, color, bg }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div
        className="stat-icon-wrapper"
        style={{
          backgroundColor: bg || '#eff6ff',
          color: color || '#2563eb',
        }}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
