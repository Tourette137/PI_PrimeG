const mysql = require('mysql');
const config = require('./config');

function query(sql) {
  const connection = mysql.createConnection(config.db);
  return new Promise((resolve, reject) => {
    connection.query(sql, function(error,data){
      if(error)
        reject(error)
      else
        resolve(data);
    })
  })
  connection.end();
}

function getJogosParaSorteio(idTorneio){
  return "select j.idJogo,j.mao from jogo as j where idEtapa = "+
                "(select idEtapa from etapa as et "+
                  "join eliminatoria as elim on elim.idEliminatoria = et.Eliminatoria_idEliminatoria "+
                  "where elim.Torneio_idTorneio = "+idTorneio+" and et.numeroEtapa = "+
                        "(select max(E.numeroEtapa) from etapa as E "+
                        "join eliminatoria as elim on elim.idEliminatoria = E.Eliminatoria_idEliminatoria "+
                        "where elim.Torneio_idTorneio = "+idTorneio+")); "
}

function getEquipasFromElim(idTorneio){
  return "select E.idEquipa, E.ranking from Equipa as E"+
              " inner join Torneio_has_Equipa as TH on E.idEquipa = TH.Equipa_idEquipa"+
						  " inner join Torneio as T on TH.Torneio_idTorneio = T.idTorneio"+
              " where T.idTorneio = "+ idTorneio + " and TH.pendente=1;"
}

function getApuradosFromGrupos(idTorneio) {
  return "select g.classificacaoGrupo, g.numeroGrupo from grupo as g "+
            "join FaseGrupos as fg on fg.idFaseGrupos = g.faseGrupos_idFaseGrupos "+
            "where fg.Torneio_idTorneio = "+idTorneio+";"
}

function getCountEquipasElim(idTorneio){
  return "select count(*) as count from Equipa as E"+
              " inner join Torneio_has_Equipa as TH on E.idEquipa = TH.Equipa_idEquipa"+
						  " inner join Torneio as T on TH.Torneio_idTorneio = T.idTorneio"+
              " where T.idTorneio = "+ idTorneio + " and TH.pendente=1;"
}

function getJogosParaCalendarioElim(idEliminatoria){
  return "select j.idJogo,e.numeroEtapa,j.mao from jogo as j "+
             "join etapa as e on e.idEtapa = j.idEtapa "+
             "where e.Eliminatoria_idEliminatoria = "+idEliminatoria +
             " order by e.numeroEtapa,j.ronda;"
}

function updateJogoCH(numeroCampo,hora,idJogo){
  return "update Jogo "+
            "set numeroCampo = "+numeroCampo+" , hora = '"+hora +
            "' where idJogo = "+idJogo+";"
}

//recebe jogos e dá update
function updateJogos(jogos){
	var sql = "";
	for(var i = 0; i < jogos.length; i++)
  	sql += "update Jogo "+
           "set idOponente1 = "+jogos[i].idOponente1 +" , idOponente2 = "+jogos[i].idOponente2 +
            " where idJogo = "+jogos[i].idJogo+";"
	return sql
}

function updateFecharJogo(resultado,idJogo,vencedor){
  return "update Jogo " +
            "set resultado = '" + resultado + "' , estado = 2 , vencedor = " + vencedor +
            " where idJogo = " + idJogo + ";"
}


//Provavelmente vai ser necessário dar a mão
function getJogo(idJogo){
  return "select Grupo_idGrupo, idEtapa,idOponente1,idOponente2,ronda,mao from Jogo Where idJogo = "+idJogo+";"
}

function getClassificacaoGrupo(idGrupo){
  return "select classificacaoGrupo from Grupo Where idGrupo = "+idGrupo+";"
}

function updateClassificacaoGrupo(classificacao,idGrupo,terminado){
  return "update Grupo " +
            "set classificacaoGrupo = '" + classificacao + "' , terminado = "+ terminado +
            " where idGrupo = " + idGrupo + ";"
}

function getJogosAbertos(idGrupo){
  return "select count(*) as count from Jogo Where Grupo_idGrupo = "+idGrupo+" and (estado = 0 or estado = 1);"
}

function getJogoEtapaSeguinte(idEtapa){
  return "select j.idJogo,j.ronda,j.mao from jogo as j where j.idEtapa = (select idEtapa from Etapa as et "+
          "where et.Eliminatoria_idEliminatoria = (select Eliminatoria_idEliminatoria from Etapa as E where E.idEtapa = "+idEtapa+") "+
          "and et.numeroEtapa = ((select numeroEtapa from Etapa as E where E.idEtapa = "+idEtapa+")-1));"
}

function updateJogoO1(id,idJogo){
  return "update Jogo "+
            "set idOponente1 = "+id+
            " where idJogo = "+idJogo+";"
}
function updateJogoO2(id,idJogo){
  return "update Jogo "+
            "set idOponente2 = "+id+
            " where idJogo = "+idJogo+";"
}

module.exports = {
  query,
  getJogosParaSorteio,
  getEquipasFromElim,
  getApuradosFromGrupos,
  getCountEquipasElim,
  getJogosParaCalendarioElim,
  updateJogoCH,
  updateJogos,
  updateFecharJogo,
  getJogo,
  getClassificacaoGrupo,
  getJogosAbertos,
  getJogoEtapaSeguinte,
  updateJogoO1,
  updateJogoO2,
  updateClassificacaoGrupo
}