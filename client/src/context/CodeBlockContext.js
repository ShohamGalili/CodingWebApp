import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';  // Ensure this API handles code blocks

const CodeBlockContext = createContext();

const CodeBlockProvider = ({ children }) => {
    const [codeBlocks, setCodeBlocks] = useState([]);
    const [selectedCodeBlock, setSelectedCodeBlock] = useState(null);

    const getCodeBlocks = async () => {
        try {
            const response = await api.get('/codeBlocks');  // Fetch all code blocks
            setCodeBlocks(response.data);
        } catch (error) {
            console.error('Error fetching code blocks:', error);
        }
    };

    const selectCodeBlock = (id) => {
        const block = codeBlocks.find(block => block.id === id);
        setSelectedCodeBlock(block);
    };

    useEffect(() => {
        getCodeBlocks();  // Fetch code blocks when the component is mounted
    }, []);

    return (
        <CodeBlockContext.Provider value={{ codeBlocks, selectedCodeBlock, selectCodeBlock }}>
            {children}
        </CodeBlockContext.Provider>
    );
};

export { CodeBlockContext, CodeBlockProvider };
