const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
exports.signup = async (req, res) => {
    try {
        const { username, firstName, lastName, email, password, role } = req.body;
        const checkUsername = await User.findOne({ username });
        if (checkUsername)
            res.status(400).json({ error: "username already exist" });

        const checkEmail = await User.findOne({ email });
        if (checkEmail)
            res.status(400).json({ error: "email already exist" });


        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
        });

        await user.save();
        res.status(201).json({ message: "user create a sucessfully", data: user });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).populate({ path: "role", select: "id roleName accessModules active" });

        if (!user) return res.status(400).json({ error: 'User Not Found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
        delete user.password;
        res.status(200).json({
            message: "Login Successfully", data: {
                id: user.id,
                username: user.username,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                access_token: token,
                role: user.role
            }
        });
    } catch (err) {
        console.log(err);

        res.status(400).json({ error: err.message });
    }
};

// Get Users with Aggregation Pipeline
exports.getUsers = async (req, res) => {
    try {
        const { search } = req.query;

        const pipeline = [
            ...(search ? [{
                $match: {
                    $or: [
                        { username: { $regex: search, $options: 'i' } },
                        { firstName: { $regex: search, $options: 'i' } },
                        { lastName: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } }
                    ]
                }
            }] : []),
            {
                $project: {
                    username: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    role: 1
                }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role'
                }
            },
            { $unwind: { path: '$role', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    username: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    'role.roleName': 1,
                    'role.accessModules': 1
                }
            }
        ];

        const users = await User.aggregate(pipeline);

        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.updateManyUsersDifferent = async (req, res) => {
    try {
        console.log("asdas update");

        const updates = req.body.updates;
        for (const update of updates) {
            const { updateData } = update;

            if (updateData.username || updateData.email) {
                const existingUser = await User.findOne({
                    $or: [
                        { username: updateData.username },
                        { email: updateData.email }
                    ]
                }).exec();

                if (existingUser) {
                    if (existingUser.username !== updateData.username || existingUser.email !== updateData.email) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                }
            }
        }

        await Promise.all(updates.map(async (update) => {
            const { filter, updateData } = update;
            await User.updateMany(filter, updateData);
        }));

        res.status(200).json({ message: 'Users updated successfully' });
    } catch (err) {
        console.log(err);

        res.status(400).json({ error: err.message });
    }
};