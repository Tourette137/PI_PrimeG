const express = require('express');
const router = express.Router();
const data = require('../query.js')
const isAuth = require('./auth');


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
            let aux1 = []
            re.map((r) => {
                let aux2 = `${r.classificacaoGrupo}`.split('|');
                console.log(aux2);
                for (var i = 0; i< aux2.length; i++) {
                    aux1.push(aux2[i]);
                }
                r.classificacaoGrupo = aux1;
                aux1 = {}
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
    let sql = "select E.numeroEtapa,J.ronda,Eq.idEquipa,Eq.nomeEquipa,J.resultado from Eliminatoria as El " +
               "join Etapa as E on E.Eliminatoria_idEliminatoria=El.idEliminatoria " +
               "join Jogo as J on J.idEtapa=E.idEtapa " +
               "join Torneio as T on T.idTorneio = El.Torneio_idTorneio " + 
               "join Torneio_has_Equipa as TE on TE.Torneio_idTorneio=T.idTorneio " +
               "join Equipa as Eq on Eq.idEquipa = TE.Equipa_idEquipa " +
               "where T.idTorneio = " + idTorneio + " and El.Torneio_idTorneio = " + idTorneio +" and Eq.idEquipa = J.idOponente1 or Eq.idEquipa = J.idOponente2 ;"
    data.query(sql).then(re => {
        if (re.length != 0) {
            let aux = []
            let resultado = []
            let aux2 = {}
            re.map((r) => {
            if (!(aux.includes((r.numeroEtapa,r.ronda)))) {
                aux.push(r.numeroEtapa,r.ronda);
                aux2 = {"numeroEtapa": r.numeroEtapa,
                        "numeroRonda": r.ronda,
                        "idEquipa1" : r.idEquipa,
                        "nomeEquipa1" : r.nomeEquipa,
                        "resultado" : r.resultado
                }
                resultado.push(aux2);
            }
            else {
                for (var i = 0; i <resultado.length; i++) {
                    if (resultado[i].numeroEtapa === r.numeroEtapa && resultado[i].numeroRonda === r.ronda) {
                        resultado[i].idEquipa2 = r.idEquipa;
                        resultado[i].nomeEquipa2 = r.nomeEquipa;  
                        break;
                    }
                }
            }
            re =resultado; 
            })
            res.send(re);
        }
        else {
            res.status(404).send("A eliminatória não foi encontrada!")
        }
    }) 
}

//Get de um torneio
router.get("/:id", (req,res) => {
    const idTorneio = req.params.id;
    let sql = "select T.idTorneio,T.nomeTorneio,T.terminado,T.isFederado,T.dataTorneio,T.escalao,T.tipoTorneio,T.tamEquipa,D.nomeDesporto,L.Nome from torneio as T " +
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
            res.send(re[0]);

        }
        else {
            res.status(404).send("O Torneio não existe!");
        }
    })
})



//Inicializo com inscricoesAbertas a 1 (inscrições abertas) e com terminado a 0
router.post("/registo",isAuth,(req,res) => {
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


router.post("/gestao/inscricao",isAuth,(req,res) => {
    // do token vou buscar o user
    // verificar se o utilizador q fez pedido é o q criou o torneio
    // aceitar/rejeitar inscrição
})


module.exports = router