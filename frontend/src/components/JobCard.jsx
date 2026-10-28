import React from 'react';
import StatusBadge from './StatusBadge';
import { MapPin, Calendar, ExternalLink, Edit2, Trash2 } from 'lucide-react';

/**
 * Handcrafted JobCard Component
 */
const JobCard = ({ job, onEdit, onDelete, onStatusChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCompanyInitial = (name) => {
    return name ? name.trim().charAt(0).toUpperCase() : 'C';
  };

  return (
    <div className="job-card">
      <div>
        {/* Top Header: Monogram Avatar, Company, Title, and Status */}
        <div className="card-top-bar">
          <div className="card-company-group">
            <div className="company-avatar">
              {getCompanyInitial(job.company)}
            </div>
            <div>
              <h4 className="job-company">{job.company}</h4>
              <p className="job-title">{job.jobTitle}</p>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Metadata Badges */}
        <div className="job-meta-row">
          <span className="type-tag">{job.jobType}</span>

          {job.location && (
            <span className="job-meta-item">
              <MapPin size={13} />
              {job.location}
            </span>
          )}

          <span className="job-meta-item">
            <Calendar size={13} />
            {formatDate(job.applicationDate)}
          </span>
        </div>

        {/* Description snippet if available */}
        {job.jobDescription && (
          <p className="job-desc-snippet">
            {job.jobDescription}
          </p>
        )}

        {/* Notes callout */}
        {job.notes && (
          <div className="job-notes-callout">
            <span className="notes-label">Notes</span>
            <p className="notes-text">{job.notes}</p>
          </div>
        )}
      </div>

      {/* Footer: Quick Status Switcher & Action Buttons */}
      <div className="job-card-footer">
        <div className="footer-left">
          {job.jobUrl ? (
            <a
              href={job.jobUrl.startsWith('http') ? job.jobUrl : `https://${job.jobUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="job-url-link"
              title="Open job posting"
            >
              <span>Posting</span>
              <ExternalLink size={12} />
            </a>
          ) : (
            <span className="no-link-text">No URL</span>
          )}

          {/* Inline quick status change */}
          {onStatusChange && (
            <select
              className="quick-status-select"
              value={job.status}
              onChange={(e) => onStatusChange(job._id, e.target.value)}
              title="Quickly change stage"
            >
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}
        </div>

        <div className="job-actions">
          <button
            className="action-btn"
            onClick={() => onEdit(job)}
            title="Edit Application"
            aria-label="Edit Application"
          >
            <Edit2 size={14} />
          </button>
          <button
            className="action-btn delete"
            onClick={() => onDelete(job)}
            title="Delete Application"
            aria-label="Delete Application"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
