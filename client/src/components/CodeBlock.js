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
        // Fetch the code block data, including currentContent and initialTemplate
        fetch(`/api/codeblocks/${id}`)
            .then((response) => response.json())
            .then((data) => {
                const initialContent = data.currentContent || data.initialTemplate;
                console.log('Fetched initial content:', initialContent);
                setCode(initialContent);  // Set either currentContent or initialTemplate
                setSolution(data.solution);
            })
            .catch((error) => console.error('Error fetching code block:', error));

        // Join the socket room for real-time updates
        socket.emit('joinCodeBlock', id);

        // Listen for the role assignment from the server
        socket.on('role', (assignedRole) => {
            setRole(assignedRole);
        });

        // Listen for code updates from other students/mentors
        socket.on('codeUpdate', (updatedCode) => {
            setCode(updatedCode);  // Update the code in real-time
        });

        // Listen for student count updates
        socket.on('studentCount', (count) => {
            setStudents(count);
        });

        // Handle mentor leaving the room
        socket.on('mentorLeft', () => {
            navigate('/lobby');
        });

        return () => {
            socket.emit('leaveCodeBlock', id);
        };
    }, [id, navigate]);


    const handleCodeChange = (newCode) => {
        setCode(newCode);
        socket.emit('codeUpdate', newCode);

        // Check if the code matches the solution
        if (newCode.trim() === solution.trim()) {
            setIsSolved(true);  // Show the smiley face if the solution is correct
        } else {
            setIsSolved(false); // Reset the smiley face if the code is incorrect
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