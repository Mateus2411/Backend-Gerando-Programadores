const express = require('express');
const router = express.Router();
const { register, login, usersDb, tokenValidate, coffee } = require('../controllers/authControllers');

router.post('/register', register);
router.post('/login', login);
router.post('/validate', tokenValidate);
router.get('/validate', tokenValidate); // Valida token via GET
router.get('/banco', usersDb);
router.get('/coffee', coffee);

module.exports = router;
