const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { createRoleValidator, updateRoleValidator } = require('../validators/roleValidator');
const {validate} = require('express-validation');

router.post('/create', validate({ body: createRoleValidator }), roleController.createRole);

router.get('/', roleController.getRoles);

router.put('/:id', validate({ body: updateRoleValidator }), roleController.updateRole);

router.delete('/:id', roleController.deleteRole);

module.exports = router;
