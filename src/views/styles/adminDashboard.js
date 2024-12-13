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
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .account-icon {
    font-size: 2rem;
    background: linear-gradient(135deg, #60a5fa, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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

  .input-group {
    display: flex;
    gap: 0.5rem;
  }

  .input-group input {
    flex: 1;
    min-width: 0;
  }

  .tags-input {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    min-height: 42px;
  }

  .tag {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background-color: var(--accent);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }

  .tag button {
    background: none;
    border: none;
    color: white;
    padding: 0;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
  }

  .tag-input {
    background: none;
    border: none;
    color: var(--text-primary);
    padding: 0;
    margin: 0;
    min-width: 60px;
    flex: 1;
  }

  .tag-input:focus {
    outline: none;
  }

  .platform-select {
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    width: 100%;
  }

  .platform-select option {
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }

  .icon-select {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .icon-option {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .icon-option:hover,
  .icon-option.selected {
    background-color: var(--accent);
    border-color: var(--accent);
  }

  @media (max-width: 768px) {
    .account-settings {
      grid-template-columns: 1fr;
    }
  }
`;