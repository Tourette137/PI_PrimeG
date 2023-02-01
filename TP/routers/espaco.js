const express = require('express');
const router = express.Router();
const data = require('../query.js')
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


// Vai buscar os espaços favoritos para um desporto específico numa localidade
router.get("/desporto/:id",(req,res) => {
    const idDesporto = req.params.id;
    const idLocalidade = req.query.localidade;
    let sql = "select * from espaco join Desporto_Has_Espaco as de on de.idEspaco = espaco.idEspaco where de.idDesporto = " + idDesporto
            + " and espaco.favorito = 1 and espaco.Localidade_idLocalidade = "+ idLocalidade +";";
    data.query(sql).then(async re => {
        if(re.length != 0){
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
            res.send(re);
        }
        else {
            res.status(404).send("Não existem espaços disponíveis para esse desporto");
        }
    });
})



// Vai buscar os espaços disponiveis
router.get("/disponiveis",(req,res) => {
    let sql = "select * from espaco as esp join Desporto_Has_Espaco as de on de.idEspaco = esp.idEspaco"
    sql += " join localidade as l on l.idLocalidade = esp.Localidade_idLocalidade "
    sql += " join desporto as d on d.idDesporto = de.idDesporto"
    //Filtro de Localidade
    if(req.query.localidade != null){
          if(!isNaN(req.query.localidade)){
                if(!isNaN(req.query.desporto)){
                        sql += " where de.idDesporto = " + req.query.desporto;
                }
                sql += " and esp.Localidade_idLocalidade = " + req.query.localidade;
          }
    }

    //Filtro de Desporto
    else if(req.query.desporto != null)
            if(!isNaN(req.query.desporto)){
                sql += " where de.idDesporto = " + req.query.desporto;
            }

    sql += ";";
    data.query(sql).then(async re => {
        if(re.length != 0){
            for (let i=0;i<re.length;i++) {
                let r = re[i];
                if (!(r.imageName === null)) {

                    const params = {
                        Bucket: bucketName,
                        Key: r.imageName
                    }
    
                    const command = new GetObjectCommand(params);
                    const url = await getSignedUrl(s3Client, command, {expiresIn: 60});
                    r.imageUrl = url
                } else {
                    r.imageUrl = null
                }
            }
            res.send(re);
        }
        else {
            res.status(404).send("Não existem espaços disponíveis para esse desporto");
        }
    });
})

// Vai buscar os espaços favoritos
router.get("/favoritos",(req,res) => {
    let sql = "select * from espaco join Desporto_Has_Espaco as de on de.idEspaco = espaco.idEspaco"
    sql += " join localidade as l on l.idLocalidade = espaco.Localidade_idLocalidade "
    sql += " join desporto as d on d.idDesporto = de.idDesporto "
    sql += "where espaco.favorito = 1"

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
    data.query(sql).then(async re => {
        if(re.length != 0){
            for (let i=0;i<re.length;i++) {
                let r = re[i];
                if (!(r.imageName === null)) {

                    const params = {
                        Bucket: bucketName,
                        Key: r.imageName
                    }
    
                    const command = new GetObjectCommand(params);
                    const url = await getSignedUrl(s3Client, command, {expiresIn: 60});
                    r.imageUrl = url
                } else {
                    r.imageUrl = null
                }
            }
            res.send(re);
        }
        else {
            res.status(404).send("Não existem espaços disponíveis para esse desporto");
        }
    });
})

router.get("/:id",(req,res) => {
    const id = req.params.id;
    let sql = "select e.imageName,e.nome,e.idEspaco,e.rua,e.contacto,d.nomeDesporto,de.numeroMesas,l.nome as localidade from espaco as e"+
              " join Desporto_Has_Espaco as de on de.idEspaco = e.idEspaco"+
              " join Desporto as d on d.idDesporto = de.idDesporto"+
              " join Localidade as l on l.idLocalidade = e.Localidade_idLocalidade where e.idEspaco = " + id
              + ";";
    data.query(sql).then(async re => {
        if(re.length != 0){
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
            res.send(re);
        }
        else {
            res.status(404).send("Não existem espaços disponíveis para esse desporto");
        }
    });
})




router.post("/registoNFavorito",isAuth,upload.single('fotoEspaco'),(req,res) => {
    let sql = `insert into espaco (nome, rua, contacto, Utilizador_idUtilizador, Localidade_idLocalidade, Favorito) values( "${req.body.nome}","${req.body.rua}","${req.body.contacto}",${req.userId},${req.body.localidade},0);`
    data.query(sql).then(async re => {
        if (!(req.file === undefined)) {
            const fileName = "Espaco"+re.insertId

            const params = {
                Bucket: bucketName,
                Body: req.file.buffer,
                Key: fileName,
                ContentType: req.file.mimetype
            }

            await s3Client.send(new PutObjectCommand(params))

            let sql = `Update Espaco Set imageName='${fileName}' Where idEspaco = ${re.insertId};`
            sql += `insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values (${req.body.desporto},${re.insertId},${req.body.nMesas});`

            data.query(sql)
                .then(re1 => {
                    res.send({idEspaco: re.insertId})

                }) 
                .catch (e => { res.status(400).jsonp({ error: e }) })

        } else {
            let sql = `insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values (${req.body.desporto},${re.insertId},${req.body.nMesas});`

            data.query(sql)
                .then(re1 => {
                    res.send({idEspaco: re.insertId})

                }) 
                .catch (e => { res.status(400).jsonp({ error: e }) })
        }
    })
})

// Registar o espaço como favorito
router.post("/registarEspaco",isAuth,upload.single('fotoEspaco'),(req,res) => {
    let sql = `insert into espaco (nome, rua, contacto, Utilizador_idUtilizador, Localidade_idLocalidade, Favorito) values( "${req.body.nome}","${req.body.rua}","${req.body.contacto}",${req.userId},${req.body.localidade},1);`
    data.query(sql).then(async re => {
        if (!(req.file === undefined)) {
            const fileName = "Espaco"+re.insertId

            const params = {
                Bucket: bucketName,
                Body: req.file.buffer,
                Key: fileName,
                ContentType: req.file.mimetype
            }

            await s3Client.send(new PutObjectCommand(params))

            let sql = `Update Espaco Set imageName='${fileName}' Where idEspaco = ${re.insertId};`
            sql += `insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values (${req.body.desporto},${re.insertId},${req.body.nMesas});`

            data.query(sql)
                .then(re1 => {
                    res.send("Espaco Registado com sucesso!")

                }) 
                .catch (e => { res.status(400).jsonp({ error: e }) })

        } else {
            let sql = `insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values (${req.body.desporto},${re.insertId},${req.body.nMesas});`

            data.query(sql)
                .then(re1 => {
                    res.send("Espaco Registado com sucesso!")

                }) 
                .catch (e => { res.status(400).jsonp({ error: e }) })
        }
    })
})

router.get("/espacoByLocal/:idLocalidade",(req,res) => {
    var localidade = req.params.idLocalidade;
    let sql = "select * from espaco where Localidade_idLocalidade = "+ localidade +";";
    data.query(sql).then(async re => {
        if(re.length != 0){
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
            res.send(re);
        }
        else {
            res.status(404).send("Não existem espaços disponíveis");
        }
    });
})

module.exports = router
