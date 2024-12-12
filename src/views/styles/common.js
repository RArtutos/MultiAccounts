export const commonStyles = `
  :root {
    --bg-primary: #1a1b1e;
    --bg-secondary: #2c2d31;
    --text-primary: #ffffff;
    --text-secondary: #a1a1aa;
    --accent: #3b82f6;
    --success: #22c55e;
    --error: #ef4444;
    --card-bg: #2c2d31;
  }
  
  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    margin: 0;
    padding: 2rem;
    min-height: 100vh;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    text-align: center;
    background: linear-gradient(to right, var(--accent), #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .accounts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
  }
`;