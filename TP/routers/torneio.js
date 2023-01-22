const express = require('express');
const router = express.Router();
const data = require('../query.js')
const {isAuth, isOrganizador} = require('./auth');
const algoritmos = require('../algoritmos.js')

//0 - por começar
//1 - a decorrer
//2 - encerrado
router.get("/:id/jogosEncerrados", (req,res) => {
    const idTorneio = parseInt(req.params.id);
    const filtro = req.query.filtro;
    //tirar apenas os jogos encerrados do torneio
    let sql = "select tipoTorneio from Torneio where idTorneio = " + idTorneio + ";"
    data.query(sql).then(re => {
        if(re.length!=0){
            getJogosEstadoTorneio(parseInt(re[0].tipoTorneio),2,idTorneio,filtro,res);
        }
        else {
            res.status(404).send("O torneio não existe");
        }
    });
});

router.get("/:id/jogosPorComecar", (req,res) => {
    const idTorneio = parseInt(req.params.id);
    const filtro = req.query.filtro;

    //tirar apenas os jogos por começar do torneio
    let sql = "select tipoTorneio from Torneio where idTorneio = " + idTorneio + ";"
    data.query(sql).then(re => {
        if(re.length!=0){
            getJogosEstadoTorneio(parseInt(re[0].tipoTorneio),0,idTorneio,filtro,res);
        }
        else {
            res.status(404).send("O torneio não existe");
        }
    });
});

//lista de jogos a decorrer de um torneio
router.get("/:id/jogosaDecorrer",(req,res) =>{
    const idTorneio = parseInt(req.params.id);
    const filtro = req.query.filtro;

    let sql = "select tipoTorneio from Torneio where idTorneio = " + idTorneio + ";";
    data.query(sql).then(re => {
        if(re.length!=0){
            getJogosEstadoTorneio(parseInt(re[0].tipoTorneio),1,idTorneio,filtro,res);
        }
        else {
            res.status(404).send("O torneio não existe");
        }
    });
})

function getJogosEstadoTorneio (tipoTorneio, estado, idTorneio, filtro, res){
    let sql = "";
    switch(tipoTorneio) {
        case 0: case 3: //enviar os jogos dos torneio que só possuem grupos
            if(filtro != null && filtro === "Eliminatorias"){
                break;
            }
            else {
                sql = "select * from Jogo as J join Grupo as G on J.Grupo_idGrupo = G.idGrupo " +
                        "join FaseGrupos as FG on G.FaseGrupos_idFaseGrupos = FG.idFaseGrupos " +
                        "where FG.Torneio_idTorneio = " + idTorneio + " and J.estado = " + estado + ";";

                data.query(sql).then(re => {
                    res.send(re);
                });
            }
            break;
        case 1: case 4: //enviar os jogos dos torneio que só têm eliminatórias
            if(filtro != null && filtro === "FaseGrupos"){
                break;
            }
            else {
                sql = "select * from Jogo as J " +
                      "join Etapa as E on J.idEtapa = E.idEtapa " +
                      "join Eliminatoria as EL on E.Eliminatoria_idEliminatoria = EL.idEliminatoria " +
                      "where EL.Torneio_idTorneio = " + idTorneio + " and J.estado = " + estado + ";";
                data.query(sql).then(re => {
                    res.send(re);
                });
            }
            break;
        case 2: case 5: case 6: case 7: //enviar os jogos dos torneios que têm grupos e eliminatórias
            if(filtro != null){
                if (filtro === "FaseGrupos") {
                    sql = "select *, T.tipoTorneio from Jogo as J join Grupo as G on J.Grupo_idGrupo = G.idGrupo " +
                          "join FaseGrupos as FG on G.FaseGrupos_idFaseGrupos = FG.idFaseGrupos " +
                          "join Torneio as T on T.idTorneio = FG.Torneio_idTorneio " +
                          "where T.idTorneio = " + idTorneio + " and J.estado = " + estado + ";";
                    data.query(sql).then(re => {
                        res.send(re);
                    })
                    break;
                }
                else if(filtro === "Eliminatorias") {
                    sql = "select *, T.tipoTorneio from Jogo as J  " +
                          "join Etapa as E on J.idEtapa = E.idEtapa " +
                          "join Eliminatoria as EL on E.Eliminatoria_idEliminatoria = EL.idEliminatoria " +
                          "join Torneio as T on T.idTorneio = EL.Torneio_idTorneio " +
                          "where T.idTorneio = " + idTorneio + " and J.estado = " + estado + ";";
                    data.query(sql).then(re => {
                        res.send(re);
                    })
                    break;
                }
                else {
                    sql = "select *, T.tipoTorneio from Jogo as J join Grupo as G on J.Grupo_idGrupo = G.idGrupo " +
                          "join FaseGrupos as FG on G.FaseGrupos_idFaseGrupos = FG.idFaseGrupos " +
                          "join Torneio as T on T.idTorneio = FG.Torneio_idTorneio " +
                          "where T.idTorneio = " + idTorneio + " and J.estado = " + estado + ";";

                    data.query(sql).then(re => {
                        let sql1 = "select *, T.tipoTorneio from Jogo as J " +
                                    "join Etapa as E on J.idEtapa = E.idEtapa " +
                                    "join Eliminatoria as EL on E.Eliminatoria_idEliminatoria = EL.idEliminatoria " +
                                    "join Torneio as T on T.idTorneio = EL.Torneio_idTorneio " +
                                    "where T.idTorneio = " + idTorneio + " and J.estado = " + estado + ";";
                        data.query(sql1).then(re1 => {
                            var result = re.concat(re1);
                            res.send(JSON.stringify(result));
                        })
                    });
                }
            }
            else {
                sql = "select *, T.tipoTorneio from Jogo as J join Grupo as G on J.Grupo_idGrupo = G.idGrupo " +
                "join FaseGrupos as FG on G.FaseGrupos_idFaseGrupos = FG.idFaseGrupos " +
                "join Torneio as T on T.idTorneio = FG.Torneio_idTorneio " +
                "where T.idTorneio = " + idTorneio + " and J.estado = " + estado + ";";

                data.query(sql).then(re => {
                    let sql1 = "select *,T.tipoTorneio from Jogo as J " +
                                "join Etapa as E on J.idEtapa = E.idEtapa " +
                                "join Eliminatoria as EL on E.Eliminatoria_idEliminatoria = EL.idEliminatoria " +
                                "join Torneio as T on T.idTorneio = EL.Torneio_idTorneio " +
                                "where T.idTorneio = " + idTorneio + " and J.estado = " + estado + ";";
                    data.query(sql1).then(re1 => {
                        var result = re.concat(re1);
                        res.send(JSON.stringify(result));
                    })
                });
            }
            break;
        default:
            console.log("default");
    }
}

//funcao utilizada para obter os jogos a decorrer de um dado torneio
function getJogosTorneio(terminado,idTorneio,res){
    //0 -> torneio por começar
    //1 -> torneio está a decorrer
    //2 -> torneio está terminado
    if (terminado == 1){
        //Verificar se a fase de grupos já terminou ou não
        let sql = "select terminado from FaseGrupos where Torneio_idTorneio = "  + idTorneio + ";";
        data.query(sql).then(re => {
            if(re.length!=0){//verificar se o torneio tem fase de grupos
                //1 -> fase de grupos terminada // BUSCAR JOGOS DAS ELIMINATORIAS
                if(re[0].terminado == 1) {
                    sql = "select * from Jogo as J  " +
                                                "join Etapa as E on J.idEtapa = E.idEtapa " +
                                                "join Eliminatoria as EL on E.Eliminatoria_idEliminatoria = EL.idEliminatoria " +
                                                "where EL.Torneio_idTorneio = " + idTorneio + " and J.estado = 1 and EL.gerado = 1;";
                    data.query(sql).then(re => {
                        re.map ((r) => {
                            r.hora = r.hora.toLocaleString();
                        })
                        res.send(re);
                    });
                }
                //0 -> fase de grupos a decorrer // BUSCAR JOGOS DA FASE DE GRUPOS
                else{
                    sql = " select * from Jogo as J join Grupo as G on J.Grupo_idGrupo = G.idGrupo " +
                                                    "join FaseGrupos as FG on G.FaseGrupos_idFaseGrupos = FG.idFaseGrupos " +
                                                    "where FG.Torneio_idTorneio = " + idTorneio + " and J.estado = 1;";
                    data.query(sql).then(re => {
                        re.map ((r) => {
                            r.hora = r.hora.toLocaleString();
                        })
                        res.send(re);
                    });
                }
            }
            else {//não existe fase de grupos // BUSCAR JOGOS DAS ELIMINATORIAS
                sql = "select * from Jogo as J " +
                                    "join Etapa as E on J.idEtapa = E.idEtapa " +
                                    "join Eliminatoria as EL on E.Eliminatoria_idEliminatoria = EL.idEliminatoria " +
                                    "where EL.Torneio_idTorneio = " + idTorneio + " and J.estado = 1;";
                data.query(sql).then(re => {
                    re.map ((r) => {
                        r.hora = r.hora.toLocaleString();
                    })
                    res.send(re);
                });
            }
        });
    }
    //torneio está terminado ou por começar
    else {
        res.status(404).send("Não existem jogos a decorrer.");
    }

}


