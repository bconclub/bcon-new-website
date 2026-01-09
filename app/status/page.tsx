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
  versionDate?: string;
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
      setLoading(true);
      const response = await fetch('/api/status', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      setStatusData(data);
      setError(null);
    } catch (err: any) {
      console.error('Status fetch error:', err);
      setError(err.message || 'Failed to fetch status');
      // Set minimal status data even on error
      setStatusData({
        timestamp: new Date().toISOString(),
        git: {
          commitHash: 'unknown',
          commitMessage: 'unknown',
          author: 'unknown',
          authorEmail: 'unknown',
          commitDate: new Date().toISOString(),
          branch: 'unknown',
          remoteUrl: 'unknown',
        },
        database: {
          connected: false,
          status: 'error',
          error: err.message || 'Failed to fetch status',
        },
        errors: [err.message || 'Failed to fetch status'],
        version: 'v1.00',
        versionDate: undefined,
      });
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

  if (loading && !statusData) {
    return (
      <div className="status-container">
        <div className="status-loading">Loading status...</div>
      </div>
    );
  }

  // Show error but still try to display data if available
  if (error && !statusData) {
    return (
      <div className="status-container">
        <div className="status-error">
          <h2>Error Loading Status</h2>
          <p>{error}</p>
          <button onClick={fetchStatus} className="refresh-button" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no data at all, show minimal status
  if (!statusData) {
    return (
      <div className="status-container">
        <div className="status-header">
          <h1>System Status</h1>
          <div className="status-timestamp">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
        <div className="status-grid">
          <div className="status-card">
            <h2>Status</h2>
            <div className="status-item">
              <span className="status-label">Status:</span>
              <span className="status-badge error">Unable to load status data</span>
            </div>
            {error && (
              <div className="status-item">
                <span className="status-label">Error:</span>
                <span className="status-error-text">{error}</span>
              </div>
            )}
          </div>
        </div>
        <div className="status-footer">
          <button onClick={fetchStatus} className="refresh-button">
            Refresh Status
          </button>
        </div>
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
          {statusData.versionDate && (
            <div className="status-item">
              <span className="status-label">Release Date:</span>
              <span className="status-value">{formatDate(statusData.versionDate)}</span>
            </div>
          )}
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
            <span className="status-label">Commit Date:</span>
            <span className="status-value">{formatDate(statusData.git.commitDate)}</span>
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

