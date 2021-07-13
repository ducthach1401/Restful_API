const express = require('express');
const Student = require('./router/router.js').routerStudent;
const Class = require('./router/router.js').routerClass;
const Parent = require('./router/router.js').routerParent;

const app = express();

app.use('/student', Student);
app.use('/class', Class);
app.use('/parent', Parent);

app.listen(8080, () => {
    console.log("Run Server");
})