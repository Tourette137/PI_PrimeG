const { application } = require('express');
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
            res.send("O torneio não existe");
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
        res.send("Não existem jogos a decorrer.");
    }

}


//Listar torneios disponiveis
//?federado=...&desporto=...&localidade=...
router.get("/disponiveis",(req,res) => {
    //0 -> inscricoes abertas
    //1 -> inscricoes fechadas
    let sql = "select * from torneio as T ";
    
    //Filtro de Localidade 
    if(req.query.localidade != null){
        if(!isNaN(req.query.localidade)){
            sql += "join Espaco as E on T.Espaco_idEspaco = E.idEspaco " +
                   "join Localidade as L on E.Localidade_idLocalidade = L.idLocalidade " +
                   "where T.inscricoesAbertas = 0 and idLocalidade = " + req.query.localidade;
                   
        }
        else {sql += " where T.inscricoesAbertas = 0 " }
    }
    else {
        sql += " where T.inscricoesAbertas = 0 "
    }

    //Filtro de Federado
    if(req.query.federado != null){
        if(!isNaN(req.query.federado)){
            sql += " and isFederado = " + req.query.federado;
        }
    }
    //Filtro de Desporto
    if(req.query.desporto != null){
        if(!isNaN(req.query.desporto)){
            sql += " and idDesporto = " + req.query.desporto;
        }
    }

    sql += ";";
    data.query(sql).then(re => {
        if(re.length != 0){
            res.send(re);
        }
        else {
            res.send("Não existem torneios disponíveis");
        }
    });
});


//Classificação final de um torneio
//Classificao final do grupo + Classificacao das eliminatorias.
router.get("/:id/classificacaofinal", (req,res) => {
    const idTorneio = req.params.id;
    let sql = "select tipoTorneio from Torneio where idTorneio = " + idTorneio + ";";
    data.query(sql).then(re => {
        if(re.length!=0){
            getClassificacaoTorneio(re[0].tipoTorneio,idTorneio,res);
        }
        else {
            res.send("O torneio não existe");
        }      
    });
});

function getClassificacaoTorneio(tipoTorneio, idTorneio, res) {
 

}



module.exports = router