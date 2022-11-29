const Joi = require('joi');
const express= require('express');
const cors = require('cors');
const app = express();
app.use(cors());

//const port = process.env.PORT || 3000;

const port = 3000;

app.listen(port, () => console.log('Listening on port ' + port + '!'));


const userRouter = require("./routers/users");
const torneioRouter = require("./routers/torneio");
const localidadeRouter = require("./routers/localidade.js");
const desportoRouter = require("./routers/desporto.js");

app.use("/users",userRouter);

app.use("/torneios",torneioRouter);

app.use("/localidades",localidadeRouter);

app.use("/desportos",desportoRouter);


