const { application } = require('express');
const express= require('express');
const router = express.Router();
const data = require('../query.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {isAuth} = require('./auth');
const dotenv = require('dotenv');
const multer = require('multer');

const {S3Client, PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} =  require ("@aws-sdk/s3-request-presigner");

dotenv.config()

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
  })

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

//Imprimir todos os utilizadores
router.get("/", (req, res) => {
    let sql = "Select * from utilizador;"
    data.query(sql).then(re => {
        re.map((r) => r.dataNascimento = r.dataNascimento.toLocaleDateString())
        res.send(JSON.stringify(re))
    })
})

//Imprimir todas as localidades
router.get("/allLocalidades", (req, res) => {
    let sql = "Select idLocalidade, Nome from Localidade;"
    data.query(sql)
        .then(re => { res.send(re) })
        .catch(e => { res.status(500).jsonp({ error: e }) })
})

//Imprimir todas as localidades favoritas
router.get("/localidadesFav", isAuth, (req, res) => {
    let sql = `Select L.Nome from Localidade as L
                JOIN localFav as LF on LF.Localidade_idLocalidade = L.idLocalidade
                WHERE LF.Utilizador_idUtilizador = ${req.userId};`
    data.query(sql)
        .then(re => { res.send(re) })
        .catch(e => { res.status(500).jsonp({ error: e }) })
})

//Imprimir todos os desportos
router.get("/allDesportos", (req, res) => {
    let sql = "Select idDesporto, nomeDesporto from Desporto;"
    data.query(sql)
        .then(re => { res.send(re) })
        .catch(e => { res.status(500).jsonp({ error: e }) })
})

//Imprimir todos os desportos favoritos
router.get("/desportosFav", isAuth, (req, res) => {
    let sql = `Select D.nomeDesporto from Desporto as D
                JOIN DesportosFav as DF on DF.Desporto_idDesporto = D.idDesporto
                WHERE DF.Utilizador_idUtilizador = ${req.userId};`
    data.query(sql)
        .then(re => { res.send(re) })
        .catch(e => { res.status(500).jsonp({ error: e }) })
})

//Registo de um utilizador 
router.post("/registo", upload.single('fotoPerfil'), (req, res) => {

    let sql = `Select * from utilizador WHERE email = "${req.body.email}";`

    data.query(sql)
        .then( async re => {
            if(re.length == 0) {
                hashedPass = await bcrypt.hash(req.body.password, 10)

                let sql = `Insert into utilizador (Nome, email, password, dataNascimento, genero) 
                    values ("${req.body.nome}", "${req.body.email}", "${hashedPass}", "${req.body.dataNascimento}", "${req.body.genero}")`
                data.query(sql)
                    .then(async re => {
                        
                        if (!(req.file === undefined)) {
                            const fileName = "profile"+re.insertId
    
                            const params = {
                                Bucket: bucketName,
                                Body: req.file.buffer,
                                Key: fileName,
                                ContentType: req.file.mimetype
                            }
    
                            await s3Client.send(new PutObjectCommand(params))

                            let sql = `Update utilizador Set imageName='${fileName}' Where idUtilizador = ${re.insertId};`

                            data.query(sql)
                                .then(re => {
                                    res.send("Utilizador registado com sucesso")
                                }) 
                                .catch (e => { res.status(400).jsonp({ error: e }) })

                        } else {
                            res.send("Utilizador registado com sucesso")
                        }

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

    let sql =  `Select Nome, email, dataNascimento, genero, imageName from Utilizador
                Where idUtilizador = "${req.userId}";`

    data.query(sql)
        .then( async re => {
            if (re.length != 0) {

                if (!(re[0].imageName === null)) {
                    const params = {
                        Bucket: bucketName,
                        Key: re[0].imageName
                    }
    
                    const command = new GetObjectCommand(params);
                    const url = await getSignedUrl(s3Client, command, {expiresIn: 60}) 
                    re[0]["imageUrl"] = url
                } else {
                    re[0]["imageUrl"] = null
                }

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

    let sql =  `Select N.Titulo, N.idNotificacao, UN.Lido, N.Torneio_idTorneio from Notificacao as N
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

// Change notification viewed
router.post("/notificacaoVista", isAuth, (req, res) => {

    let sql = `Update Utilizador_has_Notificacao Set Lido=1 Where Utilizador_idUtilizador = ${req.userId} AND Notificacao_idNotificacao = ${req.body.idNotificacao};`

    data.query(sql)
        .then( async re => {
            res.send(re);
        })
        .catch(e => { res.status(502).jsonp({ error: e }) })
    
})

// Editar Perfil Utilizador

// Trocar de fotografia
router.post("/changePicture", upload.single('fotoPerfil'), isAuth, async (req, res) => {

    const fileName = "profile"+req.userId
    
    const params = {
        Bucket: bucketName,
        Body: req.file.buffer,
        Key: fileName,
        ContentType: req.file.mimetype
    }

    await s3Client.send(new PutObjectCommand(params))

    let sql = `Update utilizador Set imageName='${fileName}' Where idUtilizador = ${req.userId};`

    data.query(sql)
        .then(async re => {
            const params = {
                Bucket: bucketName,
                Key: fileName
            }

            const command = new GetObjectCommand(params);
            const url = await getSignedUrl(s3Client, command, {expiresIn: 60}) 
            res.send(url)
        }) 
        .catch (e => { res.status(400).jsonp({ error: e }) })
})

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
        .catch(e => { 
            console.log(e)
            res.status(502).jsonp({ error: e }) })
    
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