//Listar torneios disponiveis
//?federado=...&desporto=...&localidade=...
router.get("/disponiveis",(req,res) => {
    //0 -> inscricoes fechadas
    //1 -> inscricoes abertas
    let sql = "select T.idTorneio,T.nomeTorneio,T.isFederado,T.dataTorneio,T.escalao,T.tipoTorneio,T.tamEquipa,D.nomeDesporto,L.Nome from torneio as T " +
              "join Espaco as E on T.Espaco_idEspaco = E.idEspaco " +
              "join Localidade as L on E.Localidade_idLocalidade = L.idLocalidade " +
              "join Desporto as D on T.idDesporto = D.idDesporto "

    //Filtro de Localidade
    if(req.query.localidade != null){
        if(!isNaN(req.query.localidade)){
            sql += " where T.inscricoesAbertas = 1 and idLocalidade = " + req.query.localidade;

        }
        else {sql += " where T.inscricoesAbertas = 1 " }
    }
    else {
        sql += " where T.inscricoesAbertas = 1 "
    }

    //Filtro de Federado
    if(req.query.federado != null){
        if(!isNaN(req.query.federado)){
            sql += " and T.isFederado = " + req.query.federado;
        }
    }
    //Filtro de Desporto
    if(req.query.desporto != null){
        if(!isNaN(req.query.desporto)){
            sql += " and T.idDesporto = " + req.query.desporto;
        }
    }

    sql += ";";
    data.query(sql).then(re => {
        if(re.length != 0){
            re.map((r) => {
                r.dataTorneio = r.dataTorneio.toLocaleDateString();
                switch (r.tipoTorneio) {
                    case 0: r.nometipoTorneio = "Liga"
                        break;
                    case 1: r.nometipoTorneio = "Torneio de Eliminatórias"
                        break;
                    case 2: r.nometipoTorneio = "Torneio com fase de grupos e eliminatórias";
                        break;
                    case 3: r.nometipoTorneio = "Liga com duas mãos";
                        break;
                    case 4: r.nometipotorneio = "Torneio de Eliminatórias com duas mãos";
                        break;
                    case 5: r.nometipoTorneio = "Torneio com fase de grupos com duas mãos e eliminatórias";
                        break;
                    case 6: r.nometipoTorneio = "Torneio com fase de grupos e eliminatórias com duas mãos";
                        break;
                    case 7: r.nometipoTorneio = "Torneio com fase de grupos e eliminatórias, ambos com duas mãos";
                        break;
                    default: console.log("default");
                }
            })
            res.send(re);
        }
        else {
            res.status(404).send("Não existem torneios disponíveis");
        }
    });
});

//Listar torneios encerrados
router.get("/encerrados",(req,res) => {
    //0 -> inscricoes abertas
    //1 -> inscricoes fechadas
    let sql = "select T.idTorneio,T.nomeTorneio,T.isFederado,T.dataTorneio,T.escalao,T.tipoTorneio,T.tamEquipa,D.nomeDesporto,L.Nome from torneio as T " +
              "join Espaco as E on T.Espaco_idEspaco = E.idEspaco " +
              "join Localidade as L on E.Localidade_idLocalidade = L.idLocalidade " +
              "join Desporto as D on T.idDesporto = D.idDesporto "

    //Filtro de Localidade
    if(req.query.localidade != null){
        if(!isNaN(req.query.localidade)){
            sql += " where T.terminado = 2 and idLocalidade = " + req.query.localidade;

        }
        else {sql += " where T.terminado = 2 " }
    }
    else {
        sql += " where T.terminado = 2 "
    }

    //Filtro de Federado
    if(req.query.federado != null){
        if(!isNaN(req.query.federado)){
            sql += " and T.isFederado = " + req.query.federado;
        }
    }
    //Filtro de Desporto
    if(req.query.desporto != null){
        if(!isNaN(req.query.desporto)){
            sql += " and T.idDesporto = " + req.query.desporto;
        }
    }

    sql += ";";
    data.query(sql).then(re => {
        if(re.length != 0){
            re.map((r) => {
                r.dataTorneio = r.dataTorneio.toLocaleDateString();
                switch (r.tipoTorneio) {
                    case 0: r.nometipoTorneio = "Liga"
                        break;
                    case 1: r.nometipoTorneio = "Torneio de Eliminatórias"
                        break;
                    case 2: r.nometipoTorneio = "Torneio com fase de grupos e eliminatórias";
                        break;
                    case 3: r.nometipoTorneio = "Liga com duas mãos";
                        break;
                    case 4: r.nometipoTorneio = "Torneio de Eliminatórias com duas mãos";
                        break;
                    case 5: r.nometipoTorneio = "Torneio com fase de grupos com duas mãos e eliminatórias";
                        break;
                    case 6: r.nometipoTorneio = "Torneio com fase de grupos e eliminatórias com duas mãos";
                        break;
                    case 7: r.nometipoTorneio = "Torneio com fase de grupos e eliminatórias, ambos com duas mãos";
                        break;
                    default: console.log("default");
                }
            })
            res.send(re);
        }
        else {
            res.status(404).send("Não existem torneios disponíveis");
        }
    });
});

//Listar torneios a decorrer
router.get("/aDecorrer",(req,res) => {
    //0 -> inscricoes abertas
    //1 -> inscricoes fechadas
    let sql = "select T.idTorneio,T.nomeTorneio,T.isFederado,T.dataTorneio,T.escalao,T.tipoTorneio,T.tamEquipa,D.nomeDesporto,L.Nome from torneio as T " +
              "join Espaco as E on T.Espaco_idEspaco = E.idEspaco " +
              "join Localidade as L on E.Localidade_idLocalidade = L.idLocalidade " +
              "join Desporto as D on T.idDesporto = D.idDesporto "

    //Filtro de Localidade
    if(req.query.localidade != null){
        if(!isNaN(req.query.localidade)){
            sql +=  " where T.terminado = 1 and idLocalidade = " + req.query.localidade;

        }
        else {sql += " where T.terminado = 1 " }
    }
    else {
        sql += " where T.terminado = 1 "
    }

    //Filtro de Federado
    if(req.query.federado != null){
        if(!isNaN(req.query.federado)){
            sql += " and T.isFederado = " + req.query.federado;
        }
    }
    //Filtro de Desporto
    if(req.query.desporto != null){
        if(!isNaN(req.query.desporto)){
            sql += " and T.idDesporto = " + req.query.desporto;
        }
    }

    sql += ";";
    data.query(sql).then(re => {
        if(re.length != 0){
            re.map((r) => {
                r.dataTorneio = r.dataTorneio.toLocaleDateString();
                switch (r.tipoTorneio) {
                    case 0: r.nometipoTorneio = "Liga"
                        break;
                    case 1: r.nometipoTorneio = "Torneio de Eliminatórias"
                        break;
                    case 2: r.nometipoTorneio = "Torneio com fase de grupos e eliminatórias";
                        break;
                    case 3: r.nometipoTorneio = "Liga com duas mãos";
                        break;
                    case 4: r.nometipotorneio = "Torneio de Eliminatórias com duas mãos";
                        break;
                    case 5: r.nometipoTorneio = "Torneio com fase de grupos com duas mãos e eliminatórias";
                        break;
                    case 6: r.nometipoTorneio = "Torneio com fase de grupos e eliminatórias com duas mãos";
                        break;
                    case 7: r.nometipoTorneio = "Torneio com fase de grupos e eliminatórias, ambos com duas mãos";
                        break;
                    default: console.log("default");
                }
            })
            res.send(re);
        }
        else {
            res.status(404).send("Não existem torneios disponíveis");
        }
    });
});

