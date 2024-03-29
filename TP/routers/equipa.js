const express = require('express');
const router = express.Router();
const data = require('../query.js')


router.get("/:id",(req,res) => {
    const idEquipa = parseInt(req.params.id);
    if(!isNaN(idEquipa)) {
        let sql = "select nomeEquipa from equipa where idEquipa = " + idEquipa + ";";
        data.query(sql).then(re => {
            if(re.length != 0){
                res.send(re);
            }
            else {
                res.status(404).send("A equipa não existe");
            }
        });
    }
    else {
        res.send([{nomeEquipa: "TBD"}])
    }
})

module.exports = router