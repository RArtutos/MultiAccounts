import { commonStyles } from './common.js';

export const dashboardStyles = `
  ${commonStyles}
  
  .filters {
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .filter-button {
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .filter-button:hover,
  .filter-button.active {
    background-color: var(--accent);
    color: white;
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .filter-button .platform-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  .account {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
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

  .account-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .platform-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .platform-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
  }
  
  .platform-badge {
    background: linear-gradient(135deg, #60a5fa20, #a855f720);
    border: 1px solid #60a5fa40;
    color: #60a5fa;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Rest of the existing styles... */
`;