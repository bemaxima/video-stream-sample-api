const { isNullOrUndefined, newId } = require('../utility');
const User = require('../models/user');

class UserService {

    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    isUsernameAvailable(username) {
        const user = this.userRepository.select(username);
        if (!isNullOrUndefined(user)) {
            return {
                isAvailable: false,
                userId: user.id
            };
        }
        else {
            const newUser = new User({
                username,
                id: newId(),
                connectionId: null
            });
            this.userRepository.add(newUser);
            return {
                isAvailable: true,
                userId: newUser.id
            }
        }
    }

    getOnlineUsers() {
        const onlineUsers = this.userRepository.getOnlineUsers();
        return onlineUsers.map(user => ({ userId: user.id, username: user.username }));
    }

    getAllUsers() {
        return this.userRepository.users;
    }
}

module.exports = UserService;