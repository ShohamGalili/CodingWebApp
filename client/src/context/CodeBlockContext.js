import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

// Create the context
const CodeBlockContext = createContext();

// Create the provider component
const CodeBlockProvider = ({ children }) => {
    const [codeBlocks, setCodeBlocks] = useState([]); // Stores all code blocks
    const [selectedCodeBlock, setSelectedCodeBlock] = useState(null); // Stores the selected block

    // Fetch all code blocks from the API
    const getCodeBlocks = async () => {
        try {
            const response = await api.get('/codeblocks');
            setCodeBlocks(response.data);
        } catch (error) {
            console.error('Error fetching code blocks:', error);
        }
    };

    // Select a specific code block by ID
    const selectCodeBlock = (id) => {
        const block = codeBlocks.find(block => block.blockId === id); // Use `blockId` to find the block
        setSelectedCodeBlock(block);
    };

    // Fetch code blocks when the component is mounted
    useEffect(() => {
        getCodeBlocks();
    }, []); // Run once on mount

    return (
        <CodeBlockContext.Provider value={{ codeBlocks, selectedCodeBlock, selectCodeBlock }}>
            {children} {/* Render children components */}
        </CodeBlockContext.Provider>
    );
};

// Export the context and the provider
export { CodeBlockContext, CodeBlockProvider };
