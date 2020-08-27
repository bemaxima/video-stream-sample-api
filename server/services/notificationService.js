const socketIo = require('socket.io')
const Manager = require('./manager');
const userRepository = require('../repositories/userRepository');

module.exports = function (server) {
    const io = socketIo(server);

    const service = new Manager({
        userRepository,
        io
    });

    io.on('connection', socket => {

        socket.on('online', userId => {
            console.log(`userId ${userId} is online. socketId: ${socket.id}`);

            service.submitConnectionId({
                userId,
                connectionId: socket.id
            });
        });

        socket.on('offline', userId => {
            console.log(`userId ${userId} is offline. socketId: ${socket.id}`);
            service.signOut(userId);
        });

        socket.on('start', userId => {
            console.log(`userId ${userId} is start streaming. socketId: ${socket.id}`);
            service.startStream({ userId, socket });
        });

        socket.on('join', ({ userId, streamId }) => {
            console.log(`userId ${userId} joins to stream = ${streamId}. socketId: ${socket.id}`);
            service.userJoinToStream({
                userId,
                streamId
            });
        });

        socket.on('leave', ({ userId, streamId }) => {
            console.log(`userId ${userId} leave stream = ${streamId}. socketId: ${socket.id}`);
            service.userLeavesStream({
                userId,
                streamId
            });
        });

        socket.on('stop', userId => {
            console.log(`userId ${userId} ends stream. socketId: ${socket.id}`);
            service.endStream({ userId, socket });
        });
    });
}