const { isNullOrUndefined } = require('../utility');

class UserRepository {
    constructor() {
        this.users = [];
    }

    add(user) {
        if (isNullOrUndefined(user.id)) {
            console.log('Argument null exception. No user was added.');
            return;
        }

        if (this.findIndex(user.id) !== -1) {
            // Something bad happend.
            console.log(`Duplicate user id found. id = ${user.id}`)
            return;
        }
        this.users.push(user);
    }

    delete(id) {
        const index = this.findIndex(id);
        if (index !== -1) {
            this.users.splice(index, 1);
        }
    }

    find(id) {
        return this.users.find(x => x.id === id);
    }

    select(username) {
        return this.users.find(x => x.username === username);
    }

    findIndex(id) {
        return this.users.findIndex(x => x.id === id);
    }

    getOnlineUsers() {
        return this.users.filter(x => x.streaming);
    }
}

module.exports = new UserRepository();