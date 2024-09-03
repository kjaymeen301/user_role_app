const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user');
const Role = require('./models/role');
const bcrypt = require('bcryptjs');

const createSuperadmin = async () => {
    try {
        let superadminRole = await Role.findOne({ roleName: 'superadmin' });
        if (!superadminRole) {
            superadminRole = await Role.create({
                roleName: 'superadmin',
                accessModules: ['all'],
                active: true
            });
        }

        const superadminUser = await User.findOne({ username: 'superadmin' });
        if (!superadminUser) {
            await User.create({
                username: 'superadmin',
                firstName: 'Super',
                lastName: 'Admin',
                email: 'superadmin@example.com',
                password: await bcrypt.hash('superadminpassword', 12),
                role: superadminRole._id
            });
            console.log('Superadmin user created.');
        } else {
            console.log('Superadmin user already exists.');
        }
    } catch (err) {
        console.error('Error creating superadmin:', err);
    }
};

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        createSuperadmin();
    })
    .catch(err => console.log(err));
