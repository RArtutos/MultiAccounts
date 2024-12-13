import { commonStyles } from './common.js';

export const dashboardStyles = `
  ${commonStyles}
  
  .account {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .account::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #60a5fa, #a855f7);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .account:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.2);
  }

  .account:hover::before {
    opacity: 1;
  }
  
  .account h3 {
    font-size: 1.25rem;
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    font-weight: 600;
  }
  
  .account p {
    color: var(--text-secondary);
    margin: 0.5rem 0;
    font-size: 0.875rem;
  }
  
  .usage-info {
    margin: 1.5rem 0;
  }
  
  .progress-bar {
    width: 100%;
    height: 6px;
    background-color: var(--bg-primary);
    border-radius: 999px;
    overflow: hidden;
    margin: 0.75rem 0;
  }
  
  .progress {
    height: 100%;
    background: linear-gradient(135deg, #60a5fa, #a855f7);
    transition: width 0.3s ease;
  }
  
  .slots-available {
    color: var(--success);
    font-weight: 500;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .slots-available::before {
    content: '●';
    color: var(--success);
  }
  
  .no-slots {
    color: var(--error);
    font-weight: 500;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .no-slots::before {
    content: '●';
    color: var(--error);
  }
  
  .access-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #60a5fa, #a855f7);
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    margin-top: 1rem;
    font-weight: 500;
    transition: all 0.2s ease;
    border: none;
    width: 100%;
  }
  
  .access-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-bottom: 1rem;
    gap: 0.375rem;
  }
  
  .status-available {
    background-color: rgba(34, 197, 94, 0.1);
    color: var(--success);
    border: 1px solid rgba(34, 197, 94, 0.2);
  }

  .status-available::before {
    content: '●';
    color: var(--success);
  }
  
  .status-in-use {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--error);
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  .status-in-use::before {
    content: '●';
    color: var(--error);
  }
`;