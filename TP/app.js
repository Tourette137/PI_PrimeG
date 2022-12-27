const Joi = require('joi');
const express= require('express');
const cors = require('cors');
const app = express();

//const port = process.env.PORT || 3000;

const port = 3000;

app.listen(port, () => console.log('Listening on port ' + port + '!'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRouter = require("./routers/users");
const torneioRouter = require("./routers/torneio");
const localidadeRouter = require("./routers/localidade.js");
const desportoRouter = require("./routers/desporto.js");
const equipaRouter = require("./routers/equipa.js");
const espacoRouter = require("./routers/espaco.js")

app.use("/users",userRouter);

app.use("/torneios",torneioRouter);

app.use("/localidades",localidadeRouter);

app.use("/desportos",desportoRouter);

app.use("/equipa",equipaRouter);

app.use("/espacos",espacoRouter);
