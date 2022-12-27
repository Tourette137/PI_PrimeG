const express = require('express');
const router = express.Router();
const data = require('../query.js')
const isAuth = require('./auth');


// Vai buscar os espaços favoritos para um desporto específico numa localidade
router.get("/desporto/:id",(req,res) => {
    const idDesporto = req.params.id;
    const idLocalidade = req.query.localidade;
    let sql = "select * from espaco join Desporto_Has_Espaco as de on de.idEspaco = espaco.idEspaco where de.idDesporto = " + idDesporto
            + " and espaco.favorito = 1 and espaco.Localidade_idLocalidade = "+ idLocalidade +";";
    data.query(sql).then(re => {
        if(re.length != 0){
            res.send(re);
        }
        else {
            res.status(404).send("Não existem espaços disponíveis para esse desporto");
        }
    });
})

//Associar ao espaço o utilizador 1 E criar o espaço com favorito a 0

router.post("/registoNFavorito",isAuth,(req,res) => {
    let sql = `insert into espaco (nome, rua, contacto, Utilizador_idUtilizador, Localidade_idLocalidade, Favorito)
                values( "${req.body.nome}","${req.body.rua}","${req.body.contacto}",${req.userId},${req.body.localidade},0);`
    data.query(sql).then(re => {
       let sql1 = `select idEspaco from espaco as e where e.nome = "${req.body.nome}" and e.rua = "${req.body.rua}"
                    and e.contacto = "${req.body.contacto}" and e.Utilizador_idUtilizador = ${req.userId} and e.Localidade_idLocalidade = ${req.body.localidade} and e.Favorito = 0;`
        data.query(sql1).then(re => {
           if (re.length != 0) {
                let sql2 = `insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas)
                            values (${req.body.desporto},${re[0].idEspaco},${req.body.nMesas});`
                data.query(sql2)
                res.send(re[0]) 
            }
            else {
                res.status(404).send("Espaco não encotrado")
            }
        })
    })
})

module.exports = router