const express = require('express');

const authController = require('../controllers/auth');
const { check, body } = require('express-validator/check');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post(
    '/login',
    [
        body('email', 'Invalide email or password')
            .isEmail(),
        body('password', 'Invalide email or password')
            .isLength({ min: 3 })
            .isAlphanumeric()
    ],
    authController.postLogin
);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    [
        check('email', 'Please enter a valide email')
            .isEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email exists already.');
                    }
                });
            })
            .normalizeEmail(),
        body('password', 'Please enter a valide password')
            .isLength({ min: 3 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Please match the password');
                }
                return true;
            })
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;