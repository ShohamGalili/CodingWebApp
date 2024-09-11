import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';
import { CodeBlockProvider } from './context/CodeBlockContext';  // Context provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // Wrap the App with CodeBlockProvider to give access to the context
    <CodeBlockProvider>
        <App />
    </CodeBlockProvider>
);
