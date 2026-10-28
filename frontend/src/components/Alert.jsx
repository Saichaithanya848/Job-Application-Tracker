import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

/**
 * Reusable Alert banner component for displaying success and error messages.
 */
const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const getAlertConfig = () => {
    switch (type) {
      case 'error':
        return {
          className: 'alert alert-error',
          icon: <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />,
        };
      case 'success':
        return {
          className: 'alert alert-success',
          icon: <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />,
        };
      case 'info':
      default:
        return {
          className: 'alert alert-info',
          icon: <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />,
        };
    }
  };

  const { className, icon } = getAlertConfig();

  return (
    <div className={className} role="alert">
      {icon}
      <div style={{ flex: 1 }}>{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ marginLeft: '0.5rem', color: 'inherit', opacity: 0.7 }}
          aria-label="Dismiss alert"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
