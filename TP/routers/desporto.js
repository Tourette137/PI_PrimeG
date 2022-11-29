const express = require('express');
const router = express.Router();
const data = require('../query.js')


router.get("/",(req,res) => {
    let sql = "select * from desporto";
    data.query(sql).then(re => {
        if(re.length != 0){
            res.send(re);
        }
        else {
            res.status(404).send("Não existem desportos disponíveis");
        }
    });
})

module.exports = router