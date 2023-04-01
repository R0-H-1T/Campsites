// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const catchAsync = require('../utils/catchAsync');
// const User = require('../models/user');

const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

const users = require('../controllers/users');


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post( passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.login);


router.route('/yourcamp')
    .get(users.yourcampgrounds)

router.route('/profile')
    .get(users.showProfile)
    .put(catchAsync(users.updateProfile))

router.get('/logout', users.logout);


module.exports = router;