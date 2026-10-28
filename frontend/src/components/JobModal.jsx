import React, { useState, useEffect } from 'react';
import Alert from './Alert';
import { X } from 'lucide-react';

/**
 * JobModal Component
 * Handles creating new applications and updating existing applications.
 */
const JobModal = ({ isOpen, onClose, onSave, jobToEdit }) => {
  const isEdit = !!jobToEdit;

  // Format date helper for HTML <input type="date">
  const formatInputDate = (dateVal) => {
    if (!dateVal) return new Date().toISOString().split('T')[0];
    const d = new Date(dateVal);
    return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  };

  const initialFormData = {
    company: '',
    jobTitle: '',
    jobType: 'Full-time',
    status: 'Applied',
    location: 'Remote',
    applicationDate: new Date().toISOString().split('T')[0],
    jobUrl: '',
    jobDescription: '',
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync form data when jobToEdit changes or modal opens
  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        company: jobToEdit.company || '',
        jobTitle: jobToEdit.jobTitle || '',
        jobType: jobToEdit.jobType || 'Full-time',
        status: jobToEdit.status || 'Applied',
        location: jobToEdit.location || 'Remote',
        applicationDate: formatInputDate(jobToEdit.applicationDate),
        jobUrl: jobToEdit.jobUrl || '',
        jobDescription: jobToEdit.jobDescription || '',
        notes: jobToEdit.notes || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setError('');
  }, [jobToEdit, isOpen]);

  // Prevent background page from scrolling while modal is open
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

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.company.trim()) {
      setError('Company name is required.');
      return;
    }
    if (!formData.jobTitle.trim()) {
      setError('Job title is required.');
      return;
    }

    setSubmitting(true);
    try {
      await onSave(formData, jobToEdit?._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save job application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Job Application' : 'Add New Application'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}

            <div className="form-grid">
              {/* Company */}
              <div className="form-group">
                <label className="form-label" htmlFor="company">
                  Company Name <span className="required">*</span>
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  className="form-input"
                  placeholder="e.g. Google, Stripe, Notion"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Job Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="jobTitle">
                  Job Title <span className="required">*</span>
                </label>
                <input
                  id="jobTitle"
                  type="text"
                  name="jobTitle"
                  className="form-input"
                  placeholder="e.g. Software Engineer Intern"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Job Type */}
              <div className="form-group">
                <label className="form-label" htmlFor="jobType">
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  className="form-select"
                  value={formData.jobType}
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label" htmlFor="status">
                  Application Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Applied">Applied</option>
                  <option value="Assessment">Assessment</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label" htmlFor="location">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="e.g. Remote, New York, NY"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              {/* Application Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="applicationDate">
                  Date Applied
                </label>
                <input
                  id="applicationDate"
                  type="date"
                  name="applicationDate"
                  className="form-input"
                  value={formData.applicationDate}
                  onChange={handleChange}
                />
              </div>

              {/* Job URL */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="jobUrl">
                  Job Posting URL
                </label>
                <input
                  id="jobUrl"
                  type="url"
                  name="jobUrl"
                  className="form-input"
                  placeholder="https://company.com/careers/job-id"
                  value={formData.jobUrl}
                  onChange={handleChange}
                />
              </div>

              {/* Job Description */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="jobDescription">
                  Job Description / Requirements
                </label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  className="form-textarea"
                  placeholder="Paste brief key qualifications or tech stack..."
                  value={formData.jobDescription}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              {/* Notes */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="notes">
                  Personal Notes / Follow-ups
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-textarea"
                  placeholder="e.g. Referred by Jane, next interview round next Tuesday..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Application' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
