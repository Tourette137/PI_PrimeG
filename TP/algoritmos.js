const { query } = require('express');
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
          id1: teams[home],
          id2: teams[away]
        });
      }
    }
  }
	return schedule
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
  
    return jornadas;
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
      c = "1:" + equipas[0].nomeEquipa + "-" + equipas[0].idEquipa + "-0-0-0-0-0-0"
      for (var i = 1; i < equipas.length; i++) {
        c += "|"+equipas[i].nomeEquipa + "-" + equipas[i].idEquipa + "-0-0-0-0-0-0"
      }
    }
    else if (tipo == 2){
      c = "2:" + equipas[0].nomeEquipa + "-" + equipas[0].idEquipa + "-0-0-0-0-0-0-0"
      for (var i = 1; i < equipas.length; i++) {
        c += "|"+equipas[i].nomeEquipa + "-" + equipas[i].idEquipa + "-0-0-0-0-0-0-0"
      }
    }
    return c
  }
  
  function updateJornadasGrupos(jornadas,jogos,sizeG,mao){
    var n = (sizeG % 2 == 0) ? (sizeG-1) : sizeG
    var jornadaSize = Math.floor(sizeG / 2);
    var sql = ""
    for(var round = 0;round < n;round++){
       for (let match = 0; match <jornadaSize; match++){
           var id1 = (mao == 1) ? jornadas[round][match].id1 : jornadas[round][match].id2
          var id2 = (mao == 1) ? jornadas[round][match].id2 :  jornadas[round][match].id1
          var jogo = jogos[round][match]
          sql +=  "update Jogo "+
                  "set idOponente1 = "+id1 + " ,idOponente2 = "+id2 +
                  " where idJogo = "+jogo.idJogo+";"
       }
    }
    return sql
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
            var sql5 = "select j.idJogo, j.ronda, j.Grupo_idGrupo, g.numeroGrupo, j.mao from jogo as j "+
                       "join grupo as g on g.idGrupo = j.Grupo_idGrupo "+
                       "join FaseGrupos as fg on fg.idFaseGrupos = g.faseGrupos_idFaseGrupos "+
                       "where fg.idFaseGrupos = " + idFase_Grupos +";"
            data.query(sql5).then(jogos => {
              var grupos3 = [], grupos3mao2 = []
              for(var i=0;i<grupos2.length;i++){
                var s = grupos2[i].nParticipantes
                var rondas = (s % 2 == 0) ? (s-1) : s
                grupos3.push([])
                grupos3mao2.push([])
                for(var i2=0;i2<rondas;i2++){
                  grupos3[i].push([])
                  grupos3mao2[i].push([])
                }
              }
              for(var i=0;i<jogos.length;i++){
                if(jogos[i].mao==1){
                  grupos3[jogos[i].numeroGrupo-1][jogos[i].ronda-1].push(jogos[i])
                }
                else {
                  grupos3mao2[jogos[i].numeroGrupo-1][jogos[i].ronda-1].push(jogos[i])
                }
              }
              var sql6 = ""
              for(var i=0;i<grupos2.length;i++){
                var playerIds = grupos[i].jogadores.map(x => x.idEquipa)
                var jornadas = []
                if(grupos2[i].nParticipantes % 2 == 0)
                  jornadas = grupoJPar(playerIds,grupos3[i])
                else {
                  jornadas = grupoJImpar(playerIds,grupos3[i])
                }
                sql6 += updateJornadasGrupos(jornadas,grupos3[i],grupos2[i].nParticipantes,1)
                if(grupos3mao2[0][0].length > 0) {
                  sql6 += updateJornadasGrupos(jornadas,grupos3mao2[i],grupos2[i].nParticipantes,2)
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
  
  function gerarCalendarioJogosGrupos(size,horaInicial,minutosInicial,campos,intervaloJ,duracaoJogo,idGrupo,dataTorneio,mao){
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
  
        sql += "("+jogo.numeroCampo + ",'" + jogo.hora +"'," + idGrupo + "," + (i + 1) + ",0," + mao + "),"
      }
    }
    return sql
  }
  
  function gerarGrupos(tid,groupSize,inscritos,dataTorneio,horaInicial,minutosInicial,intervalo,duracao,campos,mao){
    var total = inscritos.length
    console.log(groupSize)
    var gruposLen = Math.floor( total / groupSize);
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
            let l = tempo2MaoGrupos(horaInicial,minutosInicial,ids.length,campos.length,duracao,intervalo)
            for(var i = 0;i<ids.length;i++){
                                                //tamanho,horaInicial,minutoInicial,campos,intervalo,duracaoJogo,idGrupo                 
              sql3 += gerarCalendarioJogosGrupos(grupos[i],horaInicial,minutosInicial,camposGrupo[i],intervalo,duracao,ids[i].idGrupo,dataTorneio,1)
              if(mao == 2){
                sql3 += gerarCalendarioJogosGrupos(grupos[i],l[0],l[1],camposGrupo[i],intervalo,duracao,ids[i].idGrupo,dataTorneio,2)
              }
            }
            sql3 = sql3.replace(/.$/,";")
            console.log(sql3)
            data.query(sql3).then(res => {
              updateGrupos(inscritos,-1,tid)
            })
          })
        })
      })
    })
  }


  function tempo2MaoGrupos(horas,minutos,size,nMesas,duracao,intervalo){
    var jornadas = (size % 2 == 0) ? (size - 1) : size
    var jornadaSize = Math.floor(size / 2)
    var rounds = Math.ceil(jornadaSize/nMesas)
    var tempoJornada = duracao * rounds + intervalo
    var total = tempoJornada * jornadas
    var minutos2 = total + minutos + intervalo
    
    horas += Math.floor(total/60)
    var min2 = (minutos2 > 60) ? (minutos2 % 60) : minutos2
    return [horas,min2]
  }


  function atualizaClassificacao(classificacao,eq1,eq2,resultado){
    let l = classificacao.split(':')
    let tipo = l[0]
    let equipas = l[1].split('|')
    let lista = []
  
    if (tipo == 1) {
      let sp = resultado.split('-')
      let vencedor = (parseInt(sp[0]) > parseInt(sp[1])) ? 1 : ((parseInt(sp[0]) < parseInt(sp[1])) ? 2 : 0)
  
      for (var i = 0; i < equipas.length; i++) {
        let campos = equipas[i].split('-')
        struct1(lista,campos,sp,vencedor,eq1,eq2,i)
      }
  
      lista.sort(function(a, b) {
        if (a.pontos < b.pontos) return 1;
        if (a.pontos > b.pontos) return -1;
        return (b.golosM - b.golosS) - (a.golosM - a.golosS);
      });
  
    } else if (tipo == 2) {
      let sp = resultado.split('|')
      let pontosGanhos1 = 0, pontosGanhos2 = 0, setsGanhos1 = 0,setsGanhos2 = 0;
  
      for (var i = 0; i < sp.length; i++){
        let sp2 = sp[i].split('-')
        let vencedor = (parseInt(sp2[0]) > parseInt(sp2[1])) ? 1 : 2
        pontosGanhos1 += parseInt(sp2[0])
        pontosGanhos2 += parseInt(sp2[1])
        if(vencedor == 1)
          setsGanhos1++
        else {
          setsGanhos2++
        }
      }
  
      let vencedor = (setsGanhos1 > setsGanhos2) ? 1 : 2
  
      for (var i = 0; i < equipas.length; i++) {
        let campos = equipas[i].split('-')
        struct2(lista,campos,vencedor,eq1,eq2,i,pontosGanhos1, pontosGanhos2, setsGanhos1,setsGanhos2)
      }
  
      lista.sort(function(a, b) {
        if (a.pontos < b.pontos) return 1;
        if (a.pontos > b.pontos) return -1;
        return (b.setsGanhos / b.setsPerdidos) - (a.setsGanhos - a.setsPerdidos);
      });
    }
  
    let c = listaToString(lista,tipo)
  
    return c
  }

  //Assume que recebe resultado do tipo 3-0 ou assim (TEMOS DE MUDAR UM BOCADO)
  function getVencedor(resultado,idOponente1,idOponente2) {
    let sp2 = resultado.split('|')
    let sp = sp2[0].split('-')
    return (parseInt(sp[0]) > parseInt(sp[1])) ? idOponente1 : ((parseInt(sp[0]) < parseInt(sp[1])) ? idOponente2 : -1)
  }


  function tempoProximaEtapa(horas,minutos,sizeEtapa,nMesas,duracao,intervalo){
    var rounds = Math.ceil(sizeEtapa/nMesas);
    var min = rounds * duracao + intervalo;
    var min2 = ((min+minutos)>60) ? (min+minutos)%60 : min+minutos
    horas += Math.floor((min+minutos)/60)
    return [horas,min2]
  }

  // recebe jogos de uma etapa e (mao 1 ou 2) e dá update da mesa e hora
  function updateCalendarioEtapa(horaInicial,minutosInicial,campos,duracaoJogo,idsJogos,dataTorneio){
    var sizeC = campos.length;
    var size = idsJogos.length;
    var sql = "";

    for(var i = 0; i < size;i++){
      var jogo = {idJogo:idsJogos[i],hora:'',numeroCampo:-1}
      if(i >= sizeC){
        var index = i % sizeC
        var round = Math.floor(i / sizeC)
        jogo.hora = toDate(dataTorneio,horaInicial,minutosInicial + round * duracaoJogo)
        jogo.numeroCampo = campos[index]
      } else {
        jogo.hora = toDate(dataTorneio,horaInicial,minutosInicial)
        jogo.numeroCampo = campos[i]
      }
      sql += data.updateJogoCH(jogo.numeroCampo,jogo.hora,jogo.idJogo)
    }
    return sql
  }

  function listaToString(lista,tipo){
    let s = str(tipo)+':'
    if(tipo == 1){
      for (var i = 0; i < lista.length; i++) {
        s += lista[i].nome+'-'+lista[i].id+'-'+lista[i].pontos+'-'+lista[i].vitorias+'-'+
             lista[i].empates+'-'+lista[i].derrotas+'-'+lista[i].golosM+'-'+lista[i].golosS
        s += (i == lista.length - 1) ? '' : '|'
      }
    } else {
      for (var i = 0; i < lista.length; i++) {
        s += lista[i].nome+'-'+lista[i].id+'-'+lista[i].pontos+'-'+lista[i].vitorias+'-'+
             lista[i].derrotas+'-'+lista[i].setsGanhos+'-'+lista[i].setsPerdidos+'-'+
             lista[i].pontosGanhos+'-'+lista[i].pontosPerdidos
        s += (i == lista.length - 1) ? '' : '|'
      }
    }
    return s
  }

  function struct1(lista,campos,sp,vencedor,eq1,eq2,i){
    lista.push({nome:campos[0],id:parseInt(campos[1]),pontos:parseInt(campos[2]),
                vitorias:parseInt(campos[3]),empates:parseInt(campos[4]),derrotas:parseInt(campos[5]),
                golosM:parseInt(campos[6]),golosS:parseInt(campos[7])})
  
    if(campos[1] == eq1){
      if(vencedor == 1){
        lista[i].pontos += 3
        lista[i].vitorias += 1
      }
      else if (vencedor == 0){
        lista[i].pontos += 1
        lista[i].empates += 1
      } else {
        lista[i].derrotas += 1
      }
  
      lista[i].golosM += parseInt(sp[0])
      lista[i].golosS += parseInt(sp[1])
    }
    else if (campos[1] == eq2){
      if(vencedor == 2){
        lista[i].pontos += 3
        lista[i].vitorias += 1
      }
      else if (vencedor == 0){
        lista[i].pontos += 1
        lista[i].empates += 1
      } else {
        lista[i].derrotas += 1
      }
  
      lista[i].golosM += parseInt(sp[1])
      lista[i].golosS += parseInt(sp[0])
    }
  }

  function struct2(lista,campos,vencedor,eq1,eq2,i,pontosGanhos1, pontosGanhos2, setsGanhos1,setsGanhos2){
    lista.push({nome:campos[0],id:parseInt(campos[1]),pontos:parseInt(campos[2]),
                vitorias:parseInt(campos[3]),derrotas:parseInt(campos[4]),setsGanhos:parseInt(campos[5]),
                setsPerdidos:parseInt(campos[6]),pontosGanhos:parseInt(campos[7]),pontosPerdidos:parseInt(campos[8])})
  
    if(campos[1] == eq1){
      lista[i].pontosGanhos += pontosGanhos1
      lista[i].pontosPerdidos += pontosGanhos2
      lista[i].setsPerdidos += setsGanhos2
      lista[i].setsGanhos += setsGanhos1
      if(vencedor == 1){
        lista[i].vitorias += 1
        lista[i].pontos += 3
      }
      else {
        lista[i].derrotas += 1
      }
    }
    else if (campos[1] == eq2){
      lista[i].pontosGanhos += pontosGanhos2
      lista[i].pontosPerdidos += pontosGanhos1
      lista[i].setsPerdidos += setsGanhos1
      lista[i].setsGanhos += setsGanhos2
      if(vencedor == 2){
        lista[i].vitorias += 1
        lista[i].pontos += 3
      }
      else {
        lista[i].derrotas += 1
      }
    }
  }

  function posicoesDisp(chunks,posicoes) {
    var s = posicoes.length;
    var listPos =[];
    //console.log("posDis recebe:"+chunks + "posicoes "+posicoes);
  
    for (var i=0; i < s; i++){
      var pos = posicoes[i];
      var index = findPos(chunks,pos);
  
      if(index > -1)
        listPos.push(index);
    }
    return listPos.sort().reverse();
  }

  function findPos(chunks,pos){
    var s = chunks.length;
    for (var i=0; i < s; i++){
      const index = chunks[i].indexOf(pos);
      //console.log("index "+index + "em "+chunks[i]);
      if (index > -1)
        return i;
    }
    return i;
  }

  //sortear jogadores sem restrições | recebe ids dos jogadores e ids dos jogos da etapa ordenados por ronda
