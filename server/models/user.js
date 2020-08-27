const { newId } = require('../utility');

class User {
    constructor({ id, username }) {
        this.id = id;
        this.username = username;
        this.connectionId = null;
        this.audience = [];
        this.streaming = false;
    }

    setConnectionId(connectionId) {
        this.connectionId = connectionId;
    }

    startStreaming() {
        this.streaming = true;
    }

    endStreaming() {
        this.streaming = false;
        this.audience = [];
    }

    addAudience(user) {
        const index = this.audience.findIndex(x => x.id === user.id);
        if (index === -1) {
            this.audience.push(user);
        }
    }

    removeAudience(user) {
        const index = this.audience.findIndex(x => x.id === user.id);
        if (index !== -1) {
            this.audience.splice(index, 1);
        }
    }
}

module.exports = User;