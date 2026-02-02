import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1>Unheard V2</h1>
      <p>Electron + Vite + TypeScript + React</p>
      <button
        onClick={() => setCount((count) => count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Count is {count}
      </button>
    </div>
  );
}

export default App;
