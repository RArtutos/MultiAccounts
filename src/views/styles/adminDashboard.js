import { commonStyles } from './common.js';

export const adminDashboardStyles = `
  ${commonStyles}
  
  .form-container {
    background-color: var(--card-bg);
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #4b5563;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    margin-top: 0.25rem;
  }
  
  button {
    background-color: var(--accent);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }
  
  button:hover {
    background-color: #2563eb;
  }
  
  .danger {
    background-color: var(--error);
  }
  
  .danger:hover {
    background-color: #dc2626;
  }
  
  .stats-panel {
    background-color: var(--bg-primary);
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin: 1rem 0;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .stat-item {
    background-color: var(--card-bg);
    padding: 1rem;
    border-radius: 0.5rem;
  }
  
  .stat-label {
    display: block;
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    display: block;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .cookie-form {
    background-color: var(--bg-primary);
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-top: 1rem;
  }
  
  .cookie-list {
    margin-top: 1rem;
  }
  
  .cookie-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background-color: var(--card-bg);
    border-radius: 0.5rem;
    margin: 0.5rem 0;
  }
  
  .button-group {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  /* Estilos compartidos con el dashboard */
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