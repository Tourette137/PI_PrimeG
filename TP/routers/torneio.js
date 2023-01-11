const express = require('express');
const router = express.Router();
const data = require('../query.js')
const isAuth = require('./auth');
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
    let sql = `Select idOrganizador,inscricoesAbertas from Torneio where idTorneio = ${idTorneio}`
    data.query(sql).then(re => {
        if (re.length != 0) {
            if (re[0].idOrganizador == req.userId && re[0].inscricoesAbertas == 0) {
                var sql1 = `update torneio set terminado = 1 where idTorneio = ${idTorneio};`
                data.query(sql1).then(re=>{
                    var groupSize = req.body.groupSize
                    var intervalo = req.body.intervalo
                    var duracao = req.body.duracao
                    var mao = req.body.mao
                    //var maos = req.body(maos)
                    //var federado = req.body(federado)
                    // Ainda falta
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

                            algoritmos.gerarGrupos(idTorneio,groupSize,inscritos,dataTorneio,horaInicial,minutosInicial,intervalo,duracao,campos,mao)
                            res.send("Torneio gerado")
                        }
                    else {
                        res.status(404).send("O Torneio não tem inscritos para se realizar o sorteio")
                    }
                    })
                
                })
                .catch(e => { res.status(400).jsonp({ error: e }) })

            }
            else {
                if (re[0].inscricoesAbertas == 0) {
                    res.status(501).send("O utilizador não é o organizador deste torneio")
                }
                else {
                    res.status(502).send("O Torneio ainda tem inscrições abertas")
                }
            }
        }
        else {
            res.status(404).send("O Torneio não existe")
        }
    })
})

router.post("/:id/gestao/:idJogo/atualizarResultado",(req,res) => {
    var idJogo = parseInt(req.body.idJogo);
    var resultado = req.body.resultado;
    let sql = "update Jogo " +
              "set resultado = " + resultado +
              " where idJogo = " + idJogo + ";"
    data.query(sql).then(re => {
        if(re != 0){
            res.send(re);
        }
        else {
            res.status(404).send("Erro");
        }
    });
})

router.post("/:id/gestao/:idJogo/comecarJogo",(req,res) => {
    var idJogo = parseInt(req.body.idJogo);
    let sql = "update Jogo " +
              "set estado = 1 " +
              " where idJogo = " + idJogo + ";"
    data.query(sql).then(re => {
        if(re != 0){
            res.send(re);
        }
        else {
            res.status(404).send("Erro");
        }
    });
})
﻿
router.post("/:idTorneio/gestao/criarEliminatorias",isAuth,(req,res) => {
    var idTorneio = req.params.idTorneio
    var mao = req.body.mao
    var duracao = req.body.duracao //duracao de cada jogo
    var intervalo = req.body.intervalo //intervalo entre etapas
    //ir buscar hora e minutos
    let sql = `Select idOrganizador,inscricoesAbertas from Torneio where idTorneio = ${idTorneio}`
    data.query(sql).then(re => {
        if (re.length != 0) {
            if (re[0].idOrganizador == req.userId && re[0].inscricoesAbertas == 0) {
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
                        /*i.map(x => {delete x['dataTorneio']
                                    delete x['numeroMesas']
                                    })
                        */
                        let campos = []
                        for (let i= 0;i< numeroCampos;i++) {
                            campos[i] = i+1
                        }
                        var sql3 = data.getCountEquipasElim(idTorneio)
                        data.query(sql3).then(c => {
                            if(c.length!=0){
                                //gerarEliminatorias(nJogadores,idTorneio,mao,mesas,hora,minutos,duracao,intervalo)
                                algoritmos.gerarEliminatorias(c[0].count,idTorneio,mao,campos,hora,minutos,duracao,intervalo,dataTorneio);
                                res.status(200).send("broke")
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
                if (re[0].inscricoesAbertas == 0) {
                    res.status(501).send("O utilizador não é o organizador deste torneio")
                }
                else {
                    res.status(502).send("O Torneio ainda tem inscrições abertas")
                }
            }
        }
        else {
            res.status(404).send("O Torneio não existe")
        }
    })
})


router.post("/:idTorneio/gestao/criarEliminatoriasFromGrupos",isAuth,(req,res) => {
    var idTorneio = req.params.idTorneio
    var mao = req.body.mao
    var duracao = req.body.duracao //duracao de cada jogo
    var intervalo = req.body.intervalo //intervalo entre etapas
    var size = req.body.size

    let sql = `Select idOrganizador,inscricoesAbertas from Torneio where idTorneio = ${idTorneio}`
    data.query(sql).then(re => {
        if (re.length != 0) {
            if (re[0].idOrganizador == req.userId && re[0].inscricoesAbertas == 0) {
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
                        /*i.map(x => {delete x['dataTorneio']
                                    delete x['numeroMesas']
                                    })
                        */
                        let campos = []
                        for (let i= 0;i< numeroCampos;i++) {
                            campos[i] = i+1
                        }
                        algoritmos.gerarEliminatorias(size,idTorneio,mao,campos,hora,minutos,duracao,intervalo,dataTorneio)
                        res.status(200).send("broke")
                    } 
                    else {
                        res.status(501).send("sem resultado em sql2")
                    }
                })        
            }
            else {
                if (re[0].inscricoesAbertas == 0) {
                    res.status(501).send("O utilizador não é o organizador deste torneio")
                }
                else {
                    res.status(502).send("O Torneio ainda tem inscrições abertas")
                }
            }
        }
        else {
            res.status(404).send("O Torneio não existe")
        }
    })
})

