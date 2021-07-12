const mongoose = require('mongoose');
const url_mongo = 'mongodb://root:root@localhost:1234/database?authSource=admin';


const schema_student = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    idStudent: {type: Number, unique:true, default:1814062},
    name: String,
    dateOfBirth: String,
    idClass: [{type:mongoose.Types.ObjectId, ref:'class'}],
    idParent: [Number],
    gender: String,
    create_at: String,
    update_at: String
});

const schema_class = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    idClass: {type: Number, unique:true, default:2000},
    name: String,
    idStudent: [{type: mongoose.Types.ObjectId, ref: 'student'}],
    create_at: String,
    update_at: String
});

const schema_parent = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    idParent: {type: Number, unique:true, default:180000},
    idStudent:Number,
    name: String,
    create_at: String,
    update_at: String
});

mongoose.connect(url_mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const Student = mongoose.model('student', schema_student);
const Class = mongoose.model('class', schema_class);
const Parent = mongoose.model('parent', schema_parent);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

function insertStudent(data){
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
    });
}

function insertClass(data) {
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
    });
}

function insertParent(data) {
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
    });
}

function updateStudent(filter, data){
    db.once('open', function() {
        var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        data.update_at = createDate;
        if ("idStudent" in data){
            Class.updateMany({idStudent: filter.idStudent},{"$set":{"idStudent.$": data.idStudent }}, (err) => {
                if (err) throw err;
            })
            Parent.updateMany({idStudent: filter.idStudent}, {"$set":{"idStudent.$": data.idStudent }}, (err) => {
                if (err) throw err;
            })
        }
        Student.updateOne({idStudent: filter.idStudent},data, (err) => {
            if (err){
                throw err;
            } 
        });  
    });
}

function updateClass(filter, data){
    db.once('open', function() {
        var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        data.update_at = createDate;
        if ("idClass" in data){
            Student.updateMany({idClass: filter.idClass},{"$set":{"idClass.$": data.idClass }}, (err) => {
                if (err) throw err;
            })
        }
        Class.updateOne({idClass: data.idClass},data, (err) => {
            if (err){
                throw err;
            } 
        });
    });
}

function updateParent(filter, data){
    db.once('open', function() {
        var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        data.update_at = createDate;
        if ("idParent" in data){
            Student.updateMany({idParent: filter.idParent},{"$set":{"idParent.$": data.idParent }}, (err) => {
                if (err) throw err;
            })
        }
        Parent.updateOne({idParent: data.idParent},data, (err) => {
            if (err){
                throw err;
            } 
        });
    });
}

function deleteStudent(data){
    db.once('open', function() {
        Student.findOne(data, (err, doc) => {
            if (err) throw err;
            if (doc === null) {
                console.log("Null");
                return;
            }
            var class_delete = doc.idClass;
            var parent_delete = doc.idParent;
            for (let i of class_delete){
                Class.findOne({idClass:i}, (err, doc) => {
                    if (err) throw err;
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
                    if (err) throw err;
                });
            }
        });
        Student.deleteOne(data, (err) => {
            if (err){
                throw err;
            }
        });
    });
}

function deleteClass(data) {
    db.once('open', function() {
        Class.findOne(data, (err, doc) =>{
            if (err){
                throw err;
            }
            for (let x of doc.idStudent){
                Student.findOne({idStudent:x}, (err, doc) =>{
                    if (err) throw err;
                    let temp = doc.idClass.remove(data.idClass);
                    Student.updateOne({idStudent:x}, {idClass:temp}, (err, res) => {
                        if (err) throw err;
                    })
                })
            }
        })
        Class.deleteOne(data, (err) => {
            if (err) throw err;
        });
    });
}

function deleteParent(data) {
    db.once('open', function () {
        Parent.findOne(data, (err, doc) => {
            Student.findOne({idStudent:doc.idStudent}, (err, doc) => {
                if (err) throw err;
                console.log(doc.idParent)
                let temp = doc.idParent.remove(data.idParent);
                Student.updateOne({idStudent:doc.idStudent}, {idParent:temp}, (err, res) => {
                    if (err) Student.updateOne({idParent:doc.idParent}, {idParent:undefined});
                })
            })
        })
        Parent.deleteOne(data, (err)=> {
            if (err){
                throw err;
            }
        });
    });
}

function addClass(data_id){
    db.once('open', () =>{
        Class.findOne({idClass: data_id.idClass}, function (err, data) {
            if (err) throw err;
            Student.findOne({idStudent: data_id.idStudent}, (err, temp) => {
                if (!(temp.idClass.includes(data._id))){
                    Student.updateOne({idStudent: data_id.idStudent}, {"$push": {idClass: data._id}} ,(err) => {
                        if (err) throw err;
                    });

                    Class.updateOne({idClass:data_id.idClass}, {"$push": {idStudent: data._id}} ,(err) => {
                        if (err) throw err;
                    })
                }
                else console.log("Trung`");
            });
            
        });
    })
}

function addParent(data_id){
    db.once('open', () =>{
        Student.findOne({idStudent: data_id.idStudent}, (err, data) => {
            if (!(data.idParent.includes(data_id.idParent))){
                Student.updateOne({idStudent: data_id.idStudent}, {"$push": {idParent: data_id.idParent}} ,(err) => {
                    if (err) throw err;
                })
                Parent.updateOne({idParent: data_id.idParent}, {idStudent: data_id.idStudent} ,(err) => {
                    if (err) throw err;
                })
            }
            else console.log("Error");
        })
    })
}

function filter_student() {
    db.once('open', () =>{
        Student.aggregate([{
            $match: {'idParent': {$gte: 2}}
        }], function(err, result) {
            console.log(result);
        })
    });
}
var data_test = {
    name: "Thach",
    dateOfBirth: "14/01/2000",
    gender: "Nam"
};

var data_test_class = {
    name: "Tieng Anh"
};

var data_test_parent = {
    name: "Tieng Anh"
};

var data_add_class = {
    idClass: 2000,
    idStudent: 1814062
}

var data = {
    idStudent:1814062,
    idParent:180001
}
// insertStudent(data_test);
// insertParent(data_test_parent);
// insertClass(data_test_class);
// addClass(data_add_class);
// addParent(data)
// db.once('open', function () {
//     Class.
//     findOne({ idClass: '2000' }).
//     populate('idStudent').
//     exec(function (err, story) {
//         if (err) throw err;
//         console.log(story);
//     });

//     Student.
//     findOne({ idStudent: '1814062' }).
//     populate('idClass').
//     exec(function (err, story) {
//         if (err) throw err;
//         console.log(story);
//     });
// })

filter_student();