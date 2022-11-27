const Joi = require('joi');
const express= require('express');
const app = express();

//const port = process.env.PORT || 3000;

const port = 3000;

app.listen(port, () => console.log('Listening on port ' + port + '!'));


const userRouter = require("./routers/users");
const torneioRouter = require("./routers/torneio")

app.use("/users",userRouter);

app.use("/torneios",torneioRouter);


