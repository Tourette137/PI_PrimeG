const Joi = require('joi');
const express= require('express');
const app = express();

//const port = process.env.PORT || 3000;

const port = 3000;

app.listen(port, () => console.log('Listening on port ' + port + '!'));


const userRouter = require("./routers/users");

app.use("/users",userRouter);

