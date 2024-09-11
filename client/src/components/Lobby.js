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
        document.title = 'Lobby - Coding Web App';  // Set the title to "Lobby"
    }, []);

    const handleCodeBlockClick = (id, title) => {
        navigate(`/codeblock/${id}`, { state: { title } });  // Pass title via state
    };

    // Helper function to split the welcome message into individual spans for each letter
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
                Height: '100vh',    // Ensure the height is 100% of the viewport
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',  // Ensure content is evenly spaced
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
                    textAlign: 'center',  // Center-align text
                    width: '100%',  // Ensure the welcome message spans the full width
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        fontFamily: 'Fira Code, monospace',  // Change font to a coding font
                        color: '#333',
                        marginBottom: '60px', // Space between the welcome message and code blocks
                        wordWrap: 'break-word',  // Ensure words wrap properly
                        width: '90%',  // Ensure text takes the full width, leaving some padding
                        fontSize: {
                            xs: '1.8rem',  // Smaller font size on extra-small devices
                            sm: '2.5rem',  // Larger font on small devices (tablets)
                            md: '3rem',    // Standard font size for medium devices (desktops)
                            lg: '4rem'     // Larger font size for larger screens
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
                            xs: '1.8rem',  // Smaller on smaller screens
                            sm: '2.5rem',  // Standard font size on small screens
                        },
                        fontFamily: 'Montserrat, sans-serif',  // Change font family
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
                            onClick={() => handleCodeBlockClick(block.id, block.title)}  // Pass title here
                            sx={{
                                marginBottom: '15px',
                                marginRight: '15px',
                                padding: '15px 30px',  // Increase button padding
                                fontSize: '1.2rem',    // Increase font size for buttons
                                fontWeight: 'bold',    // Make the button text bold
                                backgroundColor: '#7493ee',  // Custom background color
                                color: 'white',  // Text color
                                '&:hover': {  // Hover effect
                                    backgroundColor: '#6cbfd8',  // Hover background color
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
