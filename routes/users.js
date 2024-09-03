const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { signupValidator, loginValidator, updateUserValidator, updateManyUsersDifferentValidator } = require('../validators/userValidator');
const {validate} = require('express-validation');
const { authMiddleware, checkPermission } = require('../unit/authMiddleware');


// Signup
router.post('/signup', validate({ body: signupValidator }), userController.signup);

// Login
router.post('/login', validate({ body: loginValidator }), userController.login);

// Get Users
router.get('/',authMiddleware,userController.getUsers);

// Update Multiple Users with Different Data
router.patch('/update-many', authMiddleware, checkPermission('user', 'write'), validate({ body: updateManyUsersDifferentValidator }), userController.updateManyUsersDifferent);

module.exports = router;
