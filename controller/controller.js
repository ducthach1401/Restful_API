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

async function insertStudent(data){
    db.once('open', function() {
        let newStudent = new Student;
        newStudent.name = data.name;
        newStudent.dateOfBirth = data.dateOfBirth;
        newStudent.gender = data.gender;
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
        }
        temp();
        return {"Status": 200};
    });
}

async function insertClass(data) {
    db.once('open', function() {
        let newClass = new Class;
        newClass._id = new mongoose.Types.ObjectId;
        newClass.name = data.name;
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
        }
        temp();
        return {"Status": 200};
    });
}

async function insertParent(data) {
    db.once('open', function() {
        let newParent = new Parent;
        newParent._id = new mongoose.Types.ObjectId;
        newParent.name = data.name;
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
        return {"Status": 200};
    });
}

async function updateStudent(filter, data){
    db.once('open', function() {
        var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        data.update_at = createDate;
        if ("idStudent" in data){
            Class.updateMany({idStudent: filter.idStudent},{"$set":{"idStudent.$": data.idStudent }}, (err) => {
                if (err) return {"Status": 400};
            })
            Parent.updateMany({idStudent: filter.idStudent}, {"$set":{"idStudent.$": data.idStudent }}, (err) => {
                if (err) return {"Status": 400};
            })
        }
        Student.updateOne({idStudent: filter.idStudent},data, (err) => {
            if (err){
                return {"Status": 400};
            } 
        });
        return {"Status": 200};
    });
}

async function updateClass(filter, data){
    db.once('open', function() {
        var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        data.update_at = createDate;
        if ("idClass" in data){
            Student.updateMany({idClass: filter.idClass},{"$set":{"idClass.$": data.idClass }}, (err) => {
                if (err) return {"Status": 400};
            })
        }
        Class.updateOne({idClass: data.idClass},data, (err) => {
            if (err){
                return {"Status": 400};
            } 
        });
        return {"Status": 200};
    });
}

async function updateParent(filter, data){
    db.once('open', function() {
        var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        data.update_at = createDate;
        if ("idParent" in data){
            Student.updateMany({idParent: filter.idParent},{"$set":{"idParent.$": data.idParent }}, (err) => {
                if (err) return {"Status": 400};
            })
        }
        Parent.updateOne({idParent: data.idParent},data, (err) => {
            if (err){
                return {"Status": 400};
            } 
        });
        return {"Status": 200};
    });
}

async function deleteStudent(data){
    db.once('open', function() {
        Student.findOne(data, (err, doc) => {
            if (err) return {"Status": 400};
            if (doc === null) {
                console.log("Null");
                return;
            }
            var class_delete = doc.idClass;
            var parent_delete = doc.idParent;
            for (let i of class_delete){
                Class.findOne({idClass:i}, (err, doc) => {
                    if (err) return {"Status": 400};
                    let temp = doc.idStudent.remove(data.idStudent);
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
                    if (err) return {"Status": 400};
                });
            }
        });
        Student.deleteOne(data, (err) => {
            if (err){
                return {"Status": 400};
            }
        });
        return {"Status": 200};
    });
}

async function deleteClass(data) {
    db.once('open', function() {
        Class.findOne(data, (err, doc) =>{
            if (err){
                return {"Status": 400};
            }
            for (let x of doc.idStudent){
                Student.findOne({idStudent:x}, (err, doc) =>{
                    if (err) return {"Status": 400};
                    let temp = doc.idClass.remove(data.idClass);
                    Student.updateOne({idStudent:x}, {idClass:temp}, (err, res) => {
                        if (err) return {"Status": 400};
                    })
                })
            }
        })
        Class.deleteOne(data, (err) => {
            if (err) return {"Status": 400};
        });
        return {"Status": 200};
    });
}

async function deleteParent(data) {
    db.once('open', function () {
        Parent.findOne(data, (err, doc) => {
            Student.findOne({idStudent:doc.idStudent}, (err, doc) => {
                if (err) return {"Status": 400};
                console.log(doc.idParent)
                let temp = doc.idParent.remove(data.idParent);
                Student.updateOne({idStudent:doc.idStudent}, {idParent:temp}, (err, res) => {
                    if (err) Student.updateOne({idParent:doc.idParent}, {idParent:undefined});
                })
            })
        })
        Parent.deleteOne(data, (err)=> {
            if (err){
                return {"Status": 400};
            }
        });
        return {"Status": 200};
    });
}

async function addClass(data_id){
    db.once('open', () =>{
        Class.findOne({idClass: data_id.idClass}, function (err, data) {
            if (err) return {"Status": 400};
            Student.findOne({idStudent: data_id.idStudent}, (err, temp) => {
                if (!(temp.idClass.includes(data._id))){
                    Student.updateOne({idStudent: data_id.idStudent}, {"$push": {idClass: data._id}} ,(err) => {
                        if (err) return {"Status": 400};
                    });

                    Class.updateOne({idClass:data_id.idClass}, {"$push": {idStudent: data._id}} ,(err) => {
                        if (err) return {"Status": 400};
                    });
                    return {"Status": 200};
                }
                else return {"Status": 400};
            });
            
        });
    })
}

async function addParent(data_id){
    db.once('open', () =>{
        Student.findOne({idStudent: data_id.idStudent}, (err, data) => {
            if (!(data.idParent.includes(data_id.idParent))){
                Student.updateOne({idStudent: data_id.idStudent}, {"$push": {idParent: data_id.idParent}} ,(err) => {
                    if (err) return {"Status": 400};
                })
                Parent.updateOne({idParent: data_id.idParent}, {idStudent: data_id.idStudent} ,(err) => {
                    if (err) return {"Status": 400};
                })
                return {"Status": 200};
            }
            else return {"Status": 400};
        })
    })
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
    return data;
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