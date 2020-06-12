const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../modal/User');

module.exports.getLogin = (req, res, next) => {
    res.render('login', {
        errorMessage: null,
        oldInput: { email: '', password: '' }
    });
}

module.exports.getRegister = (req, res, next) => {
    res.render('register', {
        errorMessage: null,
        oldInput: { email: '', name: '', password: '', pass: '' }
    });
}

module.exports.postRegister = async(req, res, next) => {
    try {
        const { password, pass, email, name } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('register', {
                errorMessage: errors.array()[0].msg,
                oldInput: { email: email, name: name, password: password, pass: pass },
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

module.exports.postLogin = (req, res, next) => {
    const { password, email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('login', {
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, password: password, },
        });
    }
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
};

module.exports.getDashboard = (req, res, next) => {
    res.render('dashboard');
}