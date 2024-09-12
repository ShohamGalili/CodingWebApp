import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import { socket } from '../services/socketService';
import { Box, Button, Grid, Typography, Container, Paper, Alert, AlertTitle } from '@mui/material';
import { List, ListItem, ListItemText, Avatar, ListItemAvatar } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';

function CodeBlock() {
    const { id } = useParams();  // Get the code block ID from the URL
    const navigate = useNavigate();
    const location = useLocation();
    const [code, setCode] = useState('');  // Holds the current code content
    const [role, setRole] = useState('student');  // User's role in the session
    const [students, setStudents] = useState(0);  // Number of students in the room
    const [solution, setSolution] = useState('// solution code here');  // Holds the correct solution
    const [isSolved, setIsSolved] = useState(false);  // Checks if the problem is solved

    useEffect(() => {
        // Fetch the selected code block data by ID
        fetch(`https://codingwebapp.vercel.app/api/codeblocks`)
        //fetch(`http://localhost:5000/api/codeblocks`)
            .then((response) => response.json())
            .then((data) => {
                const selectedBlock = data.find(block => block.blockId === id);

                if (selectedBlock) {
                    const initialContent = selectedBlock.currentContent || selectedBlock.initialTemplate;
                    setCode(initialContent);  // Set the code editor's initial content
                    setSolution(selectedBlock.solution);  // Set the solution to validate against

                    // Set the document's title to the code block's title
                    document.title = `Code Block - ${selectedBlock.title}`;
                } else {
                    console.error('Block not found');
                    document.title = 'Code Block - Not Found';  // If block is not found
                }
            })
            .catch((error) => console.error('Error fetching code block:', error));

        // Join the code block room via socket
        socket.emit('joinCodeBlock', id);

        // Listen for role assignment
        socket.on('role', (assignedRole) => {
            setRole(assignedRole);
        });

        // Listen for code updates from other users in the session
        socket.on('codeUpdate', (updatedCode) => {
            setCode(updatedCode);
        });

        // Track the number of students in the session
        socket.on('studentCount', (count) => {
            setStudents(count);
        });

        // Handle mentor leaving the session
        socket.on('mentorLeft', () => {
            navigate('/lobby');
        });

        // Cleanup when leaving the code block
        return () => {
            socket.emit('leaveCodeBlock', id);  // Leave the room on component unmount
        };
    }, [id, navigate]);


    // Handle code changes and emit updated code to others
    const handleCodeChange = (newCode) => {
        setCode(newCode);
        socket.emit('codeUpdate', newCode);

        // Check if the code matches the solution
        if (newCode.trim() === solution.trim()) {
            setIsSolved(true);
        } else {
            setIsSolved(false);
        }
    };

    return (
        <Box sx={{ p: 2, Height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Container maxWidth="xl">

                {/* Success Message */}
                {isSolved && (
                    <Alert severity="success" sx={{ mb: 4 }}>
                        <AlertTitle>Success</AlertTitle>
                        Champion! Correct solution! 😊
                    </Alert>
                )}

                {/* Title Section */}
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="h4"
                        align="left"
                        gutterBottom
                        sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            fontSize: '2.5rem',
                            textAlign: 'left',
                        }}
                    >
                        Code Block {id} - {location.state?.title || 'Unknown Title'}
                    </Typography>

                    {/* Subtitle for Students */}
                    {role === 'student' && (
                        <Typography
                            variant="h6"
                            align="left"
                            sx={{
                                fontFamily: 'monospace',
                                color: '#888',
                                fontWeight: 400,
                                fontSize: '1.2rem',
                                marginTop: '10px',
                                marginBottom: '0px',
                            }}
                        >
                            Please implement the solution in the code editor below.
                        </Typography>
                    )}
                </Box>

                <Grid container spacing={4} alignItems="flex-start">
                    {/* Code Editor Section */}
                    <Grid item xs={12} md={8}>
                        <Box sx={{ mb: 4, position: 'relative' }}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 0.5,
                                    backgroundColor: '#2b2b2b',
                                    borderRadius: '8px',
                                }}
                            >
                                {isSolved && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            fontSize: '150px',
                                            zIndex: 10,
                                            color: 'rgba(255, 255, 255, 0.7)',
                                        }}
                                    >
                                        😊
                                    </Box>
                                )}

                                <CodeEditor
                                    code={code}
                                    onChange={handleCodeChange}
                                    readOnly={role === 'mentor'}
                                    sx={{
                                        minHeight: '300px',
                                        backgroundColor: '#2b2b2b',
                                        color: 'white',
                                        borderRadius: '8px',
                                        p: 1,
                                        fontFamily: 'monospace',
                                    }}
                                />
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Right-Side Info Section */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: '10px',
                                backgroundColor: '#f5f5f5',
                            }}
                        >
                            <List sx={{ width: '100%' }}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <GroupIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Students in Room" secondary={students} />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <WorkIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Role" secondary={role} />
                                </ListItem>
                                {role === 'mentor' && (
                                    <ListItem>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            sx={{
                                                mt: 1,
                                                py: 1,
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                            }}
                                            onClick={() => {
                                                socket.emit('mentorLeaveCodeBlock', id);  // Notify server when mentor leaves
                                                navigate('/lobby');
                                            }}
                                        >
                                            Leave Code Block
                                        </Button>
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default CodeBlock;
