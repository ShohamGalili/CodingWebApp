import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Lobby from './components/Lobby';
import CodeBlock from './components/CodeBlock';
import { Typography, AppBar, Toolbar, Button, Box, Container, Switch } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';


function App() {
    const [showBackground, setShowBackground] = useState(true); // State to toggle background visibility

    return (
        <BrowserRouter>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
                {/* Background image */}
                {showBackground && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100vh',
                            backgroundImage: 'url("/back_pic/tech_pic.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            zIndex: -1,
                            opacity: 0.6,
                        }}
                    />
                )}

                {/* Top Toolbar */}
                <AppBar position="static" sx={{ backgroundColor: '#6cbfd8' }}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <TerminalIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'white' }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component={Link}
                                to="/"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'white',
                                    textDecoration: 'none',
                                }}
                            >
                                Coding Web App
                            </Typography>

                            <Box sx={{ flexGrow: 1 }} />

                            {/* Toggle Background Button */}
                            <Switch
                                checked={showBackground}
                                onChange={() => setShowBackground(!showBackground)}
                                color="default"
                                inputProps={{ 'aria-label': 'toggle background' }}
                            />

                            <Button
                                component={Link}
                                to="/lobby"
                                variant="outlined"
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    borderColor: 'white',
                                    display: 'block',
                                }}
                            >
                                Lobby
                            </Button>
                        </Toolbar>
                    </Container>
                </AppBar>

                {/* Main content with routing */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255, 255, 255, 0)' }}>
                    <Routes>
                        <Route path="/" element={<Lobby />} />
                        <Route path="/lobby" element={<Lobby />} />
                        <Route path="/codeblock/:id" element={<CodeBlock />} />
                    </Routes>
                </Box>

                {/* Bottom Toolbar */}
                <AppBar
                    position="fixed"
                    sx={{
                        top: 'auto',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#6cbfd8',
                        width: '100%',
                        boxSizing: 'border-box',
                        zIndex: 1,
                    }}
                >
                    <Toolbar
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '0.3px 0', // Reduce padding for a slimmer bottom bar
                            minHeight: '40px', // Set a minimum height for the bottom bar
                        }}
                    >
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            &copy; 2024 Coding Web App
                        </Typography>
                    </Toolbar>
                </AppBar>

            </Box>
        </BrowserRouter>
    );
}

export default App;
