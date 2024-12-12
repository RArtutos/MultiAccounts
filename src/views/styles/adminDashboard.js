import { commonStyles } from './common.js';

export const adminDashboardStyles = `
  ${commonStyles}
  
  .admin-account {
    background-color: var(--card-bg);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }

  .account-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .account-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .account-actions {
    display: flex;
    gap: 0.5rem;
  }

  .account-details {
    display: grid;
    gap: 1.5rem;
  }

  .cookie-manager {
    background-color: var(--bg-primary);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .cookie-form {
    margin-bottom: 1rem;
  }

  .cookie-form .form-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    align-items: end;
  }

  .cookie-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background-color: var(--card-bg);
    border-radius: 0.5rem;
    margin: 0.5rem 0;
    flex-wrap: wrap;
    gap: 0.5rem;
    word-break: break-all;
  }

  .cookie-info {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    flex: 1;
    min-width: 0;
  }

  .cookie-name {
    font-weight: 500;
    min-width: 100px;
  }

  .cookie-value {
    color: var(--text-secondary);
    flex: 1;
    min-width: 0;
    overflow-wrap: break-word;
  }

  .cookies-list {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .cookies-list::-webkit-scrollbar {
    width: 8px;
  }

  .cookies-list::-webkit-scrollbar-track {
    background: var(--bg-primary);
    border-radius: 4px;
  }

  .cookies-list::-webkit-scrollbar-thumb {
    background: var(--text-secondary);
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    .cookie-form .form-group {
      grid-template-columns: 1fr;
    }

    .cookie-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .cookie-info {
      width: 100%;
      flex-direction: column;
      gap: 0.5rem;
    }

    .account-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .account-title {
      width: 100%;
    }

    .account-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  /* Resto de los estilos sin cambios */
  ${commonStyles}
`;