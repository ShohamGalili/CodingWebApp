import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import '../styles/CodeEditor.css';  // Import your custom styles

function CodeEditor({ code, onChange, readOnly }) {
    return (
        <div className="editorContainer">
            {/* Only one CodeMirror editor */}
            <CodeMirror
                value={code}
                options={{
                    mode: 'javascript',
                    theme: 'default',
                    lineNumbers: true,
                    readOnly: readOnly,
                    direction: 'ltr'
                }}
                onBeforeChange={(editor, data, value) => {
                    if (!readOnly) onChange(value);
                }}
            />
        </div>
    );
}

export default CodeEditor;
