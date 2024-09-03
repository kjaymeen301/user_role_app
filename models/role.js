const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
    },
    accessModules: [{
        name: { type: String},
        permission: {
            read: { type: Number, enum: [0, 1] },
            view: { type: Number, enum: [0, 1] },
            write: { type: Number, enum: [0, 1] },
            delete: { type: Number, enum: [0, 1] }
        }
    }],
    active: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Role', RoleSchema);