router.get("/:id/calendario/grupos", (req,res) => {
    const idTorneio = req.params.id;
    let sql = "select tipoTorneio from Torneio where idTorneio = " + idTorneio + ";";
    data.query(sql).then(re => {
        if(re.length!=0){
            if (re[0].tipoTorneio !== 1 && re[0].tipoTorneio !== 4) {
                getCalendarioGrupos(idTorneio,res);
            }
            else{
                res.status(400).send("O torneio não contém grupos.")
            }
        }
        else {
            res.status(404).send("O torneio não existe.");
        }
    });
});

function getCalendarioGrupos(idTorneio,res) {
    let sql = "select J.idJogo,G.numeroGrupo,J.hora,J.ronda,J.numeroCampo from Grupo as G " +
              "join FaseGrupos as FG on G.faseGrupos_idFaseGrupos = FG.idFaseGrupos " +
              "join Torneio as T on T.idTorneio = FG.Torneio_idTorneio " +
              "join Jogo as J on J.Grupo_idGrupo = G.idGrupo " +
              "where idTorneio = " + idTorneio + ";"
    data.query(sql).then(re => {
        if(re.length != 0) {
            grupos = []
            re.map((r) => {
                let jogos = [];
                let index = grupos.map(g => g.numero).indexOf(r.numeroGrupo);
                if (index == -1){
                  grupos.push({tipo:1,numero:r.numeroGrupo, jogos:[]});
                  index = grupos.map(g => g.numero).indexOf(r.numeroGrupo);
                }
                grupos[index].jogos.push({hora:r.hora,ronda:r.ronda,campo:r.numeroCampo})
            })
            res.send(grupos);
        }
        else {
            res.status(404).send("Calendario não encontrado")
        }
    });
}

router.get("/:id/SorteioElim", (req,res) => {
    const idTorneio = req.params.id;
    let sql = "select gerado from Eliminatoria as E where E.Torneio_idTorneio = " + idTorneio + ";";
    data.query(sql).then(re => {
        if(re.length!=0){
            res.send({gerado:re[0].gerado})
        }
        else {
            res.status(404).send("erro");
        }
    });
});

router.get("/:id/calendario/eliminatorias", (req,res) => {
    const idTorneio = req.params.id;
    let sql = "select tipoTorneio from Torneio where idTorneio = " + idTorneio + ";";
    data.query(sql).then(re => {
        if(re.length!=0){
            if (re[0].tipoTorneio !== 1 && re[0].tipoTorneio !== 4) {
                getCalendarioElim(idTorneio,res);
            }
            else{
                res.status(400).send("O torneio não contém grupos.")
            }
        }
        else {
            res.status(404).send("O torneio não existe.");
        }
    });
});

function getCalendarioElim(idTorneio,res) {
    let sql = "select J.idJogo,E.nomeEtapa,E.numeroEtapa,J.hora,J.ronda,J.numeroCampo from Etapa as E " +
              "join Eliminatoria as El on El.idEliminatoria = E.Eliminatoria_idEliminatoria " +
              "join Torneio as T on T.idTorneio = El.Torneio_idTorneio " +
              "join Jogo as J on J.idEtapa = E.idEtapa " +
              "where idTorneio = " + idTorneio + ";"
    data.query(sql).then(re => {
        if(re.length != 0) {
            etapas = []
            re.map((r) => {
                let jogos = [];
                let index = etapas.map(e => e.numero).indexOf(r.numeroEtapa);
                if (index == -1){
                  etapas.push({tipo:2,numero:r.numeroEtapa,nome:r.nomeEtapa, jogos:[]});
                  index = etapas.map(g => g.numero).indexOf(r.numeroEtapa);
                }
                etapas[index].jogos.push({hora:r.hora,campo:r.numeroCampo,ronda:r.ronda})
            })
            res.send(etapas);
        }
        else {
            res.status(404).send("Calendario não encontrado")
        }
    });
}


/* Tipo do torneio
0 - grupo (liga)
1 - eliminatórias
2 - ambos
3 - grupos duas mãos
4 - eliminatórias duas mãos
5 - ambos (grupos 2 mãos)
6 - ambos (elim 2 mãos)
7 - ambos (ambos 2 mãos)
*/

//Classificação dos grupos de um torneio.
router.get("/:id/classificacao/grupos", (req,res) => {
    const idTorneio = req.params.id;
    let sql = "select tipoTorneio from Torneio where idTorneio = " + idTorneio + ";";
    data.query(sql).then(re => {
        if(re.length!=0){
            if (re[0].tipoTorneio !== 1 && re[0].tipoTorneio !== 4) {
                getClassificacaoGrupo(idTorneio,res);
            }
            else{
                res.status(400).send("O torneio não contém grupos.")
            }
        }
        else {
            res.status(404).send("O torneio não existe.");
        }
    });
});

function getClassificacaoGrupo(idTorneio,res) {
    let sql = "select numeroGrupo,classificacaoGrupo from Grupo as G " +
              "join FaseGrupos as FG on G.faseGrupos_idFaseGrupos = FG.idFaseGrupos " +
              "join Torneio as T on T.idTorneio = FG.Torneio_idTorneio " +
              "where idTorneio = " + idTorneio + ";"
    data.query(sql).then(re => {
        if(re.length != 0) {
            re.map((r) => {
                let aux1 = [],aux3 = `${r.classificacaoGrupo}`.split(':');
                let aux2 = aux3[1].split('|');
                let tipoClassificacao = parseInt(aux3[0]);
                for (var i = 0; i< aux2.length; i++) {
                    aux1.push(aux2[i]);
                }
                r.classificacaoGrupo = aux1;
                r["tipoClassificacao"] = tipoClassificacao;
                aux1 = []
            })
            res.send(re);
        }
        else {
            res.status(404).send("Fase de grupos não encontrada")
        }
    });
}


//Classificacao das eliminatórias de um torneio
router.get("/:id/classificacao/eliminatorias", (req,res) => {
    const idTorneio = req.params.id;
    let sql = "select tipoTorneio from Torneio where idTorneio = " + idTorneio + ";";
    data.query(sql).then(re => {
        if(re.length!=0){
            if (re[0].tipoTorneio !== 0 && re[0].tipoTorneio !== 3) {
                getClassificacaoElim(idTorneio,res);
            }
            else{
                res.status(400).send("O torneio não contém eliminatórias.")
            }
        }
        else {
            res.status(404).send("O torneio não existe.");
        }
    });
});