router.post("/:idTorneio/gestao/sortearEliminatorias",isAuth,(req,res) => {
    var idTorneio = req.params.idTorneio
    var tipoSorteio = req.body.tipoSorteio
    let sql = `Select idOrganizador,inscricoesAbertas from Torneio where idTorneio = ${idTorneio}`
    data.query(sql).then(re => {
        if (re.length != 0) {
            if (re[0].idOrganizador == req.userId && re[0].inscricoesAbertas == 0) {
                var sql = data.getEquipasFromElim(idTorneio);
                data.query(sql).then(inscritos => {
                    algoritmos.sortearElim(inscritos,idTorneio,tipoSorteio)
                    res.status(200).send("broke")
                })
            }
            else {
                if (re[0].inscricoesAbertas == 0) {
                    res.status(501).send("O utilizador não é o organizador deste torneio")
                }
                else {
                    res.status(502).send("O Torneio ainda tem inscrições abertas")
                }
            }
        }
        else {
            res.status(404).send("O Torneio não existe")
        }
    })
})

router.post("/:idTorneio/gestao/sortearEliminatoriasFromGrupos",isAuth,(req,res) => {
    var idTorneio = req.params.idTorneio
    var nApuradosGrupo = req.body.nApuradosGrupo
    let sql =   "Select T.idOrganizador,T.inscricoesAbertas,FG.terminado from Torneio as T " + 
                "join FaseGrupos as FG on FG.Torneio_idTorneio = T.idTorneio " +
                "where idTorneio = " + idTorneio + ";"
    data.query(sql).then(re => {
        if (re.length != 0) {
            if (re[0].idOrganizador == req.userId && re[0].inscricoesAbertas == 0 && re[0].terminado == 1) {
                var sql = data.getEquipasFromElim(idTorneio);
                data.query(sql).then(inscritos => {
                    algoritmos.equipasFromGrupos(nApuradosGrupo,idTorneio)
                    res.status(200).send("broke")
                })
            }
            else {
                if (re[0].inscricoesAbertas == 0) {
                    res.status(501).send("O utilizador não é o organizador deste torneio")
                }
                else if (re[0].terminado == 0) {
                    res.status(501).send("A fase de grupos ainda não terminou")
                } 
                else {
                    res.status(502).send("O Torneio ainda tem inscrições abertas")
                }
            }
        }
        else {
            res.status(404).send("O Torneio não existe")
        }
    })
})

module.exports = router