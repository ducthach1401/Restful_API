const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.js');

router.post('/', controller.insertStudent);
router.put('/:idStudent', controller.updateStudent);
router.delete('/:idStudent', controller.deleteStudent);
router.get('/1', controller.addClass);
router.get('/2', controller.addParent);
router.get('/filter', controller.filterStudent);
router.get('/user', controller.searchStudent);
module.exports = router;