function getClassificacaoElim(idTorneio,res) {
    let sql = "select E.nomeEtapa,J.mao,J.ronda,J.resultado,J.idOponente1,J.idOponente2,J.hora,J.numeroCampo from Eliminatoria as El " +
               "join Etapa as E on E.Eliminatoria_idEliminatoria=El.idEliminatoria " +
               "join Jogo as J on J.idEtapa=E.idEtapa " +
               "where El.Torneio_idTorneio = " + idTorneio + ";"

               data.query(sql).then(re => {
                    if (re.length != 0) {
                        let sql1 = ""
                        for (let i = 0; i<re.length; i++) {
                            if (re[i].idOponente1 != undefined) {
                                sql1 += `Select idEquipa,nomeEquipa from Equipa where idEquipa = ${re[i].idOponente1};`
                            }
                            if (re[i].idOponente2 != undefined) {
                                sql1 += `Select idEquipa,nomeEquipa from Equipa where idEquipa = ${re[i].idOponente2};`
                            }
                        }
                        if (sql1  != "") {
                            data.query(sql1).then(re1 => {
                                //Põe os nomes das equipas na resposta.
                                if (re1.length != 0) {
                                    re.map ((r) => {
                                        if (r.idOponente1 != undefined) {
                                            for (let i = 0; i< re1.length; i++) {
                                                if (r.idOponente1 == re1[i][0].idEquipa) {
                                                    r["nomeEquipa1"] = re1[i][0].nomeEquipa;
                                                    break;
                                                }
                                            }
                                        }
                                        if (r.idOponente2 != undefined) {
                                            for (let i = 0; i< re1.length; i++) {
                                                if (r.idOponente2 == re1[i][0].idEquipa) {
                                                    r["nomeEquipa2"] = re1[i][0].nomeEquipa;
                                                    break;
                                                }
                                            }
                                        }
                                        let hora = r.hora.getHours()
                                        let minutos =r.hora.getMinutes()
                                        r.hora = r.hora.toLocaleDateString() + ` ${hora}:${minutos}`;
                                    })
                                    let aux = -1;
                                    for (let i = 0; i< re.length; i++) {
                                        if (re[i].nomeEtapa == "Final" && re[i].mao == 2) {
                                            aux = i;
                                            break;
                                        }
                                    }
                                    if (aux != -1) {
                                        re.splice(aux,1);
                                    }
                                    res.send(re);
                                }
                                else {
                                    res.status(404).send("Erro ao encontrar as equipas")
                               }
                            })
                        }
                        //Remove a segunda mão da final
                        else {
                            let aux = -1;
                            for (let i = 0; i< re.length; i++) {
                                if (re[i].nomeEtapa == "Final" && re[i].mao == 2) {
                                    aux = i;
                                    break;
                                }
                            }
                            if (aux != -1) {
                                re.splice(aux,1);
                            }
                            re.map((r) => {
                                r.hora = r.hora.toLocaleDateString();
                            })
                            res.send(re);
                        }
                    }
                    else {
                        res.status(404).send("A eliminatória não foi encontrada!")
                    }
                })
}

//Get de um torneio
router.get("/:id",isOrganizador,(req,res) => {
    const idTorneio = req.params.id;
    let sql = "select T.idTorneio,T.nomeTorneio,T.terminado,T.isFederado,T.dataTorneio,T.escalao,T.tipoTorneio,T.tamEquipa,D.nomeDesporto,L.Nome, T.idOrganizador from torneio as T " +
              "join Espaco as E on T.Espaco_idEspaco = E.idEspaco " +
              "join Localidade as L on E.Localidade_idLocalidade = L.idLocalidade " +
              "join Desporto as D on T.idDesporto = D.idDesporto " +
              "where T.idTorneio = " + idTorneio + " ;"
    data.query(sql).then(re => {
        if (re.length != 0) {
            re.map((r) => {
                r.dataTorneio = r.dataTorneio.toLocaleDateString();
                switch (r.tipoTorneio) {
                    case 0: r.nometipoTorneio = "Liga"
                        break;
                    case 1: r.nometipoTorneio = "Torneio de Eliminatórias"
                        break;
                    case 2: r.nometipoTorneio = "Torneio com fase de grupos e eliminatórias";
                        break;
                    case 3: r.nometipoTorneio = "Liga com duas mãos";
                        break;
                    case 4: r.nometipotorneio = "Torneio de Eliminatórias com duas mãos";
                        break;
                    case 5: r.nometipoTorneio = "Torneio com fase de grupos com duas mãos e eliminatórias";
                        break;
                    case 6: r.nometipoTorneio = "Torneio com fase de grupos e eliminatórias com duas mãos";
                        break;
                    case 7: r.nometipoTorneio = "Torneio com fase de grupos e eliminatórias, ambos com duas mãos";
                        break;
                    default: console.log("default");
                }
            })
            re[0]["isOrganizador"] = (re[0].idOrganizador == req.userId);
            res.send(re[0]);

        }
        else {
            res.status(404).send("O Torneio não existe!");
        }
    })
})



//Inicializo com inscricoesAbertas a 1 (inscrições abertas) e com terminado a 0
router.post("/registo",isAuth,(req,res) => {
    console.log(req.body.dataTorneio)
    let sql = `Insert into torneio (nomeTorneio, idOrganizador, idDesporto, isFederado, dataTorneio,inscricoesAbertas,escalao,tipoTorneio,terminado,Espaco_idEspaco,tamEquipa)
                    values ("${req.body.nomeTorneio}",${req.userId}, ${req.body.idDesporto}, ${req.body.isFederado}, "${req.body.dataTorneio}", 1, ${req.body.escalao}, ${req.body.tipoTorneio}, 0, ${req.body.Espaco_idEspaco},${req.body.tamEquipa})`
        data.query(sql)
        .then(re => {
            let sql1 = `select t.idTorneio from torneio as t where t.nomeTorneio = "${req.body.nomeTorneio}" and t.idOrganizador= ${req.userId} and t.idDesporto =${req.body.idDesporto} and t.isFederado = ${req.body.isFederado} and t.dataTorneio = "${req.body.dataTorneio}"
                        and t.inscricoesAbertas = 1 and t.escalao = ${req.body.escalao} and t.tipoTorneio = ${req.body.tipoTorneio} and t.terminado = 0 and t.Espaco_idEspaco = ${req.body.Espaco_idEspaco} and t.tamEquipa = ${req.body.tamEquipa};`
            data.query(sql1).then(re => {
                if (re.length != 0) {
                    res.send(re[0])
                }
                else {
                    res.status(404).send("Torneio não encontrado")
                }
            })
        })
        .catch(e => { res.status(400).send({ error: e }) })
})


// aceitar/rejeitar inscrições
// pendente a 0 => tá pendente
// pendente a 1 => aceita a inscrição
// pendente a 2 => rejeita inscrição
router.post("/:id/gestao/gerirInscricao",isAuth,(req,res) => {
    var idTorneio = req.params.id;
    let sql = `Select idOrganizador from Torneio where idTorneio = ${idTorneio}`
    data.query(sql).then(re => {
        if (re.length != 0) {
            if (re[0].idOrganizador == req.userId) {
                var idEquipa = req.body.idEquipa;
                var pendente = req.body.pendente;
                let sql2 = "update Torneio_has_Equipa " +
                            "set pendente = " + pendente +
                            " where Torneio_idTorneio = " + idTorneio +" and Equipa_idEquipa = " + idEquipa + ";"
                data.query(sql2).then(re => {
                    if(re != 0){
                        res.send("Resposta à inscrição registada com sucesso");
                    }
                    else {
                        res.status(404).send("Erro");
                    }
                });
            }
            else {
                res.status(501).send("O utilizador não é o organizador deste torneio")
            }
        }
        else {
            res.status(404).send("O Torneio não existe")
        }
    })
})

// Na página de inscritos do torneio (aqueles que já foram aceites) do frontend
//                                              quando enviarmos do backend as inscrições, enviamos também o tipo de Torneio
// No frontend, dependendo do tipo podes ver duas coisas:
//          se for só eliminatórias, só mandas o pedido ao BE se tiver pelo menos 2 inscritos.
//          se tiver só grupos, só mandas o pedido ao BE se tiver no mínimo 3 inscritos.
//          se tiver grupos + eliminatórias, tem de ter 3




// Fechar inscrições
router.post("/:id/gestao/fecharInscricoes",isAuth,(req,res) => {
    var idTorneio = req.params.id;
    let sql = `Select idOrganizador from Torneio where idTorneio = ${idTorneio}`
    data.query(sql).then(re => {
        if (re.length != 0) {
            if (re[0].idOrganizador == req.userId) {
                let sql1 = "update torneio " +
                        "set inscricoesAbertas = 0 " +
                        "where idTorneio = " + idTorneio +";"
                data.query(sql1).then(re => {
                    if(re != 0){
                        res.send("Inscrições fechadas");
                    }
                    else {
                        res.status(404).send("Erro");
                    }
                });
            }
            else {
                res.status(501).send("O utilizador não é o organizador deste torneio")
            }
        }
        else {
            res.status(404).send("O Torneio não existe")
        }
    })
})



