import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import '../styles/Lobby.css';  // Add CSS for keyframes if needed

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
        document.title = 'Lobby - Coding Web App';
    }, []);

    // Handle navigation to the selected code block
    const handleCodeBlockClick = (id, title) => {
        navigate(`/codeblock/${id}`, { state: { title } });
    };

    // Render the welcome message letter by letter with animation
    const renderWelcomeMessage = (message) => {
        return message.split('').map((letter, index) => (
            <span key={index} className="letter">
                {letter === ' ' ? '\u00A0' : letter} {/* Replace spaces with non-breaking space */}
            </span>
        ));
    };

    return (
        <Box
            sx={{
                Height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            {/* Welcome Box */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '100px',
                    paddingBottom: '0px',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        fontFamily: 'Fira Code, monospace',
                        color: '#333',
                        marginBottom: '60px',
                        wordWrap: 'break-word',
                        width: '90%',
                        fontSize: {
                            xs: '1.8rem',
                            sm: '2.5rem',
                            md: '3rem',
                            lg: '4rem'
                        },
                    }}
                >
                    {renderWelcomeMessage("Welcome to the coding web")} <br />
                    {renderWelcomeMessage("Enjoy writing code and collaborating!")}
                </Typography>
            </Box>

            {/* Choose Code Block Box */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '240px',
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: {
                            xs: '1.8rem',
                            sm: '2.5rem',
                        },
                        fontFamily: 'Montserrat, sans-serif',
                        marginBottom: '40px',
                    }}
                >
                    Choose a Code Block
                </Typography>

                <Box className="code-blocks" sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {codeBlocks.map(block => (
                        <Button
                            key={block.id}
                            variant="contained"
                            onClick={() => handleCodeBlockClick(block.id, block.title)}
                            sx={{
                                marginBottom: '15px',
                                marginRight: '15px',
                                padding: '15px 30px',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                backgroundColor: '#7493ee',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#6cbfd8',
                                },
                            }}
                        >
                            {block.title}
                        </Button>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default Lobby;
