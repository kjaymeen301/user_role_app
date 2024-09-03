const Role = require('../models/role');
const User = require('../models/user');

// Middleware to check if the user is a superadmin
const isSuperadmin = async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('role');

    if (!user || user.role.roleName !== 'superadmin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

// Create a new role (only accessible by superadmin)
exports.createRole = [isSuperadmin, async (req, res) => {
    try {
        
        const checkRoleName = await Role.findOne({roleName : req.body.roleName});
        
        if(checkRoleName){
            return res.status(401).json({error : "Role Name Already Exist"})
        }
        console.log("asdas");

        const role = await Role.create(req.body);
        res.status(201).json({ message:"Role Create Successfully", data: role});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}];

// Get all roles
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.aggregate([
            { $match: {} },
            { $project: { roleName: 1, accessModules: 1, createdAt: 1, active: 1 } }
        ]);
        res.status(200).json(roles);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update a role
exports.updateRole = [isSuperadmin, async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findById(id);
        if(!role){
            return res.status(401).json({error : "Please Enter valid record"})
        }
        
        const checkRoleName = await Role.findOne({roleName : req.body.roleName, id: { $ne: id }});
        if(checkRoleName){
            return res.status(401).json({error : "Role name already exist"});
        }

        const updatedRole = await Role.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRole) return res.status(404).json({ error: 'Role not found' });
        res.status(200).json(updatedRole);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}];

// Delete a role
exports.deleteRole = [isSuperadmin, async (req, res) => {
    try {
        const { id } = req.params;

        const checkRoleUsed = await User.findOne({ role: id });
        if(checkRoleUsed){
            return res.status(401).json({error : "Role already assign"});
        }

        const role = await Role.findByIdAndDelete(id);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}];
