import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/AddCodeBlock.css';  // Regular CSS import

function AddCodeBlock() {
    const [title, setTitle] = useState('');
    const [initialTemplate, setInitialTemplate] = useState('');
    const [solution, setSolution] = useState('');
    const navigate = useNavigate();  // Initialize useNavigate

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newCodeBlock = {
            title,
            initialTemplate,
            solution
        };

        try {
            const response = await fetch('/api/codeblocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCodeBlock)
            });

            if (response.ok) {
                navigate('/lobby');
            } else {
                console.error('Failed to add code block');
            }
        } catch (error) {
            console.error('Error adding code block:', error);
        }
    };

    return (
        <div className="container">  {/* Use className for regular CSS */}
            <h1>Add New Code Block</h1>
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <label>Initial Template:</label>
                <textarea
                    value={initialTemplate}
                    onChange={(e) => setInitialTemplate(e.target.value)}
                    required
                />
                <label>Solution:</label>
                <textarea
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    required
                />
                <button type="submit" className="submitButton">Add Code Block</button> {/* Use className */}
            </form>
        </div>
    );
}

export default AddCodeBlock;
