'use client';

import { useEffect, useState } from 'react';
import './status.css';

interface StatusData {
  timestamp: string;
  git: {
    commitHash: string;
    commitMessage: string;
    author: string;
    authorEmail: string;
    commitDate: string;
    branch: string;
    remoteUrl: string;
  };
  database: {
    connected: boolean;
    status: string;
    error?: string;
    responseTime?: number;
  };
  errors: string[];
  version: string;
}

export default function StatusPage() {
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStatusData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch status');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'status-badge success';
      case 'error':
        return 'status-badge error';
      default:
        return 'status-badge unknown';
    }
  };

  if (loading) {
    return (
      <div className="status-container">
        <div className="status-loading">Loading status...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container">
        <div className="status-error">Error: {error}</div>
      </div>
    );
  }

  if (!statusData) {
    return (
      <div className="status-container">
        <div className="status-error">No status data available</div>
      </div>
    );
  }

  return (
    <div className="status-container">
      <div className="status-header">
        <h1>System Status</h1>
        <div className="status-timestamp">
          Last updated: {formatDate(statusData.timestamp)}
        </div>
      </div>

      <div className="status-grid">
        {/* Version Info */}
        <div className="status-card">
          <h2>Version Information</h2>
          <div className="status-item">
            <span className="status-label">Version:</span>
            <span className="status-value">{statusData.version}</span>
          </div>
        </div>

        {/* Git Information */}
        <div className="status-card">
          <h2>Git Information</h2>
          <div className="status-item">
            <span className="status-label">Branch:</span>
            <span className="status-value">{statusData.git.branch}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Commit Hash:</span>
            <span className="status-value commit-hash">{statusData.git.commitHash.substring(0, 7)}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Commit Message:</span>
            <span className="status-value">{statusData.git.commitMessage}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Author:</span>
            <span className="status-value">{statusData.git.author}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Author Email:</span>
            <span className="status-value">{statusData.git.authorEmail}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Commit Date:</span>
            <span className="status-value">{formatDate(statusData.git.commitDate)}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Remote URL:</span>
            <span className="status-value remote-url">{statusData.git.remoteUrl}</span>
          </div>
        </div>

        {/* Database Status */}
        <div className="status-card">
          <h2>Database Status</h2>
          <div className="status-item">
            <span className="status-label">Connection:</span>
            <span className={getStatusBadgeClass(statusData.database.status)}>
              {statusData.database.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Status:</span>
            <span className={getStatusBadgeClass(statusData.database.status)}>
              {statusData.database.status}
            </span>
          </div>
          {statusData.database.responseTime !== undefined && (
            <div className="status-item">
              <span className="status-label">Response Time:</span>
              <span className="status-value">{statusData.database.responseTime}ms</span>
            </div>
          )}
          {statusData.database.error && (
            <div className="status-item">
              <span className="status-label">Error:</span>
              <span className="status-error-text">{statusData.database.error}</span>
            </div>
          )}
        </div>

        {/* Errors */}
        {statusData.errors.length > 0 && (
          <div className="status-card error-card">
            <h2>Errors</h2>
            <ul className="error-list">
              {statusData.errors.map((error, index) => (
                <li key={index} className="error-item">{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="status-footer">
        <button onClick={fetchStatus} className="refresh-button">
          Refresh Status
        </button>
      </div>
    </div>
  );
}

