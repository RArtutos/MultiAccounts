export const cookieManagerStyles = `
  .cookie-manager {
    background-color: var(--bg-primary);
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
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

  .cookies-list {
    max-height: 200px;
    overflow-y: auto;
    padding-right: 0.5rem;
    margin-top: 1rem;
    border: 1px solid var(--text-secondary);
    border-radius: 0.5rem;
    background-color: var(--card-bg);
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

  .cookie-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid var(--bg-primary);
    gap: 0.5rem;
  }

  .cookie-item:last-child {
    border-bottom: none;
  }

  .cookie-info {
    display: flex;
    gap: 1rem;
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .cookie-name {
    font-weight: 500;
    min-width: 100px;
    color: var(--accent);
  }

  .cookie-value {
    color: var(--text-secondary);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .cookie-form .form-group {
      grid-template-columns: 1fr;
    }

    .cookie-info {
      flex-direction: column;
      gap: 0.25rem;
    }

    .cookie-name {
      min-width: auto;
    }
  }
`;