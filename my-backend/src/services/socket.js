// src/services/socket.js

const socketIo = require('socket.io');
const LiveChatSession = require('../models/LiveChatSession'); // Import the LiveChatSession model

let io; // This variable will hold our Socket.IO server instance

// Function to initialize the Socket.IO server
const initSocket = (httpServer) => {
    // Initialize Socket.IO with CORS options
    // Allows connections from your frontend (http://localhost:3000)
    io = socketIo(httpServer, {
        cors: {
            origin: "http://localhost:3000", // Allow connections from your React frontend
            methods: ["GET", "POST"] // Allowed HTTP methods for CORS
        }
    });

    // Event listener for new client connections
    io.on('connection', (socket) => {
        console.log(`[Socket.IO] User connected: ${socket.id}`);

        // Event for users/admins to join a specific chat session room
        // Rooms are used to send messages only to relevant participants
        socket.on('joinRoom', async ({ sessionId, userId, userType }) => {
            socket.join(sessionId); // Add the socket to the specified room
            console.log(`[Socket.IO] ${userType} ${userId} joined room: ${sessionId}`);

            // Update session status if an admin joins a pending chat
            if (userType === 'admin') {
                try {
                    const session = await LiveChatSession.findById(sessionId);
                    if (session && session.status === 'pending') {
                        session.status = 'active';
                        session.adminId = userId; // Assign admin to the session
                        await session.save();
                        // Notify the user in that room that an admin has joined
                        io.to(sessionId).emit('sessionTaken', { sessionId, adminId: userId });
                        console.log(`[Socket.IO] Admin ${userId} took session ${sessionId}. Status: Active.`);
                        // Notify all other admins about the status change
                        // Use socket.broadcast.emit to exclude the sender
                        socket.broadcast.emit('sessionStatusUpdate', { sessionId, status: 'active', adminId: userId });
                    }
                } catch (error) {
                    console.error(`[Socket.IO Error] Failed to update session status on joinRoom: ${error.message}`);
                }
            }
        });

        // Event for sending chat messages within a room
        socket.on('sendMessage', async ({ sessionId, sender, message }) => {
            console.log(`[Socket.IO] Message in room ${sessionId} from ${sender}: ${message.substring(0, 50)}...`);
            try {
                // Find the session and add the new message
                const session = await LiveChatSession.findById(sessionId);
                if (session) {
                    const newMessage = { sender, message, timestamp: new Date() };
                    session.liveChatMessages.push(newMessage);
                    await session.save(); // Save the new message to DB
                    // Emit the message to everyone in that session's room *including the sender*
                    // This ensures the sender also receives their own message via the socket listener,
                    // preventing client-side duplication and ensuring consistency.
                    io.to(sessionId).emit('receiveMessage', newMessage);
                }
            } catch (error) {
                console.error(`[Socket.IO Error] Failed to save/send message: ${error.message}`);
            }
        });

        // Event for an admin to explicitly take a pending session
        socket.on('takeSession', async ({ sessionId, adminId }) => {
            try {
                const session = await LiveChatSession.findById(sessionId);
                if (session && session.status === 'pending') {
                    session.status = 'active';
                    session.adminId = adminId;
                    await session.save();
                    io.to(sessionId).emit('sessionTaken', { sessionId, adminId }); // Notify user in session
                    socket.broadcast.emit('sessionStatusUpdate', { sessionId, status: 'active', adminId }); // Notify all other admins
                    console.log(`[Socket.IO] Admin ${adminId} explicitly took session ${sessionId}. Status: Active.`);
                }
            } catch (error) {
                console.error(`[Socket.IO Error] Failed to take session: ${error.message}`);
            }
        });

        // Event to end a live chat session
        socket.on('endSession', async ({ sessionId, endedBy }) => {
            console.log(`[Socket.IO] Session ${sessionId} ended by ${endedBy}`);
            try {
                const session = await LiveChatSession.findById(sessionId);
                if (session && session.status !== 'closed') {
                    session.status = 'closed';
                    session.closedAt = new Date();
                    await session.save();
                    io.to(sessionId).emit('sessionEnded', { sessionId, endedBy }); // Notify all in room
                    io.emit('sessionStatusUpdate', { sessionId, status: 'closed' }); // Notify all admins (including sender)
                    io.socketsLeave(sessionId); // Make all sockets leave the room
                    console.log(`[Socket.IO] Session ${sessionId} status set to Closed.`);
                }
            } catch (error) {
                console.error(`[Socket.IO Error] Failed to end session: ${error.message}`);
            }
        });


        // Event for client disconnection
        socket.on('disconnect', () => {
            console.log(`[Socket.IO] User disconnected: ${socket.id}`);
        });
    });
};

// Function to get the Socket.IO instance (for emitting from other parts of the app)
const getIo = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized!');
    }
    return io;
};

module.exports = { initSocket, getIo };