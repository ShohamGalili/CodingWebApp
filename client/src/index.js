import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';
import { CodeBlockProvider } from './context/CodeBlockContext';  // Updated context

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CodeBlockProvider>
        <App />
    </CodeBlockProvider>
);