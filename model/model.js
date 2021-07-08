const mongoose = require('mongoose');
const url_mongo = 'mongodb://root:root@localhost:1234/database?authSource=admin';


const schema_student = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    idStudent: {type: Number, unique:true, default:1814062},
    name: String,
    dateOfBirth: String,
    idClass: [Number],
    idParent: [Number],
    gender: String,
    create_at: String,
    update_at: String
});

const schema_class = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    idClass: {type: Number, unique:true, default:2000},
    name: String,
    idStudent: [Number],
    create_at: String,
    update_at: String
});

const schema_parent = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    idParent: {type: Number, unique:true, default:180000},
    idStudent:[Number],
    name: String,
    create_at: String,
    update_at: String
});

mongoose.connect(url_mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const Student = mongoose.model("student", schema_student);
const Class = mongoose.model("class", schema_class);
const Parent = mongoose.model("parent", schema_parent);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

function insertData(object, data){
    db.once('open', function() {
        if (object === 'student'){
            let newStudent = new Student;
            newStudent.name = data.name;
            newStudent.dateOfBirth = data.dateOfBirth;
            newStudent.gender = data.gender;
            newStudent._id = new mongoose.Types.ObjectId;
            newStudent.idClass = data.idClass;
            newStudent.idParent = data.idParent;
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
        }
        else if (object === 'class') {
            let newClass = new Class;
            newClass._id = new mongoose.Types.ObjectId;
            newClass.name = data.name;
            newClass.idStudent = data.idStudent;
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
            
        }
        else if (object === 'parent') {
            let newParent = new Parent;
            newParent._id = new mongoose.Types.ObjectId;
            newParent.name = data.name;
            newParent.idStudent = data.idStudent;
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
        }
    });
}

function updateData(object, data){
    db.once('open', function() {
        if (object === 'student'){
            var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            data.update_at = createDate;
            Student.updateOne({idStudent: data.idStudent},data, (err) => {
                if (err){
                    throw err;
                } 
            });
        }
        else if (object === 'class') {
            var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            data.update_at = createDate;
            Class.updateOne({idClass: data.idClass},data, (err) => {
                if (err){
                    throw err;
                } 
            });
        }
        else if (object === 'parent') {
            var createDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            data.update_at = createDate;
            Parent.updateOne({idParent: data.idParent},data, (err) => {
                if (err){
                    throw err;
                } 
            });
        }
    });
}

function deleteData(object, data){
    db.once('open', function() {
        if (object === 'student'){
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
        }
        else if (object === 'class') {
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
        }
        else if (object === 'parent') {
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
        }
    });
}

function addClass(data){
    db.once('open', () =>{

    })
}

var data_test = {
    name: "Thach",
    dateOfBirth: "14/01/2000",
    gender: "Nam",
    idParent:[180000],
    idClass: [2000]
};

var data_test_class = {
    name: "Tieng Anh",
    idStudent: [1814062]
};

var data_test_parent = {
    name: "Tieng Anh",
    idStudent: [1814062]
};

// insertData("student", data_test);
// insertData("class", data_test_class);
// insertData("parent", data_test_parent);

updateData("student", {
    idStudent: 1814063,
    idClass:5000
})
// deleteData("student", {idStudent: 1814062});
// deleteData("class", {idClass: 2000});
// deleteData("parent",{idParent:180000})