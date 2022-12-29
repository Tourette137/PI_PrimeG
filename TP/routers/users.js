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
                res.status(500).jsonp("User já existe!")
            }
        })
        .catch(e => { res.status(500).jsonp({ error: e }) })
        
})


//Login de um Utilizador
router.post("/login", (req, res) => {

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
                Where EU.Utilizador_idUtilizador = "${req.userId}";`

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

//Listar Perfil de Utilizador

// Listar histórico Torneios Utilizador

// Listar histórico Jogos Utilizador

// Listar Dados DO USER

// Editar Perfil Utilizador

// Inscrição num torneio por parte do User

// Adicionar favoritos (local, desporto, torneio)

// Upload de imagens

// Notificações



module.exports = router