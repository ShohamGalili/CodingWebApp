import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import StudentCounter from './StudentCounter';
import SmileyFace from './SmileyFace';
import { socket } from '../services/socketService';

function CodeBlock() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [code, setCode] = useState('');
    const [role, setRole] = useState('student');
    const [students, setStudents] = useState(0);
    const [solution, setSolution] = useState('// solution code here');
    const [isSolved, setIsSolved] = useState(false);

    useEffect(() => {
        socket.emit('joinCodeBlock', id);

        // Update the document title based on the code block title
        document.title = `Code Block ${id} - ${location.state?.title || 'Unknown Title'}`;

        socket.on('role', (role) => {
            setRole(role);
        });

        // Update the code editor when a new code update is received
        socket.on('codeUpdate', (newCode) => {
            setCode(newCode);
        });

        socket.on('studentCount', (count) => {
            setStudents(count);
        });

        // Listen for the mentorLeft event and redirect to the lobby
        socket.on('mentorLeft', () => {
            console.log('Mentor left the code block, redirecting to the lobby...');
            setCode('');  // Clear the code
            navigate('/lobby');  // Redirect to the lobby page
        });

        // Clean up when the component unmounts or the user navigates away
        return () => {
            // Emit mentorLeft if the user is a mentor and leaving the page
            if (role === 'mentor') {
                socket.emit('mentorLeft', id);  // Notify server that mentor is leaving the code block
            }
            socket.emit('leaveCodeBlock', id);
        };
    }, [id, navigate]);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        socket.emit('codeUpdate', newCode);
        if (newCode === solution) {
            setIsSolved(true);
        }
    };

    return (
        <div>
            <h1 style={{marginTop: '0x'}}>Code Block {id} - {location.state?.title || 'Unknown Title'}</h1>
            <h3 style={{marginTop: '10px'}}>Role: {role}</h3>
            <StudentCounter count={students}/>
            <CodeEditor code={code} onChange={handleCodeChange} readOnly={role === 'mentor'}/>
            {isSolved && <SmileyFace/>}
        </div>

    );
}

export default CodeBlock;
