import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';  // JavaScript mode for syntax highlighting
import 'codemirror/theme/material.css';  // Material theme for a modern look
import '../styles/CodeEditor.css';  // Custom styles
import { socket } from '../services/socketService';  // Import the socket instance

function CodeEditor({ code, onChange, readOnly }) {
    return (
        <div className="editorContainer">
            <CodeMirror
                value={code}
                options={{
                    mode: 'javascript',  // Set the language mode (JavaScript)
                    theme: 'material',   // Use the 'material' theme for styling
                    lineNumbers: true,   // Show line numbers
                    readOnly: readOnly,  // Set editor to read-only for mentors
                    direction: 'ltr'     // Ensure left-to-right text direction
                }}

                //code changes will display in real-time
                onBeforeChange={(editor, data, value) => {
                    if (!readOnly) {
                        onChange(value);  // Local update
                        socket.emit('codeUpdate', value);  // Emit the code update to the server
                    }
                }}

                style={{
                    height: 'calc(100vh - 200px)',  // Dynamically set the height of the editor
                    overflowY: 'auto',               // Allow vertical scroll if content exceeds
                    overflowX: 'hidden'              // Hide horizontal scroll
                }}
            />
        </div>
    );
}

export default CodeEditor;