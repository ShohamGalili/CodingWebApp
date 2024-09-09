import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Lobby from './components/Lobby';  // Import Lobby component
import CodeBlock from './components/CodeBlock';  // Import CodeBlock component
import styles from './styles/App.module.css';  // Import styles

function App() {

  return (
      <BrowserRouter>
        <div className={styles.app}>
          <header className={styles.appHeader}>
            <h1 className={styles.appTitle}>Coding Web App</h1>
            <nav className={styles.appNav}>
              <Link to="/lobby" className={styles.appLink}>Lobby</Link>
            </nav>
          </header>
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<Lobby />} /> {/* Set Lobby as the main page */}
              <Route path="/lobby" element={<Lobby />} />  {/* Route to Lobby */}
              <Route path="/codeblock/:id" element={<CodeBlock />} />  {/* Route to individual CodeBlock */}
            </Routes>
          </main>
          <footer className={styles.footer}>
            <p>&copy; 2024 Coding Web App</p>
          </footer>
        </div>
      </BrowserRouter>
  );
}

export default App;
