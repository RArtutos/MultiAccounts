import { commonStyles } from './common.js';
import { cookieManagerStyles } from './cookieManager.js';

export const adminDashboardStyles = `
  ${commonStyles}
  ${cookieManagerStyles}
  
  .admin-account {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .admin-account:hover {
    box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.2);
  }

  .account-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .account-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .account-title {
    flex: 1;
  }

  .account-settings {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    background-color: var(--bg-secondary);
    padding: 1.25rem;
    border-radius: 0.75rem;
  }

  .settings-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .settings-group label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .input-group {
    display: flex;
    gap: 0.5rem;
  }

  .input-group input {
    flex: 1;
    min-width: 0;
  }

  .stats-section {
    background-color: var(--bg-secondary);
    border-radius: 0.75rem;
    padding: 1.25rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .stat-item {
    background-color: var(--bg-primary);
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
  }

  .stat-label {
    display: block;
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    display: block;
    color: var(--text-primary);
    font-size: 1.125rem;
    font-weight: 600;
  }

  .icon-button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .icon-button:hover {
    transform: translateY(-2px);
  }

  .icon-button.success:hover {
    background-color: var(--success);
  }

  .icon-button.warning:hover {
    background-color: #f59e0b;
  }

  .icon-button.danger:hover {
    background-color: var(--error);
  }

  .inline-form {
    display: inline-block;
    margin: 0 0.25rem;
  }

  @media (max-width: 768px) {
    .account-settings {
      grid-template-columns: 1fr;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
`;