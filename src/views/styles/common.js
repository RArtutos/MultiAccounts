export const commonStyles = `
  :root {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --accent: #3b82f6;
    --accent-hover: #2563eb;
    --success: #22c55e;
    --error: #ef4444;
    --card-bg: #1e293b;
    --border-color: #334155;
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    margin: 0;
    padding: 2rem;
    min-height: 100vh;
    line-height: 1.5;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    text-align: center;
    background: linear-gradient(135deg, #60a5fa, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.025em;
  }

  h2 {
    font-size: 1.875rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
  }
  
  .accounts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0;
  }

  input, button {
    font-family: inherit;
  }

  input {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    width: 100%;
    transition: border-color 0.2s ease;
  }

  input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  button {
    cursor: pointer;
    transition: all 0.2s ease;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    body {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .accounts-grid {
      grid-template-columns: 1fr;
    }
  }
`;