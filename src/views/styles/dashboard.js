import { commonStyles } from './common.js';

export const dashboardStyles = `
  ${commonStyles}
  
  .filters {
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: 1rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .filter-button {
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .filter-button:hover,
  .filter-button.active {
    background: linear-gradient(135deg, var(--accent), #4f46e5);
    color: white;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .account {
    background: linear-gradient(145deg, var(--card-bg), var(--bg-secondary));
    border: 1px solid var(--border-color);
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    backdrop-filter: blur(10px);
  }
  
  .account::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, var(--accent), #4f46e5);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .account:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
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
    width: 64px;
    height: 64px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .platform-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .platform-badge {
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(168, 85, 247, 0.1));
    border: 1px solid rgba(96, 165, 250, 0.2);
    color: var(--accent);
    padding: 0.5rem 1rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .account h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0.5rem 0;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin: 0.5rem 0;
  }

  .tag {
    background: rgba(59, 130, 246, 0.1);
    color: var(--accent);
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 999px;
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

  .usage-info {
    width: 100%;
    margin: 1.5rem 0;
  }

  .users-counter {
    text-align: center;
    margin-bottom: 1rem;
  }

  .counter-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent);
  }

  .counter-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-primary);
    border-radius: 999px;
    overflow: hidden;
  }

  .progress {
    height: 100%;
    background: linear-gradient(135deg, var(--accent), #4f46e5);
    transition: width 0.3s ease;
  }

  .account-actions {
    margin-top: 1.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .access-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, var(--accent), #4f46e5);
    color: white;
    padding: 1rem;
    border-radius: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .access-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .button-icon {
    font-size: 1.25rem;
  }

  .slots-available {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #22c55e;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .account-unavailable {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #ef4444;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 1rem;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 0.75rem;
  }

  @media (max-width: 768px) {
    .filters {
      padding: 1rem;
    }

    .filter-button {
      width: 100%;
      justify-content: center;
    }

    .account {
      padding: 1.5rem;
    }
  }
`;