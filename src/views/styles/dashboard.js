import { commonStyles } from './common.js';

export const dashboardStyles = `
  ${commonStyles}
  
  .accounts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0;
  }

  .account {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }

  .account:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }

  .platform-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
  }

  .platform-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    margin: 1rem 0;
  }

  .status-available { 
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }

  .status-in-use {
    background: rgba(234, 179, 8, 0.1);
    color: #eab308;
  }

  .status-blocked {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .access-button {
    display: block;
    background: var(--accent);
    color: white;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    text-align: center;
    font-weight: 600;
    margin-top: 1rem;
    transition: background-color 0.3s ease;
  }

  .access-button:hover {
    background: var(--accent-hover);
  }
`;