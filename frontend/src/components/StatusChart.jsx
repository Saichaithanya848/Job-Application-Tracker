import React from 'react';

/**
 * StatusChart Component
 * Renders an accessible visual distribution bar and legend showing breakdown of application statuses.
 */
const StatusChart = ({ distribution = {}, total = 0 }) => {
  const statuses = [
    { key: 'Applied', label: 'Applied', color: '#3b82f6' },
    { key: 'Interview', label: 'Interviews', color: '#7c3aed' },
    { key: 'Assessment', label: 'Assessments', color: '#d97706' },
    { key: 'Offer', label: 'Offers', color: '#059669' },
    { key: 'Rejected', label: 'Rejections', color: '#dc2626' },
  ];

  const calculatePercentage = (count) => {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Pipeline Status Distribution</h3>
        <span className="chart-total-pill">
          <strong>{total}</strong> Total Tracked
        </span>
      </div>

      {/* Visual Segmented Progress Bar */}
      <div
        className="distribution-bar"
        role="progressbar"
        aria-valuenow={total}
        aria-valuemin="0"
        aria-valuemax={total}
      >
        {total === 0 ? (
          <div
            className="distribution-segment"
            style={{ width: '100%', backgroundColor: '#e2e8f0' }}
            title="No applications tracked yet"
          />
        ) : (
          statuses.map((s) => {
            const count = distribution[s.key] || 0;
            const pct = (count / total) * 100;
            if (pct === 0) return null;
            return (
              <div
                key={s.key}
                className="distribution-segment"
                style={{
                  width: `${pct}%`,
                  backgroundColor: s.color,
                }}
                title={`${s.label}: ${count} (${calculatePercentage(count)}%)`}
              />
            );
          })
        )}
      </div>

      {/* Clear, Spacious Legend Grid with distinct chips */}
      <div className="legend-grid">
        {statuses.map((s) => {
          const count = distribution[s.key] || 0;
          const pct = calculatePercentage(count);
          return (
            <div key={s.key} className="legend-chip">
              <div className="legend-chip-left">
                <span className="legend-dot" style={{ backgroundColor: s.color }} />
                <span className="legend-chip-label">{s.label}</span>
              </div>
              <div className="legend-chip-value">
                <span className="legend-chip-count">{count}</span>
                <span className="legend-chip-pct">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusChart;
