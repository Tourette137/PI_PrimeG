const express = require('express');
const router = express.Router();
const data = require('../query.js')


//lista de jogos a decorrer de um torneio
router.get("/:id/jogos",(req,res) =>{
    const idTorneio = parseInt(req.params.id);
    //Ver se o torneio já terminou
    let sql = "select terminado from Torneio where idTorneio = " + idTorneio + ";";
    data.query(sql).then(re => {
        if(re.length!=0){
            getJogosTorneio(parseInt(re[0].terminado),idTorneio,res);
        }
        else {
            res.status(404).send("O torneio não existe");
        }      
    });
})

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
                    sql = "select * from Jogo as J join Ronda as R on J.Ronda_idRonda = R.idRonda " +
                                                "join Etapa as E on R.Etapa_idEtapa = E.idEtapa " + 
                                                "join Eliminatoria as EL on E.Eliminatoria_idEliminatoria = EL.idEliminatoria " +
                                                "where EL.Torneio_idTorneio = " + idTorneio + " and J.estado = 1 and EL.gerado = 1;";
                    data.query(sql).then(re => {
                        res.send(re);
                    });
                }
                //0 -> fase de grupos a decorrer // BUSCAR JOGOS DA FASE DE GRUPOS
                else{
                    sql = " select * from Jogo as J join Grupo as G on J.Grupo_idGrupo = G.idGrupo " +
                                                    "join FaseGrupos as FG on G.FaseGrupos_idFaseGrupos = FG.idFaseGrupos " + 
                                                    "where FG.Torneio_idTorneio = " + idTorneio + " and J.estado = 1;";
                    data.query(sql).then(re => {
                        res.send(re);
                    });                               
                }
            }
            else {//não existe fase de grupos // BUSCAR JOGOS DAS ELIMINATORIAS
                sql = "select * from Jogo as J join Ronda as R on J.Ronda_idRonda = R.idRonda " +
                                                "join Etapa as E on R.Etapa_idEtapa = E.idEtapa " + 
                                                "join Eliminatoria as EL on E.Eliminatoria_idEliminatoria = EL.idEliminatoria " +
                                                "where EL.Torneio_idTorneio = " + idTorneio + " and J.estado = 1;";
                data.query(sql).then(re => {
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
    //0 -> inscricoes abertas
    //1 -> inscricoes fechadas
    let sql = "select T.idTorneio,T.nomeTorneio,T.isFederado,T.dataTorneio,T.escalao,T.tipoTorneio,D.nomeDesporto,L.Nome from torneio as T " +
              "join Espaco as E on T.Espaco_idEspaco = E.idEspaco " +
              "join Localidade as L on E.Localidade_idLocalidade = L.idLocalidade " +
              "join Desporto as D on T.idDesporto = D.idDesporto "
    
    //Filtro de Localidade 
    if(req.query.localidade != null){
        if(!isNaN(req.query.localidade)){
            sql += " where T.inscricoesAbertas = 0 and idLocalidade = " + req.query.localidade;
                   
        }
        else {sql += " where T.inscricoesAbertas = 0 " }
    }
    else {
        sql += " where T.inscricoesAbertas = 0 "
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
    let sql = "select T.idTorneio,T.nomeTorneio,T.isFederado,T.dataTorneio,T.escalao,T.tipoTorneio,D.nomeDesporto,L.Nome from torneio as T " +
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
    let sql = "select T.idTorneio,T.nomeTorneio,T.isFederado,T.dataTorneio,T.escalao,T.tipoTorneio,D.nomeDesporto,L.Nome from torneio as T " +
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
            res.send(re);
        }
        else {
            res.status(404).send("Não existem torneios disponíveis");
        }
    });
});




//Classificação final de um torneio
//Classificao final do grupo + Classificacao das eliminatorias.
router.get("/:id/classificacao", (req,res) => {
    const idTorneio = req.params.id;
    let sql = "select tipoTorneio from Torneio where idTorneio = " + idTorneio + ";";
    data.query(sql).then(re => {
        if(re.length!=0){
            getClassificacaoTorneio(re[0].tipoTorneio,idTorneio,res);
        }
        else {
            res.status(404).send("O torneio não existe");
        }      
    });
});

