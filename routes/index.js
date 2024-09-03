const express = require('express');
const roleRoutes = require("./role");
const userRoutes = require("./users");
const { authMiddleware } = require('../unit/authMiddleware');

const router = express.Router();


router.use('/role',authMiddleware ,roleRoutes);
router.use('/users',userRoutes);

module.exports = router;