/*Pedido vai vir com:
        Groupsize
        Intervalo (entre jogos)
        Duracao (de cada jogo)
        Número de mãos

        no body
*/

//Ver no frontend o tipo, porque se o tipo for de grupos, precisamos de perguntar de quantos elementos é cada grupo, no sorteio
//                        se o tipo for grupos + eliminatórias, precisamos de perguntar quantos passam de cada grupo (quando ele fechar o grupo)
//                        ver a situação dos grupos com duas mãos (acho que o 4 n tem algoritmo de duas mãos)


//Verificar se o número de grupos que ele indica é possível => númeroinscritos/tamGrupos >2
//Verificar se o número de pessoas que passam por grupo é possível

// Gera a fase de grupos
router.post("/:id/gestao/criarFaseGrupos",isAuth,(req,res) => {
    var idTorneio = req.params.id;
    let sql = `Select idOrganizador,inscricoesAbertas,tipoTorneio from Torneio where idTorneio = ${idTorneio};`
    data.query(sql).then(re => {
        if (re.length != 0) {
            //Usar o tipoTorneio aqui para ter a certeza que este torneio tem fase de grupos (e depois para ver quantas mãos utilizar)
            //Usar a flag de federado para ver que algoritmo usar => para já só usamos default.
            if (re[0].idOrganizador == req.userId && re[0].inscricoesAbertas == 0 && verificaGrupos(re[0].tipoTorneio) == 1) {
                var groupSize = req.body.groupSize
                var intervalo = req.body.intervalo
                var duracao = req.body.duracao
                //var mao = req.body.mao Não é preciso, vai-se buscar ao tipo
                var mao = parseInt(getMaos(re[0].tipoTorneio,"grupos"));
                var sql2 = "select E.idEquipa, E.nomeEquipa, E.ranking,T.dataTorneio,DE.numeroMesas from Equipa as E"+
                            " inner join Torneio_has_Equipa as TH on E.idEquipa = TH.Equipa_idEquipa"+
                            " inner join Torneio as T on TH.Torneio_idTorneio = T.idTorneio"+
                            " join Espaco as Es on T.Espaco_idEspaco = Es.idEspaco "+
                            " join Desporto_has_Espaco as DE on (DE.idEspaco = Es.idEspaco and T.idDesporto = DE.idDesporto)" +
                            " where T.idTorneio = " + idTorneio + " and TH.pendente = 1;"
                data.query(sql2).then(inscritos => {
                    if (inscritos.length != 0) {
                        let numeroCampos = inscritos[0].numeroMesas
                        let dataTorneio = `${(inscritos[0].dataTorneio).toLocaleDateString()}`
                        let aux = dataTorneio.split("/")
                        dataTorneio = `${aux[2]}-${aux[1]}-${aux[0]}`

                        let horaInicial = parseInt(`${(inscritos[0].dataTorneio).getHours()}`)
                        let minutosInicial =parseInt(`${(inscritos[0].dataTorneio).getMinutes()}`)
                        inscritos.map(x => {delete x['dataTorneio']
                                            delete x['numeroMesas']
                                        })
                        let campos = []
                        for (let i= 0;i< numeroCampos;i++) {
                            campos[i] = i+1
                        }
                        algoritmos.gerarGrupos(idTorneio,groupSize,inscritos,dataTorneio,horaInicial,minutosInicial,intervalo,duracao,campos,mao,res,function callback() {res.send("Fase de grupos criada com sucesso")})
                    }
                    else {
                        res.status(404).send("O Torneio não tem inscritos para se realizar o sorteio")
                    }
                })
            }
            else {
                if (re[0].inscricoesAbertas == 1) {
                    res.status(502).send("O Torneio ainda tem inscrições abertas")
                }
                else {
                    if(verificaGrupos(re[0].tipoTorneio) == 0) {
                        res.status(501).send("O torneio não tem fase de grupos")
                    }
                    else {
                        res.status(501).send("O utilizador não é o organizador deste torneio")
                    }
                }
            }
        }
        else {
            res.status(404).send("O Torneio não existe")
        }
    })
})




// Cria a fase eliminatória de um torneio só com eliminatórias
router.post("/:idTorneio/gestao/criarEliminatorias",isAuth,(req,res) => {
    var idTorneio = req.params.idTorneio
    //var mao = req.body.mao Vamos usar as mãos do tipoTorneio
    var duracao = req.body.duracao //duracao de cada jogo
    var intervalo = req.body.intervalo //intervalo entre etapas
    //ir buscar hora e minutos
    let sql = `Select idOrganizador,inscricoesAbertas,tipoTorneio from Torneio where idTorneio = ${idTorneio};`
    data.query(sql).then(re => {
        if (re.length != 0) {
            //Usar o tipo de Torneio aqui para ver se o torneio é só de fase eliminatória (e depois para ver que algoritmo usar)
            if (re[0].idOrganizador == req.userId && re[0].inscricoesAbertas == 0 && verificaElimSemGrupos(re[0].tipoTorneio) == 1) {
                var mao = parseInt(getMaos(re[0].tipoTorneio,"eliminatorias"));
                var sql2 =  "select T.dataTorneio,DE.numeroMesas from Torneio as T"+
                            " join Espaco as Es on T.Espaco_idEspaco = Es.idEspaco "+
                            " join Desporto_has_Espaco as DE on (DE.idEspaco = Es.idEspaco and T.idDesporto = DE.idDesporto)" +
                            " where T.idTorneio = "+ idTorneio + ";"
                data.query(sql2).then(i => {
                    if(i.length!=0){
                        let numeroCampos = i[0].numeroMesas
                        let dataTorneio = `${(i[0].dataTorneio).toLocaleDateString()}`
                        let aux = dataTorneio.split("/")
                        dataTorneio = `${aux[2]}-${aux[1]}-${aux[0]}`

                        let hora= parseInt(`${(i[0].dataTorneio).getHours()}`)
                        let minutos =parseInt(`${(i[0].dataTorneio).getMinutes()}`)
                        let campos = []
                        for (let i= 0;i< numeroCampos;i++) {
                            campos[i] = i+1
                        }
                        var sql3 = data.getCountEquipasElim(idTorneio)
                        data.query(sql3).then(c => {
                            if(c.length!=0){
                                //gerarEliminatorias(nJogadores,idTorneio,mao,mesas,hora,minutos,duracao,intervalo)
                                algoritmos.gerarEliminatorias(c[0].count,idTorneio,mao,campos,hora,minutos,duracao,intervalo,dataTorneio,res,function callback() {res.send("Eliminatórias criadas com sucesso")});
                            }
                            else {
                                res.status(501).send("sem resultado em sql3")
                            }
                        })

                    }
                    else {
                        res.status(501).send("sem resultado em sql2")
                    }
                })
            }
            else {
                if (re[0].inscricoesAbertas == 1) {
                    res.status(502).send("O Torneio ainda tem inscrições abertas")
                }
                else {
                    if(verificaElimSemGrupos(re[0].tipoTorneio) == 0) {
                        res.status(501).send("O torneio não é só de eliminatórias")
                    }
                    else {
                        res.status(501).send("O utilizador não é o organizador deste torneio")
                    }
                }
            }
        }
        else {
            res.status(404).send("O Torneio não existe")
        }
    })
})

//Quando fizermos front precisamos de ver se o número de apurados por grupo é valido considerando o tamanho dos grupos
    //Precisamos de dar o número do menor grupo (nParticipantes do grupo a ser menor) => também não podemos deixar ser 0
