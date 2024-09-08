import React, { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import StudentCounter from './StudentCounter';
import SmileyFace from './SmileyFace';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { socket } from '../services/socketService';

function CodeBlock() {
    const { id } = useParams();
    const location = useLocation();  // Get location object
    const [code, setCode] = useState('');
    const [role, setRole] = useState('student');
    const [students, setStudents] = useState(0);
    const [solution, setSolution] = useState('// solution code here');
    const [isSolved, setIsSolved] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Join the code block
        socket.emit('joinCodeBlock', id);

        // Listen for the assigned role from the server
        socket.on('role', (assignedRole) => {
            setRole(assignedRole);  // Set the role to either 'mentor' or 'student'
        });

        // Listen for code updates
        socket.on('codeUpdate', (newCode) => {
            setCode(newCode);
        });

        // Listen for student count updates
        socket.on('studentCount', (count) => {
            setStudents(count);
        });

        // If the mentor leaves, navigate back to the lobby
        socket.on('mentorLeft', () => {
            navigate('/');
        });

        return () => {
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
            <h1>Code Block {id} - {location.state?.title || 'Unknown Title'}</h1>
            <h3>Role: {role === 'mentor' ? 'Mentor' : 'Student'}</h3>  {/* Show user role */}
            <StudentCounter count={students} />
            <CodeEditor code={code} onChange={handleCodeChange} readOnly={role === 'mentor'} />
            {isSolved && <SmileyFace />}
        </div>
    );
}

export default CodeBlock;
