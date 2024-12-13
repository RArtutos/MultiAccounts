import { commonStyles } from './common.js';

export const adminDashboardStyles = `
  ${commonStyles}
  
  .admin-account {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
  }

  .account-title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .account-icon {
    width: 48px;
    height: 48px;
  }

  .account-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .account-settings {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

  .icon-button {
    padding: 0.5rem;
    border: none;
    border-radius: 0.375rem;
    background: var(--bg-secondary);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .icon-button.warning:hover {
    background: var(--error);
  }

  .icon-button.success:hover {
    background: var(--success);
  }

  .icon-button.danger:hover {
    background: var(--error);
  }

  @media (max-width: 768px) {
    .account-settings {
      grid-template-columns: 1fr;
    }
  }
`;