const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.js');

router.post('/', controller.insertParent);
router.put('/:idParent', controller.updateParent);
router.delete('/:idParent', controller.deleteParent);

module.exports = router;
