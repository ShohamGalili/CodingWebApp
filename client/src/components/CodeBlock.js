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
        fetch(`http://localhost:5000/api/codeblocks`)
            .then((response) => response.json())
            .then((data) => {
                const selectedBlock = data.find(block => block.blockId === id);

                if (selectedBlock) {
                    const initialContent = selectedBlock.currentContent || selectedBlock.initialTemplate;
                    console.log('Fetched initial content:', initialContent);
                    setCode(initialContent);  // Set either currentContent or initialTemplate
                    setSolution(selectedBlock.solution);  // Set the solution
                } else {
                    console.error('Block not found');
                }
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

        if (newCode.trim() === solution.trim()) {
            setIsSolved(true);  // Show the smiley face if the solution is correct
        } else {
            setIsSolved(false); // Reset the smiley face if the code is incorrect
        }
    };

    const handleMentorLeave = () => {
        socket.emit('mentorLeaveCodeBlock', id);  // Emit the event to the server
        navigate('/lobby');  // Redirect the mentor to the lobby
    };

    return (
        <div>
            <h1 style={{marginTop: '0px'}}>Code Block {id} - {location.state?.title || 'Unknown Title'}</h1>

            {role === 'mentor' && (
                <button
                    onClick={handleMentorLeave}
                    style={{
                        marginTop: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Leave Code Block
                </button>
            )}

            {isSolved && <SmileyFace />}

            <h3 style={{marginTop: '10px'}}>Role: {role}</h3>
            <StudentCounter count={students} />
            <CodeEditor code={code} onChange={handleCodeChange} readOnly={role === 'mentor'} />
        </div>
    );
}

export default CodeBlock;
