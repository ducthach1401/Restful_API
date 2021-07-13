const mongoose = require('mongoose');
const url_mongo = 'mongodb://root:root@localhost:1234/database?authSource=admin';
const Schema = require('../model/model.js');
const Class = Schema.Class;
const Student = Schema.Student;
const Parent = Schema.Parent;

mongoose.connect(url_mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

async function insertStudent(req, res){
    let result;
    let newStudent = new Student;
    newStudent.name = req.body.name;
    newStudent.dateOfBirth = req.body.dateOfBirth;
    newStudent.gender = req.body.gender;
    newStudent._id = new mongoose.Types.ObjectId;
    var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    newStudent.create_at = createDate;
    newStudent.update_at = createDate;
    function temp(){
        newStudent.save((err) => {
            if (err){
                newStudent.idStudent++;
                temp();
            }
        });
        result = 1;
    }
    temp();
    if (result === 1){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function insertClass(req, res) {
    let result;
    let newClass = new Class;
    newClass._id = new mongoose.Types.ObjectId;
    newClass.name = req.body.name;
    var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    newClass.create_at = createDate;
    newClass.update_at = createDate;
    function temp(){
        newClass.save((err) => {
            if (err){
                newClass.idClass++;
                temp();
            }
        });
        result = 1;
    }
    temp();
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function insertParent(req, res) {
    let result;
    let newParent = new Parent;
    newParent._id = new mongoose.Types.ObjectId;
    newParent.name = req.body.name;
    var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    newParent.create_at = createDate;
    newParent.update_at = createDate;
    function temp(){
        newParent.save((err) => {
            if (err){
                newParent.idParent++;
                temp();
            }
        });
    }
    temp();
    result = 1;
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function updateStudent(req, res){
    let filter_idStudent = req.params.idStudent;
    let dataUpdate = {};
    dataUpdate.idClass = req.body.idClass;
    dataUpdate.idStudent = req.body.idStudent;
    dataUpdate.idParent = req.body.idParent;
    dataUpdate.gender = req.body.gender;
    dataUpdate.name = req.body.name;
    dataUpdate.dateOfBirth = req.body.dateOfBirth;
    let result;
    db.once('open', function() {
        var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        data.update_at = createDate;
        if ("idStudent" in dataUpdate){
            Class.updateMany({idStudent: filter_idStudent},{"$set":{"idStudent.$": dataUpdate.idStudent }}, (err) => {
                if (err) result = 0;
            })
            Parent.updateMany({idStudent: filter_idStudent}, {"$set":{"idStudent.$": dataUpdate.idStudent }}, (err) => {
                if (err) result = 0;
            })
        }
        Student.updateOne({idStudent: filter_idStudent},dataUpdate, (err) => {
            if (err){
                result = 0;
            } 
        });
        result = 1;
    });
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function updateClass(req, res){
    let filter_idClass = req.params.idClass;
    let dataUpdate = {};
    dataUpdate.idClass = req.body.idClass;
    dataUpdate.idStudent = req.body.idStudent;
    dataUpdate.name = req.body.name;
    let result;
    db.once('open', function() {
        var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        data.update_at = createDate;
        if ("idClass" in data){
            Student.updateMany({idClass: filter_idClass},{"$set":{"idClass.$": dataUpdate.idClass }}, (err) => {
                if (err) result = 0;
            })
        }
        Class.updateOne({idClass: dataUpdate.idClass},dataUpdate, (err) => {
            if (err){
                result = 0;
            } 
        });
        result = 1;
    });
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function updateParent(req, res){
    let filter_idParent = req.params.idParent;
    let dataUpdate = {};
    dataUpdate.idParent = req.body.idParent;
    dataUpdate.idStudent = req.body.idStudent;
    dataUpdate.name = req.body.name;
    let result;
    db.once('open', function() {
        var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        data.update_at = createDate;
        if ("idParent" in data){
            Student.updateMany({idParent: filter_idParent},{"$set":{"idParent.$": dataUpdate.idParent }}, (err) => {
                if (err) result = 0;
            })
        }
        Parent.updateOne({idParent: dataUpdate.idParent},dataUpdate, (err) => {
            if (err){
                result = 0;
            } 
        });
        result = 1;
    });
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function deleteStudent(req, res){
    let result;
    let data_idStudent = req.params.idStudent;
    db.once('open', function() {
        Student.findOne({idStudent: data_idStudent}, (err, doc) => {
            if (err) result = 0;
            if (doc === null) {
                console.log("Null");
            }
            var class_delete = doc.idClass;
            var parent_delete = doc.idParent;
            for (let i of class_delete){
                Class.findOne({idClass:i}, (err, doc) => {
                    if (err) result = 0;
                    let temp = doc.idStudent.remove(data_idStudent);
                    Class.updateOne({idClass:i}, {idStudent:temp}, (err, res) => {
                        if (err) {
                            if (temp.length === 0){
                                Class.updateOne({idClass:i}, {idStudent:undefined})
                            }
                        }
                    })
                })
            }
            
            for (let i of parent_delete){
                Parent.deleteOne({idParent:i}, (err) =>{
                    if (err) result = 0;
                });
            }
        });
        Student.deleteOne({idStudent: data_idStudent}, (err) => {
            if (err){
                result = 0;
            }
        });
        result = 1;
    });
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function deleteClass(req, res) {
    let result;
    let data_idClass = req.params.idClass;
    db.once('open', function() {
        Class.findOne({idClass: data_idClass}, (err, doc) =>{
            if (err){
                result = 0;
            }
            for (let x of doc.idStudent){
                Student.findOne({idStudent:x}, (err, doc) =>{
                    if (err) result = 0;
                    let temp = doc.idClass.remove(data_idClass);
                    Student.updateOne({idStudent:x}, {idClass:temp}, (err, res) => {
                        if (err) result = 0;
                    })
                })
            }
        })
        Class.deleteOne({idClass: data_idClass}, (err) => {
            if (err) result = 0;
        });
        result = 1;
    });
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function deleteParent(req, res) {
    let result;
    data_idStudent = req.params.idStudent;
    db.once('open', function () {
        Parent.findOne({idStudent: data_idStudent}, (err, doc) => {
            Student.findOne({idStudent:doc.idStudent}, (err, doc) => {
                if (err) result = 0;
                console.log(doc.idParent)
                let temp = doc.idParent.remove(data.idParent);
                Student.updateOne({idStudent:doc.idStudent}, {idParent:temp}, (err, res) => {
                    if (err) Student.updateOne({idParent:doc.idParent}, {idParent:undefined});
                })
            })
        })
        Parent.deleteOne({idStudent: data_idStudent}, (err)=> {
            if (err){
                result = 0;
            }
        });
        result = 1;
    });
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function addClass(req, res){
    let data_idClass = req.params.idClass;
    let data_idStudent = req.params.idStudent;
    let result;
    db.once('open', () =>{
        Class.findOne({idClass: data_idClass}, function (err, data) {
            if (err) result = 0;
            Student.findOne({idStudent: data_idStudent}, (err, temp) => {
                if (!(temp.idClass.includes(data._id))){
                    Student.updateOne({idStudent: data_idStudent}, {"$push": {idClass: data._id}} ,(err) => {
                        if (err) result = 0;
                    });

                    Class.updateOne({idClass:data_idClass}, {"$push": {idStudent: data._id}} ,(err) => {
                        if (err) result = 0;
                    });
                    result = 1;
                }
                else result = 0;
            });
            
        });
    })
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function addParent(req, res){
    let data_idStudent = req.params.idStudent;
    let data_idParent = req.params.idParent;
    let result;
    db.once('open', () =>{
        Student.findOne({idStudent: data_idStudent}, (err, data) => {
            if (!(data.idParent.includes(data_idParent))){
                Student.updateOne({idStudent: data_idStudent}, {"$push": {idParent: data_idParent}} ,(err) => {
                    if (err) result = 0;
                })
                Parent.updateOne({idParent: data_idParent}, {idStudent: data_idStudent} ,(err) => {
                    if (err) result = 0;
                })
                result = 1;
            }
            else result = 0;
        })
    })
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function filterStudent(req, res) {
    let data = [];
    db.once('open', () =>{
        Student.aggregate([{
            $match: {'idParent': {$gte: 2}}
        }], function(err, result) {
            data.push(result);
        })
    });
    res.json(data);
}

module.exports.insertStudent = insertStudent;
module.exports.insertClass = insertClass;
module.exports.insertParent = insertParent;
module.exports.updateStudent = updateStudent;
module.exports.updateClass = updateClass;
module.exports.updateParent = updateParent;
module.exports.deleteClass = deleteClass;
module.exports.deleteStudent = deleteStudent;
module.exports.deleteParent = deleteParent;
module.exports.addClass = addClass;
module.exports.addParent = addParent;
module.exports.filterStudent = filterStudent;