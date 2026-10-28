import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * DeleteModal Component
 * Shows a confirmation dialog before permanently deleting an application.
 */
const DeleteModal = ({ isOpen, onClose, onConfirm, job, deleting }) => {
  // Lock background scroll when open
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

  if (!isOpen || !job) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--status-rejected-bg)',
                color: 'var(--status-rejected)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h3 className="modal-title" style={{ fontSize: '1.15rem' }}>
              Delete Application
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Are you sure you want to delete your application for{' '}
            <strong>{job.jobTitle}</strong> at <strong>{job.company}</strong>?
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Yes, Delete Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
