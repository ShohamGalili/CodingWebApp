import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Lobby.css';

const codeBlocks = [
    { id: 1, title: 'Async case' },
    { id: 2, title: 'Promise example' },
    { id: 3, title: 'Closures' },
    { id: 4, title: 'Event Loop' }
];

function Lobby() {
    const navigate = useNavigate();

    // Set the document title when the Lobby component is rendered
    useEffect(() => {
        document.title = 'Lobby - Coding Web App';  // Set the title to "Lobby"
    }, []);

    const handleCodeBlockClick = (id, title) => {
        navigate(`/codeblock/${id}`, { state: { title } });  // Pass title via state
    };

    return (
        <div className="lobby-container">
            <h1 className="lobby-title">Choose a Code Block</h1>
            <div className="code-blocks">
                {codeBlocks.map(block => (
                    <button
                        key={block.id}
                        className="code-block-button"
                        onClick={() => handleCodeBlockClick(block.id, block.title)}  // Pass title here
                    >
                        {block.title}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Lobby;