router.post("/:idTorneio/gestao/criarEliminatoriasFromGrupos",isAuth,(req,res) => {
    var idTorneio = req.params.idTorneio
    //var mao = req.body.mao Vamos obter através do tipoTorneio
    var duracao = req.body.duracao
    var intervalo = req.body.intervalo
    var nApurados = req.body.nApurados // número de apurados por grupo
    var dataT = req.body.dataT // A data em que a fase eliminatória começa
    let sql = `Select Torneio.idOrganizador,Torneio.tipoTorneio,FG.terminado,FG.numeroGrupos from Torneio join
                fasegrupos as FG on FG.Torneio_idTorneio = Torneio.idTorneio where Torneio.idTorneio = ${idTorneio};`
    data.query(sql).then(re => {
        if (re.length != 0) {
            //Utilizar o tipo do torneio para ver se é de grupos + eliminatórias
            if (re[0].idOrganizador == req.userId && re[0].terminado == 1 && verificaElimComGrupos(re[0].tipoTorneio) == 1) {
                var mao = parseInt(getMaos(re[0].tipoTorneio,"eliminatorias"));
                var size = nApurados * re[0].numeroGrupos
                var sql2 =  "select DE.numeroMesas,T.dataTorneio from Torneio as T"+
                            " join Espaco as Es on T.Espaco_idEspaco = Es.idEspaco "+
                            " join Desporto_has_Espaco as DE on (DE.idEspaco = Es.idEspaco and T.idDesporto = DE.idDesporto)" +
                            " where T.idTorneio = "+ idTorneio + ";"
                data.query(sql2).then(i => {
                    if(i.length!=0){
                        let aux = dataT.split("T")
                        let aux2 = aux[1].split(":")
                        let dataTorneio = aux[0],hora= parseInt(aux2[0]),minutos = parseInt(aux2[1]),numeroCampos = i[0].numeroMesas,campos = [];
                        for (let i= 0;i< numeroCampos;i++) {
                            campos[i] = i+1
                        }
                        // tenho de lhe mandar a hora e minutos direitos (hora e minutos do último jogo da fase de grupos para ele n figar)
                        algoritmos.gerarEliminatorias(size,idTorneio,mao,campos,hora,minutos,duracao,intervalo,dataTorneio,res,function callback() {res.send("Eliminatórias criadas com sucesso")})
                    }
                    else {
                        res.status(501).send("sem resultado em sql2")
                    }
                })
            }
            else {
                if (re[0].terminado == 0) {
                    res.status(502).send("A fase de grupos ainda não terminou")
                }
                else {
                    if(verificaElimComGrupos(re[0].tipoTorneio) == 0) {
                        res.status(501).send("O torneio não é de grupos e eliminatórias")
                    }
                    else {
                        res.status(501).send("O utilizador não é o organizador deste torneio")
                    }
                }
            }
        }
        else {
            res.status(404).send("O Torneio não existe")
        }
    })
})

//Temos de ver se a eliminatória já existe sequer
router.post("/:idTorneio/gestao/sortearEliminatoriasFromGrupos",isAuth,(req,res) => {
    var idTorneio = req.params.idTorneio
    var nApuradosGrupo = req.body.nApuradosGrupo
    var tipoSorteio = req.body.tipoSorteio
    let sql = `Select T.idOrganizador,T.tipoTorneio, E.gerado from Torneio as T join Eliminatoria as E on E.Torneio_idTorneio = T.idTorneio
                where idTorneio = ${idTorneio};`
    data.query(sql).then(re => {
        if (re.length != 0) {
            if (re[0].idOrganizador == req.userId && re[0].gerado == 0 && verificaElimComGrupos(re[0].tipoTorneio) == 1) {
                algoritmos.equipasFromGrupos(nApuradosGrupo,idTorneio,tipoSorteio,res,function callback() {res.send("Eliminatórias sorteadas com sucesso")})
            }
            else {
                if (re[0].gerado == 1) {
                    res.status(502).send("A fase eliminatória já foi sorteada")
                }
                else {
                    if(verificaElimComGrupos(re[0].tipoTorneio) == 0) {
                        console.log(re[0].tipoTorneio)
                        res.status(501).send("O torneio não é de eliminatórias e de grupos")
                    }
                    else {
                        res.status(501).send("O utilizador não é o organizador deste torneio")
                    }
                }
            }
        }
        else {
            res.status(404).send("O Torneio não existe ou a eliminatória ainda não foi criada")
        }
    })
})


//Basicamente vamos ver se ele já fechou o sorteio (se gerado = 1 e se já tiver fechado n vai poder sortear)

router.post("/:idTorneio/gestao/sortearEliminatorias",isAuth,(req,res) => {
    var idTorneio = req.params.idTorneio
    var tipoSorteio = req.body.tipoSorteio
    let sql = `Select T.idOrganizador, E.gerado from Torneio as T join Eliminatoria as E on E.Torneio_idTorneio = T.idTorneio
                where idTorneio = ${idTorneio};`
    data.query(sql).then(re => {
        if (re.length != 0) {
            if (re[0].idOrganizador == req.userId && re[0].gerado == 0 && verificaElimSemGrupos(re[0].tipoTorneio) == 1) {
                var sql = data.getEquipasFromElim(idTorneio);
                data.query(sql).then(inscritos => {
                    algoritmos.sortearElim(inscritos,idTorneio,tipoSorteio,res,function callback() {res.send("Eliminatórias sorteadas com sucesso")})
                })
            }
            else {
                if (re[0].gerado == 1) {
                    res.status(502).send("A fase eliminatória já foi sorteada")
                }
                else {
                    if(verificaElimSemGrupos(re[0].tipoTorneio) == 0) {
                        res.status(501).send("O torneio não é só de eliminatórias")
                    }
                    else {
                        res.status(501).send("O utilizador não é o organizador deste torneio")
                    }
                }
            }
        }
        else {
            res.status(404).send("O Torneio não existe ou a eliminatória ainda não foi criada")
        }
    })
})






//Fechar sorteio eliminatorias
router.post("/:id/gestao/fecharSorteioElim",isAuth,(req,res) => {
    let idTorneio = req.params.id
    let sql = `Select idOrganizador,tipoTorneio from Torneio where idTorneio = ${idTorneio};`
    data.query(sql).then(re =>  {
        if (re.length != 0) {
            if (re[0].idOrganizador == req.userId && (verificaElimSemGrupos(re[0].tipoTorneio)== 1 || verificaElimComGrupos(re[0].tipoTorneio) == 1)) {
                let sql1  = `Select idEliminatoria from Eliminatoria as E join Torneio as T on
                            T.idTorneio = E.Torneio_idTorneio where T.idTorneio = ${idTorneio};`
                data.query(sql1).then(re2 => {
                    if (re2.length != 0) {
                        let sql2 = `update Eliminatoria set gerado = 1 where idEliminatoria = ${re2[0].idEliminatoria};`
                        data.query(sql2).then(re3 => {
                            if (re3.length != 0) {
                                res.send("Sorteio da eliminatória fechado com sucesso")
                            }
                            else {
                                res.status(404).send("Não foi possível fechar o sorteio da eliminatória")
                            }
                        })
                    }
                    else {
                        res.status(404).send("Não existe essa eliinatória")
                    }
                })
            }
            else {
                if (re[0].idOrganizador != req.userId) {
                    res.status(501).send("O Utilizador não é o organizador do torneio")
                }
                else {
                    res.status(501).send("O Torneio não tem fase eliminatória")
                }
            }
        }
        else {
            res.status(404).send("Torneio não existe")
        }
    })
})



// Verifica se o torneio tem fase de grupos
function verificaGrupos (tipoTorneio) {
    if (tipoTorneio == 0 || tipoTorneio == 2 || tipoTorneio == 3 || tipoTorneio ==5 || tipoTorneio ==6 || tipoTorneio == 7) {
        return 1;
    }
    else {
        return 0;
    }
}

// Verifica se o torneio só tem fase eliminatória
function verificaElimSemGrupos (tipoTorneio) {
    if (tipoTorneio == 1 || tipoTorneio == 4) {
        return 1;
    }
    else {
        return 0;
    }
}

// Verifica se o torneio tem fase eliminatórias com grupos
function verificaElimComGrupos (tipoTorneio) {
    if ( tipoTorneio == 2 || tipoTorneio ==5 || tipoTorneio ==6 || tipoTorneio == 7) {
        return 1;
    }
    else {
        return 0;
    }
}

