const codeBlockUsers = {};  // Store users in each code block (code block ID => list of users)

function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log(`A user connected: ${socket.id}`);

        // Handle user joining a code block
        socket.on('joinCodeBlock', (blockId) => {
            console.log(`User ${socket.id} is trying to join code block ${blockId}`);

            if (!codeBlockUsers[blockId]) {
                codeBlockUsers[blockId] = [];
            }

            // Assign role: first user = mentor, subsequent users = students
            let role = 'student';  // Default to student
            if (codeBlockUsers[blockId].length === 0) {
                role = 'mentor';  // First user becomes mentor
                console.log(`User ${socket.id} is the first in the block and is assigned as mentor`);
            } else {
                console.log(`User ${socket.id} is assigned as a student`);
            }

            codeBlockUsers[blockId].push({ socketId: socket.id, role });

            // Join the code block room
            socket.join(blockId);

            // Send the role to the user
            socket.emit('role', role);

            // Emit only the student count (excluding the mentor)
            const studentCount = codeBlockUsers[blockId].filter(user => user.role === 'student').length;
            io.to(blockId).emit('studentCount', studentCount);

            // Handle real-time code updates
            socket.on('codeUpdate', (newCode) => {
                io.to(blockId).emit('codeUpdate', newCode);  // Broadcast the updated code to all users in the block
            });

            // Handle user disconnection
            socket.on('disconnect', () => {
                console.log(`User ${socket.id} disconnected from block ${blockId}`);

                // Remove user from the code block
                codeBlockUsers[blockId] = codeBlockUsers[blockId].filter(user => user.socketId !== socket.id);

                // If the mentor leaves, reset the code block and notify students
                if (role === 'mentor') {
                    console.log(`Mentor ${socket.id} left the code block`);
                    io.to(blockId).emit('mentorLeft');  // Notify all students the mentor has left
                    codeBlockUsers[blockId] = [];  // Clear the code block for new users
                }

                // Update student count for everyone in the block
                io.to(blockId).emit('studentCount', codeBlockUsers[blockId].length);
            });
        });
    });
}

module.exports = { setupSocketHandlers };