function sortear(jogadores,idsJogos){
  var jogos = [];
  var nJogadores = jogadores.length

  for(var ronda = 0; ronda < idsJogos.length; ronda++)
  	jogos.push({idJogo:idsJogos[ronda],idOponente1:-1,idOponente2:-1})

	//sortear 1 jogador para cada jogo
  for(var i=0;i < idsJogos.length;i++){
      var jogo = jogos[i]

      var pos = generate(jogadores);
      var idJogador = jogadores[pos];

      jogadores.splice(pos, 1);

      jogos[i].idOponente1 = idJogador
  }

  var listPos = createList(idsJogos.length),val = 0;
	//sortear jogadores restantes
  while(val == 0){
  		if(jogadores.length == 1)
      	val = 1

      var idJogador = jogadores[0]
      jogadores.splice(0, 1);

      var pos = generate(listPos);
      var index = listPos[pos];

      listPos.splice(pos, 1);

      jogos[index].idOponente2 = idJogador
  }
  return jogos;
}

//tempoProximaEtapa(horas,minutos,sizeEtapa,nMesas,duracao,intervalo)

  function updateCalendarioElim(idEliminatoria,etapaIds,mao,mesas,hora,minutos,duracao,intervalo,dataTorneio){
    var sql6 = data.getJogosParaCalendarioElim(idEliminatoria)
    data.query(sql6).then(sel => {
      var jogosEtapa = []
      var jogosEtapa2 = []
      for (var i = 0; i < etapaIds.length; i++){
        jogosEtapa[i] = []
        jogosEtapa2[i] = []
      }
      for (var i = 0; i < sel.length; i++){
        if(sel[i].mao == 2)
          jogosEtapa2[sel[i].numeroEtapa-1].push(sel[i].idJogo)
        else {
          jogosEtapa[sel[i].numeroEtapa-1].push(sel[i].idJogo)
        }
      }
      var sql7 = "", hora2 = hora, min2 = minutos, temp2 = []
      //,hora = 14,minutos = 15;
      for (var i = etapaIds.length - 1; i >= 0; i--) {  //hora += x --- CALCULAR 
        sql7 += updateCalendarioEtapa(hora2,min2,mesas,duracao,jogosEtapa[i],dataTorneio);
        temp2 = tempoProximaEtapa(hora2,min2,etapaIds.length,mesas.length,duracao,intervalo);
        hora2 = temp2[0]
        min2 = temp2[1]
        if(mao == 2){
          //VERIFICAR SE MIN>60 E HORAS>24
          //Pensar nisto minutos+30???? calcular valor
          sql7 += updateCalendarioEtapa(hora2,min2,mesas,duracao,jogosEtapa2[i],dataTorneio); 
          temp2 = tempoProximaEtapa(hora2,min2,etapaIds.length,mesas.length,duracao,intervalo);
          hora2 = temp2[0]
          min2 = temp2[1]
        } 
      }
      data.query(sql7);
    })
  }

  function etapaPar(size){
    var par = (size==1) ? {n:1,nome:'Final'} :
              (size == 2) ? {n:2,nome:'1/2'} :
              (size == 4) ? {n:3,nome:'1/4'} :
              (size == 8) ? {n:4,nome:'1/8'} :
              (size == 16) ? {n:5,nome:'1/16'} :
              (size == 32) ? {n:6,nome:'1/32'} :
              (size == 64) ? {n:7,nome:'1/64'} :
              (size == 128) ? {n:8,nome:'1/128'} : {n:9,nome:'1/256'}
      return par
  }

  // recebe jogos gerados no sorteio e ids jogos da 2mao e inverte quem joga em casa
  function gerar2Mao(jogos,idsJogos){
    var jogos2 = []
    for(var i = 0; i < jogos.length; i++){
      jogos2.push({idJogo:idsJogos[i],idOponente1:jogos[i].idOponente2,idOponente2:jogos[i].idOponente1})
    }
    return jogos2;
  }

  function gerarEliminatorias(nJogadores,idTorneio,mao,mesas,hora,minutos,duracao,intervalo,dataTorneio){
    var sql = "INSERT INTO Eliminatoria(numeroJogadores,Torneio_idTorneio,gerado) values ("+
              nJogadores + "," + idTorneio + ",0);"
    data.query(sql).then(insert1 => {
      var sql2 = "SELECT idEliminatoria from Eliminatoria where Torneio_idTorneio = " + idTorneio + ";"
      data.query(sql2).then(id => {
        var mapSize = 1,par={n:0,nome:''},idEliminatoria = id[0].idEliminatoria;
        var sql3 = "INSERT INTO Etapa(numeroEtapa,nomeEtapa,Eliminatoria_idEliminatoria,terminado) VALUES "
        for(mapSize = 1; mapSize < nJogadores; mapSize*=2){
          par = etapaPar(mapSize)
          sql3 += "("+par.n + ",'" + par.nome + "'," + idEliminatoria + ",0)"
          sql3 += (mapSize*2 >= nJogadores) ? ';' : ','
        }
        data.query(sql3).then(insert2 => {
          var sql4 = "select idEtapa, numeroEtapa from Etapa where Eliminatoria_idEliminatoria = "+idEliminatoria+";"
          data.query(sql4).then(etapaIds => {
            var sql5 = "INSERT INTO Jogo(numeroCampo,hora,ronda,estado,idEtapa,mao) VALUES "
            for (var i = 0; i < etapaIds.length; i++) {
              var etapaSize = Math.pow(2,(etapaIds[i].numeroEtapa - 1))
              for (var ronda = 1; ronda < etapaSize + 1; ronda++) {
                sql5 += "(0,'10:10:10'," +ronda+',0,'+etapaIds[i].idEtapa+',1)'
                if(mao == 2)
                  sql5 += ",(0,'10:10:10'," +ronda+',0,'+etapaIds[i].idEtapa+',2)'
  
                sql5 += (i == etapaIds.length - 1 && ronda == etapaSize) ? ';' : ','
              }
            }
            data.query(sql5).then(insert3 => {
              updateCalendarioElim(idEliminatoria,etapaIds,mao,mesas,hora,minutos,duracao,intervalo,dataTorneio)
            })
          })
        })
      })
    })
  }


  //tipoSorteio -> 1 - aleatório
  // **** -> 2 - clubes
  // **** -> 3 - ranking
  // DEPOIS VÊ-SE
  function sortearElim(inscritos,idTorneio,tipoSorteio){
    //DEPOIS PRECISAMOS USAR O TIPO SORTEIO PARA OS DIFERENTES TIPOS EXISTENTES
    var sql2 = data.getJogosParaSorteio(idTorneio)
    data.query(sql2).then(ids => {
      var idsJogos = [],idsJogos2 = [];
      for (var i = 0; i < ids.length; i++) {
        if(ids[i].mao == 1)
          idsJogos.push(ids[i].idJogo)
        else {
          idsJogos2.push(ids[i].idJogo)
        }
      }
      var jogos = sortear(inscritos.map(x => x.idEquipa),idsJogos)
      var sql3 = data.updateJogos(jogos)
      if(idsJogos2.length > 0)
        sql3 += data.updateJogos(gerar2Mao(jogos,idsJogos2))
  
      data.query(sql3)
    })
  }

  function apuradosGrupo(nApuradosGrupo,classificacao,numeroGrupo,apurados){
    let l = classificacao.split(':')
    let equipas = l[1].split('|')
  
    for (var i = 0; i < nApuradosGrupo; i++) {
      let campos = equipas[i].split('-')
      //BUSCAR CLUBE????
      apurados.push({idEquipa:parseInt(campos[1]),ranking:numeroGrupo,posicao:i+1})
    }
  }
  
  function equipasFromGrupos(nApuradosGrupo,idTorneio,tipoSorteio){
    var sql = data.getApuradosFromGrupos(idTorneio)
    data.query(sql).then(rank => {
      console.log(rank);
      var apurados = []
      for (var i = 0; i < rank.length; i++) {
        apuradosGrupo(nApuradosGrupo,rank[i].classificacaoGrupo,rank[i].numeroGrupo,apurados)
      }
      console.log(apurados)
      sortearElim(apurados,idTorneio,tipoSorteio)
    })
  }

  module.exports = {
    gerarGrupos,
    gerarEliminatorias,
    sortearElim,
    equipasFromGrupos,
    getVencedor,
    atualizaClassificacao
  }