//Recebe o tipoTorneio e a fase em que está (grupo ou eliminatória)
function getMaos (tipoTorneio,fase) {
    let res = 1;
    switch (true) {
        case (tipoTorneio == 0): res = 1;
            break;
        case (tipoTorneio == 1): res = 1;
            break;
        case (tipoTorneio == 2): res = 1;
            break;
        case (tipoTorneio == 3 && fase == "grupos"):  res = 2;
            break;
        case (tipoTorneio == 4 && fase == "eliminatorias"):  res = 2;
            break;
        case (tipoTorneio == 5 && fase == "grupos"):  res = 2;
            break;
        case (tipoTorneio == 6 && fase == "eliminatorias"):  res = 2;
            break;
        case (tipoTorneio == 7): res = 2;
            break;
    }
    return res;
}


//Temos de começar o torneio se estivermos a começar o primeiro jogo do torneio
router.post("/:id/gestao/:idJogo/comecarJogo",isAuth,(req,res) => {
    var idTorneio = req.params.id;
    var idJogo = req.params.idJogo;
    let sql = `Select idOrganizador,terminado from Torneio where idTorneio = ${idTorneio};`

    data.query(sql).then (re => {
        if (re.length != 0) {
            if(re[0].idOrganizador == req.userId) {
                if (re[0].terminado == 1) {
                    let sql2 = `update Jogo set estado = 1 where idJogo =  ${idJogo};`
                    data.query(sql2).then (resultado => {
                        if (resultado.length != 0) {
                            res.send("Jogo atualizado com sucesso")
                            }
                        else {
                            res.status(404).send("Não conseguiu atualizar o jogo")
                        }
                    })
                }
                else {
                    let sql1 = `Update Torneio set terminado = 1 where idTorneio = ${idTorneio};`
                    data.query(sql1).then(result =>{
                        if(result.length != 0) {
                            let sql2 = `update Jogo set estado = 1 where idJogo =  ${idJogo};`
                            data.query(sql2).then (resultado => {
                                if (resultado.length != 0) {
                                    res.send("Jogo atualizado com sucesso")
                                }
                                else (
                                    res.status(404).send("Não conseguiu atualizar o jogo")
                                )
                            })
                        }
                        else {
                            res.status(404).send("Falhou a iniciar torneio")
                        }
                    })
                }
            }
            else {
                res.status(501).send("O utilizador não é o organizador do torneio")
            }
        }
        else {
            res.status(404).send("Torneio não existe")
        }
    })
})


//Atualiza o resultado para um jogo a decorrer
router.post("/:id/gestao/:idJogo/atualizarResultado",isAuth,(req,res) => {
    var idTorneio = req.params.id;
    var idJogo = req.params.idJogo;
    var resultado = req.body.resultado;
    let sql = `Select idOrganizador from Torneio where idTorneio = ${idTorneio};`

    data.query(sql).then(re => {
        if (re.length != 0) {
            if (re[0].idOrganizador == req.userId) {
                let sql1 = `Select estado from Jogo where idJogo = ${idJogo};`
                data.query(sql1).then(result => {
                    if (result.length != 0) {
                        if (result[0].estado == 1) {
                            let sql2 = `update Jogo set resultado = "${resultado}" where idJogo = ${idJogo} ;`
                            data.query(sql2).then(res2 => {
                                if(res2.length != 0){
                                    res.send("Resultado atualizado com sucesso");
                                }
                                else {
                                    res.status(404).send("Resultado não foi atualizado com sucesso");
                                }
                            });
                        }
                        else {
                            res.status(501).send("O jogo não está a decorrer")
                        }
                    }
                    else {
                        res.status(501).send("O jogo não existe")
                    }
                })
            }
            else {
                res.status(501).send("O Utilizador não é o organizador do torneio")
            }
        }
        else {
            res.status(404).send("O Torneio não existe")
        }
    })
})


