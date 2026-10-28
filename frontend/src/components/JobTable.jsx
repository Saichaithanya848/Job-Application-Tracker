import React from 'react';
import StatusBadge from './StatusBadge';
import { ExternalLink, Edit2, Trash2, MapPin, Calendar, Building2 } from 'lucide-react';

/**
 * JobTable Component
 * Provides a clean, dense, tabular view for tracking applications (SaaS/ATS style).
 */
const JobTable = ({ jobs, onEdit, onDelete, onStatusChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
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
    <div className="table-container">
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Company & Role</th>
            <th>Status</th>
            <th>Type</th>
            <th>Location</th>
            <th>Applied Date</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="table-row">
              {/* Company & Role */}
              <td>
                <div className="table-company-cell">
                  <div className="company-avatar">
                    {getCompanyInitial(job.company)}
                  </div>
                  <div>
                    <div className="table-company-name">{job.company}</div>
                    <div className="table-job-title">{job.jobTitle}</div>
                  </div>
                </div>
              </td>

              {/* Status with quick change dropdown */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StatusBadge status={job.status} />
                  {onStatusChange && (
                    <select
                      className="quick-status-select"
                      value={job.status}
                      onChange={(e) => onStatusChange(job._id, e.target.value)}
                      title="Quick change status"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Assessment">Assessment</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  )}
                </div>
              </td>

              {/* Job Type */}
              <td>
                <span className="type-tag">{job.jobType}</span>
              </td>

              {/* Location */}
              <td>
                <span className="table-meta-text">
                  <MapPin size={13} style={{ marginRight: 4, color: '#94a3b8' }} />
                  {job.location || 'Remote'}
                </span>
              </td>

              {/* Applied Date */}
              <td>
                <span className="table-meta-text">
                  <Calendar size={13} style={{ marginRight: 4, color: '#94a3b8' }} />
                  {formatDate(job.applicationDate)}
                </span>
              </td>

              {/* Actions */}
              <td>
                <div className="table-actions-cell">
                  {job.jobUrl && (
                    <a
                      href={job.jobUrl.startsWith('http') ? job.jobUrl : `https://${job.jobUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="row-action-btn"
                      title="Open job link"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button
                    className="row-action-btn"
                    onClick={() => onEdit(job)}
                    title="Edit application"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="row-action-btn delete"
                    onClick={() => onDelete(job)}
                    title="Delete application"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
