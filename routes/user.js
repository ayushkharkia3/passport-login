const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const User = require('../modal/User');
const userController = require('../controller/user');
const isAuth = require('../config/auth');

router.get('/login', userController.getLogin);

router.get('/register', userController.getRegister);

router.post('/register', [body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
    return User.findOne({ email: value })
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email already exists');
            }
        })
}).normalizeEmail(), body('password', 'Password should be alphanumeric with minimum 6 characters').isLength({ min: 6 }).isAlphanumeric().trim(), body('pass').trim().custom((value, { req }) => {
    if (value != req.body.password) {
        throw new Error('Passwords have to match!');
    }
    return true;
})], userController.postRegister);

router.post('/login', [body('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(), body('password', 'Password should be alphanumeric with minimum 6 characters').isLength({ min: 6 }).isAlphanumeric().trim()], userController.postLogin);

router.get('/', isAuth, userController.getDashboard);
module.exports = router;