export const cookieManagerStyles = `
  .cookie-manager {
    background-color: var(--bg-secondary);
    padding: 1.25rem;
    border-radius: 0.75rem;
    margin: 0;
    overflow: hidden;
  }

  .cookie-manager h4 {
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .cookie-form {
    margin-bottom: 1.25rem;
  }

  .cookie-form .form-group {
    display: grid;
    grid-template-columns: minmax(120px, 1fr) minmax(200px, 2fr) auto;
    gap: 0.75rem;
    align-items: center;
  }

  .cookie-form input {
    min-width: 0;
    width: 100%;
  }

  .cookies-list {
    max-height: 250px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: var(--bg-primary);
    scrollbar-width: thin;
    scrollbar-color: var(--text-secondary) var(--bg-primary);
  }

  .cookie-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-color);
    gap: 0.75rem;
    min-width: 0;
  }

  .cookie-item:last-child {
    border-bottom: none;
  }

  .cookie-info {
    display: grid;
    grid-template-columns: minmax(100px, 150px) minmax(0, 1fr);
    gap: 1rem;
    flex: 1;
    min-width: 0;
    align-items: center;
  }

  .cookie-name {
    font-weight: 500;
    color: var(--accent);
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 0.5rem;
  }

  .cookie-value-container {
    position: relative;
    min-width: 0;
  }

  .cookie-value {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    background-color: var(--bg-primary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid var(--border-color);
  }

  .cookie-value:hover {
    background-color: var(--bg-secondary);
  }

  .cookie-value-tooltip {
    display: none;
    position: absolute;
    z-index: 100;
    top: calc(100% + 5px);
    left: 0;
    right: 0;
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    padding: 0.5rem;
    font-size: 0.875rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    word-break: break-all;
    color: var(--text-secondary);
  }

  .cookie-value:hover + .cookie-value-tooltip {
    display: block;
  }

  .cookie-actions {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .cookie-actions .icon-button {
    width: 28px;
    height: 28px;
    padding: 0;
    border-radius: 0.375rem;
  }

  @media (max-width: 768px) {
    .cookie-form .form-group {
      grid-template-columns: 1fr;
    }

    .cookie-info {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .cookie-name {
      padding-right: 0;
    }
  }
`;