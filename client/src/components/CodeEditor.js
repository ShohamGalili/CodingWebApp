import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';  // Syntax highlighting for JavaScript
import 'codemirror/theme/material.css';  // Material theme for a modern look
import { Box, Paper } from '@mui/material';
import '../styles/CodeEditor.css';  // Custom styles
import { socket } from '../services/socketService';

function CodeEditor({ code, onChange, readOnly }) {
    return (
        <Paper
            elevation={4}  // Shadow for depth
            sx={{
                p: 2,
                backgroundColor: '#2b2b2b',  // Dark background
                borderRadius: '10px',  // Rounded corners
                minHeight: '400px',  // Minimum height for responsiveness
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    height: '100%',
                    overflowY: 'auto',  // Vertical scrolling if content exceeds
                    overflowX: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '10px',
                }}
            >
                <CodeMirror
                    value={code}
                    options={{
                        mode: 'javascript',
                        theme: 'material',
                        lineNumbers: true,  // Show line numbers
                        readOnly: readOnly,  // Make editor read-only for mentors
                        direction: 'ltr',  // Left-to-right text direction
                        scrollbarStyle: 'null',  // Native scrollbar
                    }}
                    onBeforeChange={(editor, data, value) => {
                        if (!readOnly) {
                            onChange(value);  // Update code locally
                            socket.emit('codeUpdate', value);  // Emit code update to the server
                        }
                    }}
                />
            </Box>
        </Paper>
    );
}

export default CodeEditor;