//Fechar o resultado fazendo as alterações supostas
router.post("/:id/gestao/:idJogo/fecharResultado",isAuth,(req,res) => {
    var idTorneio = req.params.id;
    var idJogo = req.params.idJogo;
    var resultado = req.body.resultado;
    var idOponente1 = req.body.idOponente1;
    var idOponente2 = req.body.idOponente2;

    let vencedor = algoritmos.getVencedor(resultado,idOponente1,idOponente2) // retorna o id de quem ganhou o jogo

    let sqlOrganizador = `Select idOrganizador,tipoTorneio from Torneio where idTorneio = ${idTorneio}`
    data.query(sqlOrganizador).then(re => {
        if (re.length != 0) {
            if (re[0].idOrganizador == req.userId) {


                let sql = data.updateFecharJogo(resultado,idJogo,vencedor)
                data.query(sql).then(update => {
                    // Aqui atualiza o Jogo (fecha-o e mete o resultado)
                    if(update != 0){

                        sql = data.getJogo(idJogo)
                        // Vai buscar o grupo (ou) etapa em que o jogo está para depois alterar

                        data.query(sql).then(jogo => {

                        if(jogo.length != 0) {
                            if(jogo[0].Grupo_idGrupo != null){
                            //atualizar classificação da fase de grupos
                            var sql2 = data.getClassificacaoGrupo(jogo[0].Grupo_idGrupo)
                            data.query(sql2).then(res1 => {
                                //Atualizamos a classificação do grupo
                                var newCl = algoritmos.atualizaClassificacao(res1[0].classificacaoGrupo,jogo[0].idOponente1,jogo[0].idOponente2,resultado)

                                var sql3 = data.getJogosAbertos(jogo[0].Grupo_idGrupo)
                                data.query(sql3).then(sel => {
                                     //sel tem os jogos que ainda não estão terminados
                                    if (sel.length != 0) {
                                        console.log("1")
                                        var terminado = (sel[0].count == 0) ? 1 : 0
                                        var sql4 = data.updateClassificacaoGrupo(newCl,jogo[0].Grupo_idGrupo,terminado)
                                        data.query(sql4).then(result => {
                                            if (result.length != 0) {
                                                console.log("2")
                                                if (terminado == 1) {
                                                    console.log("3")
                                                    // Se o grupo terminou precisamos de ver se a fase de grupos terminou
                                                    let sql5 = `select faseGrupos_idFaseGrupos from grupo where idGrupo = ${jogo[0].Grupo_idGrupo};`
                                                    data.query(sql5).then( re1 => {
                                                        if (re1.length != 0) {
                                                            console.log("4")
                                                            let sql6 = `Select count(*) as count from Grupo where terminado = 0 and faseGrupos_idFaseGrupos = ${re1[0].faseGrupos_idFaseGrupos};`
                                                            data.query(sql6).then(re2 => {
                                                                console.log("5")
                                                                if (re2.length != 0) {
                                                                    console.log("6")
                                                                    let fgTerminado = (re2[0].count == 0)? 1 : 0
                                                                    if (fgTerminado == 1) {
                                                                        console.log("7")
                                                                        let sql7 = `update fasegrupos set terminado = 1 where idFaseGrupos = ${re1[0].faseGrupos_idFaseGrupos};`
                                                                        data.query(sql7).then(re3 => {
                                                                            if (re3.length != 0) {
                                                                                if (re[0].tipoTorneio == 0 || re[0].tipoTorneio == 3) {
                                                                                    let sql8 = `update Torneio set terminado = 2 where idTorneio = ${idTorneio}`
                                                                                    data.query(sql8).then(re4 => {
                                                                                        if (re4.length != 0) {
                                                                                            res.send("Jogo fechado com sucesso e torneio terminado")
                                                                                        }
                                                                                        else {
                                                                                            res.status(404).send("Erro a terminar o torneio")
                                                                                        }
                                                                                    })
                                                                                }
                                                                                else {
                                                                                    res.send("Jogo inserido com sucesso")
                                                                                }
                                                                            }
                                                                            else {
                                                                                res.status(404).send("Ocorreu um erro a fechar a fase de grupos")
                                                                            }
                                                                        })
                                                                    }
                                                                    else {
                                                                        res.send("Jogo inserido com sucesso")
                                                                    }
                                                                }
                                                                else {
                                                                    res.status(404).send("Falhou a contagem dos grupos por acabar")
                                                                }
                                                            })
                                                        }
                                                        else {
                                                            res.status(404).send("Não existe a fase de grupos")
                                                        }
                                                    })
                                                }
                                                else {
                                                    res.send("Jogo inserido com sucesso")
                                                }
                                            }
                                            else {
                                                res.status(404).send("Não foi possível atualizar o grupo")
                                            }
                                        })
                                    }
                                    else {
                                        res.status(404).send("Não foi possível contar quantos grupos ainda não terminaram")
                                    }
                                })
                            })
                            }

                            //Aqui começa a parte das eliminatórias



                            else {
                                var idEtapa = jogo[0].idEtapa
                                var ronda = jogo[0].ronda
                                var newR = (ronda == 1)?  1 : Math.floor(ronda/2)

                                let sql3 = `Select numeroEtapa from Etapa where idEtapa = ${idEtapa}`
                                data.query(sql3).then(re3 => {
                                    if (re3.length != 0 ) {
                                        if (re[0].tipoTorneio == 1 || re[0].tipoTorneio == 2 || re[0].tipoTorneio == 5) {
                                            if (re3[0].numeroEtapa == 1){
                                                sqlFecharEtapa = `update etapa set terminado = 1 where idEtapa = ${idEtapa};`
                                                sqlFecharTorneio = sqlFecharEtapa + " " +`update Torneio set terminado = 2 where idTorneio = ${idTorneio};`
                                                data.query(sqlFecharTorneio).then(re5 => {
                                                    if (re5.length != 0) {
                                                        res.send("Jogo atualizado e Etapa e Torneio finalizados")
                                                    }
                                                    else {
                                                        res.status(404).send("Falhou a fechar a etapa ou o torneio")
                                                    }
                                                })
                                            }
                                            else {
                                                var sql2 = data.getJogoEtapaSeguinte(idEtapa)
                                                data.query(sql2).then(idJogo => {
                                                    if (idJogo.length != 0) {
                                                        var indiceJogo = 0
                                                        for (var i = 0; i<idJogo.length;i++) {
                                                            if (idJogo[i].ronda == newR) {
                                                                indiceJogo = i;
                                                            }
                                                        }
                                                        var sql4 = (ronda % 2 == 0) ? data.updateJogoO2(vencedor,idJogo[indiceJogo].idJogo) :  data.updateJogoO1(vencedor,idJogo[indiceJogo].idJogo);
                                                        data.query(sql4).then(re4 => {
                                                            if(re4.length != 0) {
                                                                var sql5 = `select count(*) as count from Jogo Where idEtapa = ${idEtapa} and (estado = 0 or estado = 1);`
                                                                data.query(sql5).then(re5 => {
                                                                    if (re5.length != 0) {
                                                                        if (re5[0].count == 0) {
                                                                            var sql6 = `update Etapa set terminado = 1 where idEtapa = ${idEtapa};`
                                                                            data.query(sql6).then(re6 => {
                                                                                if (re6.length != 0) {
                                                                                    res.send("Jogo atualizado e etapa finalizada")
                                                                                }
                                                                                else {
                                                                                    res.status(404).send("Erro a terminar a etapa")
                                                                                }
                                                                            })
                                                                        }
                                                                        else {
                                                                            res.send("Jogo atualizado")
                                                                        }
                                                                    }
                                                                    else{
                                                                        res.status(404).send("Não encontrou a etapa")
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                res.status(404).send("Erro a meter a equipa na próxima etapa")
                                                            }
                                                        })
                                                    }
                                                    else {
                                                        res.status(404).send("Não foi encontrada a etapa seguinte")
                                                    }
                                                })
                                            }
                                        }


                                        //Eliminatórias para 2 mãos

                                        else {
                                            if (re[0].tipoTorneio == 4 || re[0].tipoTorneio == 6 || re[0].tipoTorneio == 7) {
                                                if (re3[0].numeroEtapa == 1){
                                                    sqlFecharEtapa = `update etapa set terminado = 1 where idEtapa = ${idEtapa};`
                                                    sqlFecharTorneio = sqlFecharEtapa + " " +`update Torneio set terminado = 2 where idTorneio = ${idTorneio};`
                                                    data.query(sqlFecharTorneio).then(re5 => {
                                                        if (re5.length != 0) {
                                                            res.send("Jogo atualizado e Etapa e Torneio finalizados")
                                                        }
                                                        else {
                                                            res.status(404).send("Falhou a fechar a etapa ou o torneio")
                                                        }
                                                    })
                                                }
                                                else {
                                                    if (jogo[0].mao ==2) {
                                                        console.log("aqui?")
                                                        var sql2 = data.getJogoEtapaSeguinte(idEtapa)
                                                        data.query(sql2).then(idJogo => {
                                                            if (idJogo.length != 0) {
                                                                console.log(newR)
                                                                var indiceJogo = []
                                                                for (var i = 0; i<idJogo.length;i++) {
                                                                    if (idJogo[i].ronda == newR) {
                                                                        indiceJogo.push(i);
                                                                    }
                                                                }
                                                                console.log(indiceJogo)

                                                                let sql10 = `Select resultado,idOponente1,idOponente2,estado from Jogo where idEtapa =${jogo[0].idEtapa} and ronda = ${jogo[0].ronda} and mao = 1;`
                                                                data.query(sql10).then(re4 => {
                                                                    if (re4.length != 0) {
                                                                        if (re4[0].estado == 2) {
                                                                            let vencedortotal = algoritmos.calculaVencedor2Maos(re4[0].resultado,resultado,re4[0].idOponente1,re4[0].idOponente2)
                                                                            var sql4 = (ronda % 2 == 0) ? (data.updateJogoO2(vencedortotal,idJogo[indiceJogo[0]].idJogo) + data.updateJogoO1(vencedortotal,idJogo[indiceJogo[1]].idJogo)) : (data.updateJogoO1(vencedortotal,idJogo[indiceJogo[0]].idJogo) + data.updateJogoO2(vencedortotal,idJogo[indiceJogo[1]].idJogo))
                                                                            data.query(sql4).then(re4 => {
                                                                                if(re4.length != 0) {
                                                                                    var sql5 = `select count(*) as count from Jogo Where idEtapa = ${idEtapa} and (estado = 0 or estado = 1);`
                                                                                    data.query(sql5).then(re5 => {
                                                                                        if (re5.length != 0) {
                                                                                            if (re5[0].count == 0) {
                                                                                                var sql6 = `update Etapa set terminado = 1 where idEtapa = ${idEtapa};`
                                                                                                data.query(sql6).then(re6 => {
                                                                                                    if (re6.length != 0) {
                                                                                                        res.send("Jogo atualizado e etapa finalizada")
                                                                                                    }
                                                                                                    else {
                                                                                                        res.status(404).send("Erro a terminar a etapa")
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                            else {
                                                                                                res.send("Jogo atualizado")
                                                                                            }
                                                                                        }
                                                                                        else{
                                                                                            res.status(404).send("Não encontrou a etapa")
                                                                                        }
                                                                                    })
                                                                                }
                                                                                else {
                                                                                    res.status(404).send("Erro a meter a equipa na próxima etapa")
                                                                                }
                                                                            })
                                                                        }
                                                                        else{
                                                                            res.status(404).send("A primeira mão ainda não terminou")
                                                                        }
                                                                    }
                                                                    else {
                                                                        res.status(404).send("Não encontrou a primeira mão")
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                res.status(404).send("Não foi encontrada a etapa seguinte")
                                                            }
                                                        })


                                                    }
                                                    else {
                                                        res.send("Jogo atualizado com sucesso")
                                                    }
                                                }

                                            }
                                            else {
                                                res.status(404).send("O torneio não é de eliminatórias")
                                            }

                                        }

                                    }
                                    else {
                                        res.status(404).send("Não existe a etapa")
                                    }
                                })
                            }
                        }
                        else {
                            res.status(404).send("Jogo não existe");
                        }
                        });
                    }
                    else {
                        res.status(404).send("Não foi possível fechar o jogo");
                    }
                });
            }
            else {
                res.status(404).send("O Utilizador não é o organizador do Torneio");
            }
        }
        else {
            res.status(404).send("O Torneio não existe");
        }
    })
})


module.exports = router
