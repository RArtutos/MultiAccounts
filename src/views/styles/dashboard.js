import { commonStyles } from './common.js';

export const dashboardStyles = `
  ${commonStyles}
  
  .account {
    background-color: var(--card-bg);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease;
  }
  
  .account:hover {
    transform: translateY(-4px);
  }
  
  .account h3 {
    font-size: 1.25rem;
    margin: 0 0 1rem 0;
    color: var(--text-primary);
  }
  
  .account p {
    color: var(--text-secondary);
    margin: 0.5rem 0;
  }
  
  .usage-info {
    margin: 1rem 0;
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: var(--bg-primary);
    border-radius: 4px;
    overflow: hidden;
    margin: 0.5rem 0;
  }
  
  .progress {
    height: 100%;
    background: linear-gradient(to right, var(--accent), #8b5cf6);
    transition: width 0.3s ease;
  }
  
  .slots-available {
    color: var(--success);
    font-weight: 500;
  }
  
  .no-slots {
    color: var(--error);
    font-weight: 500;
  }
  
  .access-button {
    display: inline-block;
    background: linear-gradient(to right, var(--accent), #8b5cf6);
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    margin-top: 1rem;
    font-weight: 500;
    transition: transform 0.2s ease;
  }
  
  .access-button:hover {
    transform: translateY(-2px);
  }
  
  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
  
  .status-available {
    background-color: rgba(34, 197, 94, 0.1);
    color: var(--success);
  }
  
  .status-in-use {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--error);
  }
`;