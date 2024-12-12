import { commonStyles } from './common.js';

export const adminDashboardStyles = `
  ${commonStyles}
  
  .admin-account {
    background-color: var(--card-bg);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .account-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
  }

  .account-title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .account-actions {
    display: flex;
    gap: 0.5rem;
  }

  .url-section {
    margin-bottom: 1.5rem;
  }

  .url-input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid var(--text-secondary);
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }

  .users-section {
    margin-bottom: 1.5rem;
  }

  .users-form {
    margin-bottom: 1rem;
  }

  .number-input {
    display: flex;
    gap: 0.5rem;
  }

  .users-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background-color: var(--bg-primary);
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .stats-section {
    background-color: var(--bg-primary);
    padding: 1rem;
    border-radius: 0.5rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .stat-item {
    background-color: var(--card-bg);
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
  }

  .stat-label {
    display: block;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 500;
  }

  .icon-button {
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }

  .icon-button.danger {
    background-color: var(--error);
  }

  .icon-button.warning {
    background-color: #f59e0b;
  }

  .icon-button.success {
    background-color: var(--success);
  }

  .add-button {
    background-color: var(--accent);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .account-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
`;