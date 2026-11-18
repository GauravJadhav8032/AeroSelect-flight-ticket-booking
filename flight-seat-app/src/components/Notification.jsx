import React from 'react';

export default function Notification({ notification }) {
  if (!notification) return null;
  return (
    <div
      key={notification.id}
      className={`notification notification-${notification.type}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="notification-icon">
        {notification.type === 'error' ? '⚠' : notification.type === 'warning' ? '⚡' : notification.type === 'success' ? '✓' : 'ℹ'}
      </span>
      {notification.message}
    </div>
  );
}
