const { isNullOrUndefined, newId } = require('../utility');
const User = require('../models/user');
const { COMMANDS } = require('../constants');

class Manager {

    constructor({ userRepository, io }) {
        this.userRepository = userRepository;
        this.io = io;
    }

    submitConnectionId({ userId, connectionId }) {
        const user = this.userRepository.find(userId);
        if (isNullOrUndefined(user)) {
            // TOOD ?
            return;
        }

        user.setConnectionId(connectionId);
    }

    signOut(id) {
        const user = this.userRepository.find(id);
        if (isNullOrUndefined(user)) {
            // TODO ?
            return;
        }

        this.endStream(id);
        this.userRepository.delete(id);
    }

    startStream({ userId, socket }) {
        const user = this.userRepository.find(userId);
        if (isNullOrUndefined(user)) {
            // TODO ?
            return;
        }

        user.startStreaming();
        socket.broadcast.emit(COMMANDS.START_STREAM, { userId, username: user.username });
    }

    userJoinToStream({ userId, streamId }) {
        const user = this.userRepository.find(userId);
        if (isNullOrUndefined(user)) {
            // TODO ?
            return;
        }

        const publisher = this.userRepository.find(streamId);
        if (isNullOrUndefined(publisher)) {
            // TODO ?
            return;
        }

        publisher.addAudience(user);
        this.io.to(publisher.connectionId).emit(COMMANDS.JOIN, { userId, username: user.username });
    }

    userLeavesStream({ userId, streamId }) {
        const user = this.userRepository.find(userId);
        if (isNullOrUndefined(user)) {
            // TODO ?
            return;
        }

        const publisher = this.userRepository.find(streamId);
        if (isNullOrUndefined(publisher)) {
            // TODO ?
            return;
        }

        publisher.removeAudience(user);
        this.io.to(publisher.connectionId).emit(COMMANDS.LEAVE, { userId, username: user.username });
    }

    endStream({ userId, socket }) {
        const user = this.userRepository.find(userId);
        if (isNullOrUndefined(user)) {
            // TODO ?
            return;
        }

        socket.broadcast.emit(COMMANDS.END_STREAM, { userId: user.id, username: user.username });

        user.endStreaming();
    }
}

module.exports = Manager;