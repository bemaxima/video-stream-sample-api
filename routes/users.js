const express = require('express');
const router = express.Router();

function setup(service) {
    router.post('/isAvailable', (req, res) => {
        const response = service.isUsernameAvailable(req.body.username);
        res.json(response);
    });

    router.post('/getAllUsers', (req, res) => {
        const response = service.getAllUsers();
        return res.json(response);
    })

    return router;
}

module.exports = setup;
