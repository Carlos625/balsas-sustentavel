const express = require('express');
const router = express.Router();
const { registro, login, getMe } = require('../controllers/authController');
const { proteger } = require('../middlewares/auth');

router.post('/registro', registro);
router.post('/login', login);
router.get('/me', proteger, getMe);

module.exports = router;
