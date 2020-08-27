module.exports = function (server, repository) {

    const io = require('socket.io')(server);
    const { onlineUsers } = repository;

    io.on('connection', socket => {

        console.log('A client just joined on', socket.id);

        socket.on('online', username => {
            console.log(`${username} is online`);

            const index = onlineUsers.findIndex(x => x.username === username);
            if (index === -1) {
                onlineUsers.push({ username, streaming: false, socketId: socket.id, audience: [] });
            }
        });

        socket.on('offline', username => {
            console.log(`${username} is offline`);
            const index = onlineUsers.findIndex(x => x.username === username);
            if (index !== -1) {
                onlineUsers.splice(index, 1);
                console.log(`${username} was deleted. current users count = ${onlineUsers.length}`);
            }
        })

        socket.on('start', username => {
            console.log(`${username} start stream`);
            const user = onlineUsers.find(x => x.username === username);
            if (user) {
                user.streaming = true;
            }
            socket.broadcast.emit('stream-started', username);
        });

        socket.on('join', ({ username, targetUsername }) => {
            const user = onlineUsers.find(x => x.username === targetUsername);
            if (user) {
                io.to(user.socketId).emit('join', username);
            }
        });

        socket.on('leave', ({ username, targetUsername }) => {
            console.log(`leave signal... username: ${username} targetUsername: ${targetUsername}`)
            const user = onlineUsers.find(x => x.username === targetUsername);
            if (user) {
                io.to(user.socketId).emit('leave', username);
            }
        });

        socket.on('stop', username => {
            console.log(`${username} stop stream`);
            const user = onlineUsers.find(x => x.username === username);
            if (user) {
                user.streaming = false;
            }
            socket.broadcast.emit('stream-stopped', username);
        });

    });
}