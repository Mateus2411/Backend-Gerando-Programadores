const express = require('express');
const router = express.Router();
const { register, login, usersDb, coffee } = require('../controllers/authControllers');

router.post('/register', register);
router.post('/login', login);
router.get('/banco', usersDb);
router.get('/coffee', coffee)

module.exports = router;
