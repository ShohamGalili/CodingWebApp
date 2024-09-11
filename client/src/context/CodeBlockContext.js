import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';  // Ensure this is your correct API handler

// Create the context
const CodeBlockContext = createContext();

// Create the provider component
const CodeBlockProvider = ({ children }) => {
    const [codeBlocks, setCodeBlocks] = useState([]); // Stores all code blocks
    const [selectedCodeBlock, setSelectedCodeBlock] = useState(null); // Stores the selected block

    // Fetch all code blocks from the API
    const getCodeBlocks = async () => {
        try {
            const response = await api.get('/codeblocks');  // Make sure the endpoint is correct
            setCodeBlocks(response.data); // Set the fetched code blocks
        } catch (error) {
            console.error('Error fetching code blocks:', error); // Log any errors
        }
    };

    // Select a specific code block by ID
    const selectCodeBlock = (id) => {
        const block = codeBlocks.find(block => block.blockId === id); // Ensure you use `blockId` instead of `id` if that's your field
        setSelectedCodeBlock(block); // Set the selected block
    };

    // Fetch code blocks when the component is mounted
    useEffect(() => {
        getCodeBlocks();  // Call the function to fetch blocks when the provider mounts
    }, []); // The empty dependency array ensures this runs once on mount

    return (
        <CodeBlockContext.Provider value={{ codeBlocks, selectedCodeBlock, selectCodeBlock }}>
            {children} {/* Render children components */}
        </CodeBlockContext.Provider>
    );
};

// Export the context and the provider
export { CodeBlockContext, CodeBlockProvider };
