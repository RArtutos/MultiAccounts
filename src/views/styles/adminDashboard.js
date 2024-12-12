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
    transition: all 0.3s ease;
    max-width: 100%;
    overflow: hidden;
  }

  .admin-account:hover {
    box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.2);
  }

  .account-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .account-section {
    background-color: var(--bg-secondary);
    border-radius: 0.75rem;
    padding: 1.25rem;
    overflow: hidden;
  }

  /* ... resto del código existente ... */
`;