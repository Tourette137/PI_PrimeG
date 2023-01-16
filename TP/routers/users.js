const { application } = require('express');
const express= require('express');
const router = express.Router();
const data = require('../query.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isAuth = require('./auth');


//Imprimir todos os utilizadores
router.get("/", (req, res) => {
    let sql = "Select * from utilizador;"
    data.query(sql).then(re => {
        re.map((r) => r.dataNascimento = r.dataNascimento.toLocaleDateString())
        res.send(JSON.stringify(re))
    })
})


//Registo de um utilizador 
router.post("/registo", (req, res) => {
    
    let sql = `Select * from utilizador WHERE email = "${req.body.email}";`
    console.log(req.body)

    data.query(sql)
        .then( async re => {
            if(re.length == 0) {
                hashedPass = await bcrypt.hash(req.body.password, 10)

                let sql = `Insert into utilizador (Nome, email, password, dataNascimento, genero) 
                    values ("${req.body.nome}", "${req.body.email}", "${hashedPass}", "${req.body.dataNascimento}", "${req.body.genero}")`
                data.query(sql)
                    .then(re => {
                        res.send("Utilizador registado com sucesso")
                    })
                    .catch(e => { res.status(400).jsonp({ error: e }) })
            } else {
                res.status(501).jsonp("User já existe!")
            }
        })
        .catch(e => { res.status(500).jsonp({ error: e }) })
        
})


//Login de um Utilizador
router.post("/login", (req, res) => {
    console.log(req.body.email);
    let sql = `Select * from utilizador WHERE email = "${req.body.email}";`

    data.query(sql)
        .then( async re => {
            if(re.length == 0) {
                res.status(503).jsonp("User não existe!")
            } else {
                if (await bcrypt.compare(req.body.password, re[0].password)) {
                    const user = {
                        "id" : re[0].idUtilizador,
                        "email" : re[0].email
                    }
                    res.jsonp({user, token: jwt.sign(user, 'PRIVATEKEY')})
                } else {
                    res.status(501).jsonp("Password incorreta!")
                }
            }
        })
        .catch(e => { res.status(502).jsonp({ error: e }) })
})


// Listar torneios em que o user esta inscrito 
router.get("/torneiosInscrito", isAuth, (req, res) => {

    let sql =  `Select * from Torneio as T
                Join Torneio_has_Equipa as TE on TE.Torneio_idTorneio = T.idTorneio
                Join Equipa_has_Utilizador as EU on TE.Equipa_idEquipa = EU.Equipa_idEquipa
                Where EU.Utilizador_idUtilizador = "${req.userId}"
                AND T.terminado = 0;`

    data.query(sql)
        .then( async re => {
            if(re.length == 0) {
                res.status(503).jsonp("Não está inscrito em nenhum torneio")
            } else {
                res.send(re);
            }
        })
        .catch(e => { res.status(502).jsonp({ error: e }) })
    
})


//Listar Perfil de Utilizador:

router.get("/perfil", isAuth, (req, res) => {

    let sql =  `Select Nome, email, dataNascimento, genero from Utilizador
                Where idUtilizador = "${req.userId}";`

    data.query(sql)
        .then( async re => {
            if (re.length != 0) {
                re[0].dataNascimento = re[0].dataNascimento.toLocaleDateString();
                res.send(re);
            }
        })
        .catch(e => { res.status(502).jsonp({ error: e }) })
    
})

// Listar Dados DO USER

// Listar favoritos
router.get("/torneiosFavoritos", isAuth, (req, res) => {

    let sql =  `Select * from Torneio as T
                Join TorneiosFav as TF on TF.Torneio_idTorneio = T.idTorneio
                Where TF.Utilizador_idUtilizador = "${req.userId}";`

    data.query(sql)
        .then( async re => {
            if(re.length == 0) {
                res.status(503).jsonp("Não tem nenhum torneio Favorito")
            } else {
                res.send(re);
            }
        })
        .catch(e => { res.status(502).jsonp({ error: e }) })
    
})


// Listar histórico Torneios Utilizador
router.get("/torneiosHistorico", isAuth, (req, res) => {

    let sql =  `Select * from Torneio as T
                Join Torneio_has_Equipa as TE on TE.Torneio_idTorneio = T.idTorneio
                Join Equipa_has_Utilizador as EU on TE.Equipa_idEquipa = EU.Equipa_idEquipa
                Where EU.Utilizador_idUtilizador = "${req.userId}"
                AND T.terminado = 1;`

    data.query(sql)
        .then( async re => {
            if(re.length == 0) {
                res.status(503).jsonp("Não esteve inscrito em nenhum torneio")
            } else {
                res.send(re);
            }
        })
        .catch(e => { res.status(502).jsonp({ error: e }) })
    
})

// Listar histórico Jogos Utilizador
router.get("/jogosHistorico", isAuth, (req, res) => {

    let sql =  `Select * from Jogo as J
                Where J.idOponente1 = "${req.userId}"
                OR    J.idOponente2 = "${req.userId}" ;`

    data.query(sql)
        .then( async re => {
            if(re.length == 0) {
                res.status(503).jsonp("Não possui jogos em que esteve presente")
            } else {
                res.send(re);
            }
        })
        .catch(e => { res.status(502).jsonp({ error: e }) })
    
})

// Notificações
router.get("/notificacoes", isAuth, (req, res) => {

    let sql =  `Select N.Titulo, UN.Lido, N.Torneio_idTorneio from Notificacao as N
                Join Utilizador_has_Notificacao as UN on UN.Notificacao_idNotificacao = N.idNotificacao
                WHERE UN.Utilizador_idUtilizador = "${req.userId}"; `

    data.query(sql)
        .then( async re => {
            if(re.length == 0) {
                res.status(503).jsonp("Não possui notificações")
            } else {
                res.send(re);
            }
        })
        .catch(e => { res.status(502).jsonp({ error: e }) })
    
})


// Editar Perfil Utilizador

// Inscrição num torneio por parte do User

// Upload de imagens

// Adicionar favoritos (local, desporto, torneio)
router.post("/addFavorito", isAuth, (req, res) => {

    let sql = ""

    //Filtro de Local
    if(req.query.localidade != null){
        if(!isNaN(req.query.localidade)){
            sql = `Insert into localFav values ("${req.query.localidade}", "${req.userId}");`      
        }
    }

    //Filtro de Torneio
    else if(req.query.torneio != null){
        if(!isNaN(req.query.torneio)){
            sql = `Insert into TorneiosFav values (${req.query.torneio}, ${req.userId});`      
        }
    }

    //Filtro de Desporto
    else if(req.query.desporto != null){
        if(!isNaN(req.query.desporto)){
            sql = `Insert into DesportosFav (Desporto_idDesporto, Utilizador_idUtilizador) values (${req.query.desporto}, ${req.userId});`      
        }
    }

    data.query(sql)
        .then( async re => {
            if(re.length == 0) {
                res.status(503).jsonp("Não foi possível adicionar favorito")
            } else {
                res.send(re);
            }
        })
        .catch(e => { res.status(502).jsonp({ error: e }) })
    
})

// Remover favoritos (local, desporto, torneio)
router.delete("/removeFavorito", isAuth, (req, res) => {

    let sql = ""

    //Filtro de Local
    if(req.query.localidade != null){
        if(!isNaN(req.query.localidade)){
            sql =  `Delete from localFav
                    Where Localidade_idLocalidade = ${req.query.localidade} 
                    And Utilizador_idUtilizador = ${req.userId} ;`         
        }
    }

    //Filtro de Torneio
    else if(req.query.torneio != null){
        if(!isNaN(req.query.torneio)){ 
            sql =  `Delete from TorneiosFav
                    Where Torneio_idTorneio = ${req.query.torneio} 
                    And Utilizador_idUtilizador = ${req.userId} ;`       
        }
    }

    //Filtro de Desporto
    else if(req.query.desporto != null){
        if(!isNaN(req.query.desporto)){
            sql =  `Delete from DesportosFav
                    Where Desporto_idDesporto = ${req.query.desporto} 
                    And Utilizador_idUtilizador = ${req.userId} ;`      
        }
    }

    data.query(sql)
        .then( async re => {
            if(re.length == 0) {
                res.status(503).jsonp("Não foi possível remover favorito")
            } else {
                res.send(re);
            }
        })
        .catch(e => { res.status(502).jsonp({ error: e }) })
    
})


module.exports = router