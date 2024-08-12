const express = require('express');
const { register, login, logout, getUser } = require('../controllers/authController');
const router = express.Router();

router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));
router.get('/dashboard', getUser);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
