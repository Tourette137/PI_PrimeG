const data = require('./query.js')

function createList(size){
  var arr = [];
  for (var i=0; i < size; i++){
    arr.push(i);
  }
  return arr;
}


function chunkArrayInGroups(arr, size) {
  var myArray = [];
  for(var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i+size));
  }
  return myArray;
}


// gerar oponentes dos jogos para grupos de size impar
function grupoJImpar(teams,jogos) {
    const rounds = teams.length,schedule = [];
  
    for (let round = 0; round < rounds; round++) {
      schedule[round] = [];
  
      for (let match = 0; match < teams.length / 2; match++) {
        const home = (round + match) % teams.length;
        const away = (teams.length - 1 - match + round) % teams.length;
  
        if (home !== away) {
          schedule[round].push({
            home: teams[home],
            away: teams[away]
          });
        }
      }
    }
  
    var sql = ""
    for(var round = 0;round < rounds;round++){
         for (let match = 0; match < teams.length / 2 - 1; match++){
               var id1 = schedule[round][match].home
          var id2 = schedule[round][match].away
          var jogo = jogos[round][match]
          sql +=  "update Jogo "+
                    "set idOponente1 = "+id1 + " ,idOponente2 = "+id2 +
                    " where idJogo = "+jogo.idJogo+";"
       }
    }
      return sql
  }
  
  function generate(posicoesValidas) {
    const randomElement = Math.floor(Math.random() * posicoesValidas.length);
    return randomElement;
  }
  
  function gerarJornadaImpar(jornada){
    var size = jornada.length,jornada2 = []
  
    for(var i = 0; i < size;i++)
      jornada2.push({id1:'',id2:''})
  
    for(var i = 0; i < size;i++){
      if(i == 0){
        jornada2[i].id1 = jornada[i].id2
        jornada2[i].id2 = jornada[i+1].id2
      }
      else if(i == size - 1){
        jornada2[i].id1 = jornada[i].id1
        jornada2[i].id2 = jornada[i-1].id1
      }
      else {
        jornada2[i].id1 = jornada[i-1].id1
        jornada2[i].id2 = jornada[i+1].id2
      }
    }
    return jornada2
  }
  
  function gerarJornadaPar(jornada){
    var size = jornada.length,jornada2 = []
  
    for(var i = 0; i < size;i++)
      jornada2.push({id1:'',id2:''})
  
    for(var i = 0; i < size;i++){
      jornada2[i].id1 = jornada[i].id2
      if(i == 0)
        jornada2[i].id2 = jornada[size - 1].id1
      else {
        jornada2[i].id2 = jornada[i - 1].id1
      }
    }
    return jornada2
  }
  
  function gerarJornada(jogadores,jornadaSize){
    var jornada = [],disp = jogadores
  
    for(var i = 0; i < jornadaSize;i++)
      jornada.push({id1:'',id2:''})
  
    for(var i = 0; i < jornadaSize;i++){
      var p = generate(disp)
      var value = disp[p]
      disp.splice(p,1)
  
      var p2 = generate(disp)
      var value2 = disp[p2]
      disp.splice(p2,1)
  
      jornada[i].id1 = value
      jornada[i].id2 = value2
    }
    return jornada
  }
  
  function grupoJPar(grupo,jogos){
    var size = grupo.length,n = (size - 1)
    var jornadas = [],jornadaSize = Math.floor(size / 2)
  
    jornadas.push(gerarJornada(grupo,jornadaSize))
  
    for(var i = 1; i < n;i+=2){
      jornadas.push(gerarJornadaPar(jornadas[i-1]))
      jornadas.push(gerarJornadaImpar(jornadas[i-1]))
    }
  
    var sql = ""
    for(var round = 0;round < n;round++){
         for (let match = 0; match <jornadaSize; match++){
               var id1 = jornadas[round][match].id1
          var id2 = jornadas[round][match].id2
          var jogo = jogos[round][match]
          sql +=  "update Jogo "+
                    "set idOponente1 = "+id1 + " ,idOponente2 = "+id2 +
                    " where idJogo = "+jogo.idJogo+";"
       }
    }
      return sql
  }
  
  //sorteio aleatorio sem grupos
  function sortearGruposRandom(jogadores,grupos){
    var gruposDisp = createList(grupos.length);
  
    for(var i=0;i < jogadores.length;i++){
        var j = jogadores[i]
  
        var pos = generate(gruposDisp);
        var value = gruposDisp[pos];
  
        grupos[value].jogadores.push(j);
        grupos[value].disponivel--;
  
        if(grupos[value].disponivel == 0){
          gruposDisp.splice(pos, 1);
        }
    }
    return grupos
  }
  
  function initClassificacao(equipas,tipo){
    let c = ""
    if (tipo == 1) {
      c = "1:" + equipas[0].nomeEquipa + "-0-0-0-0-0-0"
      for (var i = 1; i < equipas.length; i++) {
        c += "|"+equipas[i].nomeEquipa + "-0-0-0-0-0-0"
      }
    }
    else if (tipo == 2){
      c = "2:" + equipas[0].nomeEquipa + "-0-0-0-0-0-0-0"
      for (var i = 1; i < equipas.length; i++) {
        c += "|"+equipas[i].nomeEquipa + "-0-0-0-0-0-0-0"
      }
    }
    return c
  }
  
  // option
  //-1 aleatorio
  // 0 separar por clube
  // 1 separar por clube + ranking primeiro
  // 2 separar por clube + ranking primeiro e segundo
  function updateGrupos(jogadores,option,torneioID){
    var total = jogadores.length;
    var grupos = [],clubes=[];
  
    var sql = "SELECT idFaseGrupos from FaseGrupos where Torneio_idTorneio = " + torneioID + ";"
    data.query(sql).then(id => {
      var idFase_Grupos = id[0].idFaseGrupos;
      var sql2 = "select idGrupo, numeroGrupo, nParticipantes from grupo where faseGrupos_idFaseGrupos = " + idFase_Grupos + " order by numeroGrupo;"
      data.query(sql2).then(grupos2 => {
        for (var i=0; i < grupos2.length; i++)
          grupos.push({numeroGrupo:i+1,jogadores:[],disponivel:grupos2[i].nParticipantes,});
  
        if(option == -1){
          grupos = sortearGruposRandom(jogadores,grupos)
        }
  
        var sql3 = "select nomeDesporto from desporto as d "+
                  "join torneio as t on t.idDesporto = d.idDesporto "+
                  "where t.idTorneio = "+torneioID+";"
        data.query(sql3).then(res => {
          var desporto = res[0].nomeDesporto
          var t = (desporto == "Tenis de mesa" || desporto == "Badminton" || desporto == "Tenis" || desporto == "Volleyball" || desporto == "Padel") ? 2 : 1
          var sql4 = "";
          for (var i=0; i < grupos2.length; i++){
            var classificacao = initClassificacao(grupos[i].jogadores,t)
            sql4 += "update Grupo "+
                    "set classificacaoGrupo = '"+classificacao + 
                    "' where idGrupo = "+grupos2[i].idGrupo+";"
          }
          data.query(sql4).then(res2 => {
            var sql5 = "select j.idJogo, j.ronda, j.Grupo_idGrupo, g.numeroGrupo from jogo as j "+
                       "join grupo as g on g.idGrupo = j.Grupo_idGrupo "+
                       "join FaseGrupos as fg on fg.idFaseGrupos = g.faseGrupos_idFaseGrupos "+
                       "where fg.idFaseGrupos = " + idFase_Grupos +";"
            data.query(sql5).then(jogos => {
              var grupos3 = []
              for(var i=0;i<grupos2.length;i++){
                var s = grupos2[i].nParticipantes
                var rondas = (s % 2 == 0) ? (s-1) : s
                grupos3.push([])
                for(var i2=0;i2<rondas;i2++)
                  grupos3[i].push([])
              }
              for(var i=0;i<jogos.length;i++){
                grupos3[jogos[i].numeroGrupo-1][jogos[i].ronda-1].push(jogos[i])
              }
              var sql6 = ""
              for(var i=0;i<grupos2.length;i++){
                var playerIds = grupos[i].jogadores.map(x => x.idEquipa)
                if(grupos2[i].nParticipantes % 2 == 0)
                  sql6 += grupoJPar(playerIds,grupos3[i])
                else {
                  sql6 += grupoJImpar(playerIds,grupos3[i])
                }
              }
              //console.log(sql6);
              data.query(sql6)
            })
          })
        });
      });
    });
  }

  function toDate(dataTorneio,horaInicial,minutos){
    var h = Math.floor(minutos/60) + horaInicial
    var m = minutos % 60
    var d = h.toString() + ':' + m + ':00'
    var res = dataTorneio + " " + d
    return  res
  }
  
  function gerarCalendarioJogosGrupos(size,horaInicial,minutosInicial,campos,intervaloJ,duracaoJogo,idGrupo,dataTorneio){
    var jornadaSize = Math.floor(size / 2)
    var jornadas = []
    var sizeC = campos.length
    //let intervaloJ = intervalo + duracaoJogo
    var nJornadas = (size % 2 == 0) ? (size - 1) : size
    var n = Math.ceil(jornadaSize / sizeC)
    intervaloJ += n * duracaoJogo
  
    for(var i = 0; i < nJornadas;i++){
      jornadas.push([])
    }
  
    var sql = ""

  
    for(var i = 0; i < nJornadas;i++){
      for(var i2 = 0; i2 < jornadaSize;i2++){
        var jogo = {hora:'',numeroCampo:-1,Grupo_idGrupo:-1}
        if(i2 >= sizeC){
          var index = i2 % sizeC
          var round = Math.floor(i2 / sizeC)
          jogo.hora = toDate(dataTorneio,horaInicial,minutosInicial + round * duracaoJogo + intervaloJ * i)
          jogo.numeroCampo = campos[index]
        } else {
          jogo.hora = toDate(dataTorneio,horaInicial,minutosInicial + intervaloJ * i)
          jogo.numeroCampo = campos[i2]
        }
        jogo.Grupo_idGrupo = idGrupo
        jornadas[i].push(jogo)
  
        sql += "("+jogo.numeroCampo + ",'" + jogo.hora +"'," + idGrupo + "," + (i + 1) + ",0,1),"
      }
    }
    return sql
  }
  
  function gerarGrupos(tid,groupSize,inscritos,dataTorneio,horaInicial,minutosInicial,intervalo,duracao,campos){
    var total = inscritos.length
    console.log(groupSize)
    var gruposLen = Math.floor( total / groupSize);
    console.log(gruposLen)
    var extra = total % groupSize,grupos = [],gruposSize = []
  
    for (var i=0; i < gruposLen; i++)
        grupos.push(groupSize);
  
    if (extra === groupSize - 1){
        gruposLen += 1
        extra = 0
        grupos.push(groupSize-1);
    }
  
    for(var i=0; i < extra;i++)
      grupos[gruposLen - 1 - i] += 1
  
    var faseGrupos = {numeroGrupos:gruposLen,torneioID:tid,terminado:0}
    var idFase_Grupos = 0 // get id na bd
    
  
    var sql = "INSERT INTO FaseGrupos(numeroGrupos,Torneio_idTorneio,terminado)"+
              "VALUES (" + faseGrupos.numeroGrupos + "," + faseGrupos.torneioID +"," + faseGrupos.terminado + ");"
  
    //data.inserirFaseGrupos(faseGrupos);
    data.query(sql).then(inst => {
      sql = "SELECT idFaseGrupos from FaseGrupos where Torneio_idTorneio = " + faseGrupos.torneioID + ";"
  
      data.query(sql).then(id => {
        idFase_Grupos = id[0].idFaseGrupos;
        sql = "INSERT INTO Grupo(faseGrupos_idFaseGrupos,numeroGrupo,terminado,nParticipantes) VALUES "
        var i = 0
        for(i = 0;i < gruposLen-1;i++)
          sql += "(" +idFase_Grupos+','+ (i+1) +',0,'+grupos[i]+'),'
  
        sql += "(" +idFase_Grupos+','+ (i+1) +',0,'+grupos[i]+');'
        data.query(sql).then(r => {
          let sql2 = "SELECT idGrupo,numeroGrupo from Grupo where faseGrupos_idFaseGrupos = "+idFase_Grupos+" order by numeroGrupo;"
          data.query(sql2).then(ids => {
            let sql3  = "insert into Jogo (numeroCampo,hora,Grupo_idGrupo,ronda,estado,mao) values "

            let size = campos.length/ ids.length
            let camposGrupo = chunkArrayInGroups(campos,size)
            for(var i = 0;i<ids.length;i++)
                                                //tamanho,horaInicial,minutoInicial,campos,intervalo,duracaoJogo,idGrupo                 
              sql3 += gerarCalendarioJogosGrupos(grupos[i],horaInicial,minutosInicial,camposGrupo[i],intervalo,duracao,ids[i].idGrupo,dataTorneio)
  
            sql3 = sql3.replace(/.$/,";")
            data.query(sql3).then(res => {
              updateGrupos(inscritos,-1,tid)
            })
  
          })
        })
      })
    })
  }

  module.exports = gerarGrupos;
  