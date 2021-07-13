const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.js');

var routerStudent = router.post('/', controller.insertStudent);
routerStudent.put('/:idStudent', controller.updateStudent);
routerStudent.delete('/:idStudent', controller.deleteStudent);
routerStudent.get('/', controller.addClass);
routerStudent.get('/', controller.addParent);

var routerClass = router.post('/', controller.insertClass);
routerClass.put('/:idClass', controller.updateClass);
routerClass.delete('/:idClass', controller.deleteClass);

var routerParent = router.post('/', controller.insertParent);
routerParent.put('/:idParent', controller.updateParent);
routerParent.delete('/:idParent', controller.deleteParent);

module.exports.routerParent = routerParent;
module.exports.routerStudent = routerStudent;
module.exports.routerClass = routerClass;