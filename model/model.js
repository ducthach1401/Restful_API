const mongoose = require('mongoose');

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

schema_student.index({name: 'text', create_at: 'text', update_at: 'text', dateOfBirth: 'text'});
const Student = mongoose.model('student', schema_student);
const Class = mongoose.model('class', schema_class);
const Parent = mongoose.model('parent', schema_parent);
Student.createIndexes();

module.exports.Class = Class;
module.exports.Parent = Parent;
module.exports.Student = Student;
