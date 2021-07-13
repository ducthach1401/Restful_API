const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.js');

router.post('/', controller.insertClass);
router.put('/:idClass', controller.updateClass);
router.delete('/:idClass', controller.deleteClass);

module.exports = router;
