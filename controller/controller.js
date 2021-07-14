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
    if (req.body.idClass != undefined){
        dataUpdate.idClass = req.body.idClass;
    }
    if (req.body.idStudent != undefined){
        dataUpdate.idStudent = req.body.idStudent;
    }
    if (req.body.idParent != undefined){
        dataUpdate.idParent = req.body.idParent;
    }
    if (req.body.gender != undefined){
        dataUpdate.gender = req.body.gender;
    }
    if (req.body.name != undefined){
        dataUpdate.name = req.body.name;
    }
    if (req.body.dateOfBirth != undefined){
        dataUpdate.dateOfBirth = req.body.dateOfBirth;
    }
    let result;
    var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    dataUpdate.update_at = createDate;
    if ("idStudent" in dataUpdate){
        await Parent.updateMany({idStudent: filter_idStudent}, {"$set":{"idStudent.$": dataUpdate.idStudent }}, (err) => {
            if (err) result = 0;
        })
    }
    await Student.updateOne({idStudent: filter_idStudent},dataUpdate, (err) => {
        if (err){
            result = 0;
        }
        else result = 1;
    });

    if (result === 1){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function updateClass(req, res){
    let filter_idClass = req.params.idClass;
    let dataUpdate = {};
    if (req.body.idClass != undefined){
        dataUpdate.idClass = req.body.idClass;
    }
    if (req.body.idStudent != undefined){
        dataUpdate.idStudent = req.body.idStudent;
    }
    if (req.body.name != undefined){
        dataUpdate.name = req.body.name;
    }
    let result;
    var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    dataUpdate.update_at = createDate;
    await Class.updateOne({idClass: filter_idClass},dataUpdate, (err) => {
        if (err){
            result = 0;
        } 
        else result = 1;
    });
    if (result === 1){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function updateParent(req, res){
    let filter_idParent = req.params.idParent;
    let dataUpdate = {};
    if (req.body.idParent != undefined){
        dataUpdate.idParent = req.body.idParent;
    }
    if (req.body.name != undefined){
        dataUpdate.name = req.body.name;
    }
    let result;
    var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    dataUpdate.update_at = createDate;
    if ("idParent" in dataUpdate){
        await Student.updateMany({idParent: filter_idParent},{"$set":{"idParent.$": dataUpdate.idParent }}, (err) => {
            if (err) result = 0;
        })
    }
    await Parent.updateOne({idParent: filter_idParent},dataUpdate, (err) => {
        if (err){
            result = 0;
        } 
        else result = 1;
    });
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function deleteStudent(req, res){
    let result;
    let data_idStudent = req.params.idStudent;
    Student.findOne({idStudent: data_idStudent}, (err, doc) => {
        if (err) result = 0;
        if (doc === null) {
            console.log("Null");
        }
        var class_delete = doc.idClass;
        var parent_delete = doc.idParent;
        for (let i of class_delete){
            Class.findOne({_id:i}, (err, doc) => {
                if (err) result = 0;
                let temp = doc.idStudent.remove(data_idStudent);
                Class.updateOne({_id:i}, {idStudent:temp}, (err, res) => {
                    if (err) {
                        if (temp.length === 0){
                            Class.updateOne({_id:i}, {idStudent:undefined})
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
        } else result = 1;
    });

    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function deleteClass(req, res) {
    let result;
    let data_idClass = req.params.idClass;
    await Class.findOne({idClass: data_idClass}, (err, doc) =>{
        if (err){
            result = 0;
        }
        if (doc != null){
            for (let x of doc.idStudent){
                Student.findOne({idStudent:x}, (err, doc) =>{
                    if (err) result = 0;
                    let temp = doc.idClass.remove(data_idClass);
                    Student.updateOne({idStudent:x}, {idClass:temp}, (err, res) => {
                        if (err) result = 0;
                    })
                })
            }
        }
    });
    await Class.deleteOne({idClass: data_idClass}, (err) => {
        if (err) result = 0;
        result = 1;
    });
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function deleteParent(req, res) {
    let result;
    data_idParent = req.params.idParent;
    await Parent.findOne({idParent: data_idParent}, (err, doc) => {
        if (doc.idStudent != null){
            Student.findOne({idStudent:doc.idStudent}, (err, doc) => {
                if (err) result = 0;
                let temp = doc.idParent.remove(data_idParent);
                Student.updateOne({idStudent:doc.idStudent}, {idParent:temp}, (err, res) => {
                    if (err) Student.updateOne({idParent:doc.idParent}, {idParent:undefined});
                });
            });
        }
    });
    await Parent.deleteOne({idParent: data_idParent}, (err)=> {
        if (err){
            result = 0;
        }
        result = 1;
    });
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function addClass(req, res){
    let data_idClass = req.query.idClass;
    let data_idStudent = req.query.idStudent;
    let result;
    await Class.findOne({idClass: data_idClass}, function (err, data) {
        if (err) result = 0;
            Student.findOne({idStudent: data_idStudent}, (err, temp) => {
            if (temp != null){
                if (temp.idClass === null){
                    Student.updateOne({idStudent: data_idStudent}, {"$push": {idClass: data._id}} ,(err) => {
                        if (err) result = 0;
                    });
                    console.log(temp.idClass)
                    Class.updateOne({idClass:data_idClass}, {"$push": {idStudent: temp._id}} ,(err) => {
                        if (err) result = 0;
                    });
                    result = 1;
                }
                else if (!(temp.idClass.includes(data._id))){
                    Student.updateOne({idStudent: data_idStudent}, {"$push": {idClass: data._id}} ,(err) => {
                        if (err) result = 0;
                    });
    
                    Class.updateOne({idClass:data_idClass}, {"$push": {idStudent: data._id}} ,(err) => {
                        if (err) result = 0;
                    });
                    result = 1;
                }
                else result = 0;
            }
            else result = 0;
        });
    });
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function addParent(req, res){
    let data_idStudent = req.query.idStudent;
    let data_idParent = req.query.idParent;
    let result;
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
    if (result){
        res.json({code: 200});
    }
    else res.json({code: 400});
}

async function filterStudent(req, res) {
    let data = [];
    await Student.aggregate([{
        $project: {
            sizeParent: {$size:'$idParent'},
            better: {$lte: [ "$sizeParent", 2 ]},
            idStudent: "$idStudent",
            name: "$name",
            dateOfBirth: "$dateOfBirth",
            idParent: "$idParent"
        }},
        { $match: 
            { sizeParent : {$gte:2}}
    }], function(err, result) {
        data.push(result);
    });
    res.json(data);
}

async function searchStudent(req, res) {
    let searchText = req.query.search;
    let limited = parseInt(req.query.limit);
    let page = parseInt(req.query.page) - 1;
    let sort2 = req.query.sort;
    let filter = req.query.filter;
    await Student.find({$text: {$search: searchText}})
    .limit(limited)
    .skip(page * limited)
    .exec(
        function (err, docs){
            if (err) throw err;
            docs.sort(function (a, b){
                if (sort2 === 'dateOfBirth'){
                    let tempA = a.dateOfBirth.split('/');
                    let dateA = parseInt(tempA.reverse().join(''));
                    let tempB = b.dateOfBirth.split('/');
                    let dateB = parseInt(tempB.reverse().join(''));
                    return dateA - dateB;
                }
                else {
                    let tempA = a.dateOfBirth.split('/');
                    let tempB = b.dateOfBirth.split('/');
                    let dateA = parseInt(tempA.join(''));
                    let dateB = parseInt(tempB.join(''));
                    return dateA - dateB;
                }
                
            });
            if (filter != undefined){
                docs = docs.filter(function (dateCreate){
                    let tempFilter = filter.split('/');
                    tempFilter = parseInt(tempFilter.reverse().join(''));
                    let temp = dateCreate.create_at.split('/');
                    let date = parseInt(temp.join(''));
                    return date >= tempFilter;
                });
            }
            res.json(docs);
        }
    );
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
module.exports.searchStudent = searchStudent;