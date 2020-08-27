var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

function setup(service) {
    router.post('/getOnlineStreams', function (req, res) {
        const r = service.getOnlineUsers();
        res.json(r);
    });

    return router;
}

module.exports = setup;
