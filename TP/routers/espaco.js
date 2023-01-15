const express = require('express');
const router = express.Router();
const data = require('../query.js')
const isAuth = require('./auth');


// Vai buscar os espaços favoritos para um desporto específico numa localidade
router.get("/desporto/:id",(req,res) => {
    const idDesporto = req.params.id;
    const idLocalidade = req.query.localidade;
    let sql = "select * from espaco join Desporto_Has_Espaco as de on de.idEspaco = espaco.idEspaco where de.idDesporto = " + idDesporto
            + " and espaco.favorito = 1;";
    data.query(sql).then(re => {
        if(re.length != 0){
            res.send(re);
        }
        else {
            res.status(404).send("Não existem espaços disponíveis para esse desporto");
        }
    });
})



// Vai buscar os espaços disponiveis
router.get("/disponiveis",(req,res) => {
    let sql = "select * from espaco join Desporto_Has_Espaco as de on de.idEspaco = espaco.idEspaco"

    //Filtro de Localidade
    if(req.query.localidade != null){
          if(!isNaN(req.query.localidade)){
                sql += " where espaco.Localidade_idLocalidade = " + req.query.localidade;
                if(!isNaN(req.query.desporto)){
                        sql += " and de.idDesporto = " + req.query.desporto;
                }
          }
    }

    //Filtro de Desporto
    else if(req.query.desporto != null)
            if(!isNaN(req.query.desporto)){
                    sql += " where de.idDesporto = " + req.query.desporto;
            }

    sql += ";";
    data.query(sql).then(re => {
        if(re.length != 0){
            res.send(re);
        }
        else {
            res.status(404).send("Não existem espaços disponíveis para esse desporto");
        }
    });
})

// Vai buscar os espaços favoritos
router.get("/favoritos",(req,res) => {
    let sql = "select * from espaco join Desporto_Has_Espaco as de on de.idEspaco = espaco.idEspaco where espaco.favorito = 1"

    //Filtro de Localidade
    if(req.query.localidade != null){
          if(!isNaN(req.query.localidade)){
                sql += " and espaco.Localidade_idLocalidade = " + req.query.localidade;
                if(!isNaN(req.query.desporto)){
                        sql += " and de.idDesporto = " + req.query.desporto;
                }
          }
    }

    //Filtro de Desporto
    else if(req.query.desporto != null)
            if(!isNaN(req.query.desporto)){
                    sql += " and de.idDesporto = " + req.query.desporto;
            }

    sql += ";";
    data.query(sql).then(re => {
        if(re.length != 0){
            res.send(re);
        }
        else {
            res.status(404).send("Não existem espaços disponíveis para esse desporto");
        }
    });
})

router.get("/:id",(req,res) => {
    const id = req.params.id;
    let sql = "select e.nome,e.idEspaco,e.rua,e.contacto,d.nomeDesporto,de.numeroMesas,l.nome as localidade from espaco as e"+
              " join Desporto_Has_Espaco as de on de.idEspaco = e.idEspaco"+
              " join Desporto as d on d.idDesporto = de.idDesporto"+
              " join Localidade as l on l.idLocalidade = e.Localidade_idLocalidade where e.idEspaco = " + id
              + ";";
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
                res.status(404).send("Espaco não encontrado")
            }
        })
    })
})

// Registar o espaço como favorito
router.post("/registarEspaco",(req,res) => {
    const nome = req.body.nome;
    const rua = req.body.rua;
    const contacto = req.body.contacto;
    const idUtilizador = req.body.idUtilizador;
    const idLocalidade = req.body.idLocalidade;

    let sql = "select nome from espaco where nome = " + nome + ";";
    data.query(sql).then(re => {
        if(re.length != 0){
            res.status(404).send("Espaço já existe!");
        }
        else {
            sql = "insert into espaco (nome,rua,contacto,Utilizador_idUtilizador,Localidade_idLocalidade,Favorito)"+
                  "values (" + nome + "," + rua + "," + contacto + "," + idUtilizador + "," + idLocalidade + ",1);"
            data.query(sql).then(re => {
                if(re != 0){
                  res.send(re);
                }
                else {
                  res.status(404).send("Espaços já existente");
                }
            }
    )}
    });
})

router.get("/espacoByLocal/:idLocalidade",(req,res) => {
    var localidade = req.params.idLocalidade;
    let sql = "select * from espaco where Localidade_idLocalidade = "+ localidade +";";
    data.query(sql).then(re => {
        if(re.length != 0){
            res.send(re);
        }
        else {
            res.status(404).send("Não existem espaços disponíveis");
        }
    });
})

module.exports = router
