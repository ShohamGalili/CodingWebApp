import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';  // JavaScript mode for syntax highlighting
import 'codemirror/theme/material.css';  // Material theme for a modern look
import { Box, Paper } from '@mui/material';  // Import MUI Box and Paper components
import '../styles/CodeEditor.css';  // Custom styles
import { socket } from '../services/socketService';  // Import the socket instance

function CodeEditor({ code, onChange, readOnly }) {
    return (
        <Paper
            elevation={4}  // Add shadow for depth
            sx={{
                p: 2,  // Padding around the editor
                backgroundColor: '#2b2b2b',  // Dark background for a modern look
                borderRadius: '10px',  // Rounded corners
                minHeight: '400px',  // Minimum height for responsiveness
                overflow: 'hidden',  // Hide overflow content
            }}
        >
            <Box
                sx={{
                    height: '100%',  // Ensure the editor takes full height of the container
                    overflowY: 'auto',  // Allow vertical scrolling if content exceeds
                    overflowX: 'hidden',  // Hide horizontal scrolling
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '10px',  // Ensure editor itself has rounded corners
                }}
            >
                <CodeMirror
                    value={code}
                    options={{
                        mode: 'javascript',  // Set the language mode (JavaScript)
                        theme: 'material',   // Use the 'material' theme for styling
                        lineNumbers: true,   // Show line numbers
                        readOnly: readOnly,  // Set editor to read-only for mentors
                        direction: 'ltr',    // Ensure left-to-right text direction
                        scrollbarStyle: 'null',  // Use native scrollbars for better performance
                    }}
                    onBeforeChange={(editor, data, value) => {
                        if (!readOnly) {
                            onChange(value);  // Local update
                            socket.emit('codeUpdate', value);  // Emit the code update to the server
                        }
                    }}
                />
            </Box>
        </Paper>
    );
}

export default CodeEditor;
