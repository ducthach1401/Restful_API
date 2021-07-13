const express = require('express');
const cookieParser = require('cookie-parser');
const Student = require('./router/routerStudent.js');
const Class = require('./router/routerClass.js');
const Parent = require('./router/routerParent.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/student', Student);
app.use('/class', Class);
app.use('/parent', Parent);

app.listen(8080, () => {
    console.log("Run Server");
})