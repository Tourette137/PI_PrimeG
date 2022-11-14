const { application } = require('express');
const express= require('express');
const router = express.Router();
const data = require('../query.js')


//imprimir todos os utilizadores
router.get("/",(req,res) => {
    let sql = "Select * from utilizador;"
    data.query(sql).then(re => {
        res.send(re);
    });
})



module.exports = router