/*
0 - grupo (liga)
1 - eliminatórias
2 - ambos
3 - grupos duas mãos
4 - eliminatórias duas mãos
5 - ambos (grupos 2 mãos)
6 - ambos (elim 2 mãos)
7 - ambos (ambos 2 mãos)
*/

function getClassificacaoTorneio(tipoTorneio, idTorneio, res) {
    switch (tipoTorneio) {
        case 0: case 3:
            //classificacao do grupo
            let sql = "select numeroGrupo,classificacaoGrupo from Grupo as G " +
                      "join FaseGrupos as FG on G.faseGrupos_idFaseGrupos = FG.idFaseGrupos " +
                      "join Torneio as T on T.idTorneio = FG.Torneio_idTorneio " +
                      "where idTorneio = " + idTorneio + ";"
            data.query(sql).then(re => {
                re = "Liga" + JSON.stringify(re); 
                res.send(re);
            }); 
            break;
        case 1: case 4: 
            let sql1 = "select E.numeroEtapa,R.numeroRonda,Eq.idEquipa,Eq.nomeEquipa,J.resultado from Eliminatoria as El " +
                       "join Etapa as E on E.Eliminatoria_idEliminatoria=El.idEliminatoria " +
                       "join Ronda as R on R.Etapa_idEtapa=E.idEtapa " +
                       "join Jogo as J on J.Ronda_idRonda=R.idRonda " +
                       "join Torneio as T on T.idTorneio = El.Torneio_idTorneio " + 
                       "join Torneio_has_Equipa as TE on TE.Torneio_idTorneio=T.idTorneio " +
                       "join Equipa as Eq on Eq.idEquipa = TE.Equipa_idEquipa " +
                       "where T.idTorneio = " + idTorneio + " and Eq.idEquipa = J.idOponente1 or Eq.idEquipa = J.idOponente2 ;"
            data.query(sql1).then(re => {
                re = "Elim" + JSON.stringify(re);
                res.send(re);
            });
            //ver nº de etapas
            //ver se a etapa presente está terminada  
                //se estiver terminada - proxima etapa será a ultima a ser mostrada
                //caso contrário passamos à seguinte e verificamos novamente
            //enviar os resultados das várias etapas (rondas)

            break;
        case 2: case 5: case 6: case 7: 
            let sql2 = "select numeroGrupo,classificacaoGrupo from Grupo as G " +
                       "join FaseGrupos as FG on G.faseGrupos_idFaseGrupos = FG.idFaseGrupos " +
                       "join Torneio as T on T.idTorneio = FG.Torneio_idTorneio " +
                       "where idTorneio = " + idTorneio + ";"
                    //ver se a fase de grupos já terminou
                    //caso não terminado enviar apenas a classificacao de todos os grupos
                    //caso terminado enviar a classificacao final dos grupos + 
                    ////ver nº de etapas
                    //ver se a etapa presente está terminada  
                    //se estiver terminada - proxima etapa será a ultima a ser mostrada
                    //caso contrário passamos à seguinte e verificamos novamente
                    //enviar os resultados das várias etapas (rondas)
            data.query(sql2).then(re => {
                getClassElim(idTorneio,re,res);
            })
            break;
        default:
            console.log("default");
    }
}

function getClassElim(idTorneio,re,res){
    let sql1 = "select E.numeroEtapa,R.numeroRonda,Eq.idEquipa,Eq.nomeEquipa,J.resultado from Eliminatoria as El " +
                "join Etapa as E on E.Eliminatoria_idEliminatoria=El.idEliminatoria " +
                "join Ronda as R on R.Etapa_idEtapa=E.idEtapa " +
                "join Jogo as J on J.Ronda_idRonda=R.idRonda " +
                "join Torneio as T on T.idTorneio = El.Torneio_idTorneio " + 
                "join Torneio_has_Equipa as TE on TE.Torneio_idTorneio=T.idTorneio " +
                "join Equipa as Eq on Eq.idEquipa = TE.Equipa_idEquipa " +
                "where T.idTorneio = " + idTorneio + " and Eq.idEquipa = J.idOponente1 or Eq.idEquipa = J.idOponente2 ;"
    data.query(sql1).then(re1 => {
        re1 = "Elim" + JSON.stringify(re1);
        re = "Grupo" + JSON.stringify(re);
        re += re1;
        res.send(re);
    });
}




module.exports = router