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
  function updateGrupos(jogadores,option,torneioID,callback){
    var total = jogadores.length;
    var grupos = [],clubes=[];

    var sql = "SELECT idFaseGrupos from FaseGrupos where Torneio_idTorneio = " + torneioID + ";"
    data.query(sql).then(id => {
      var idFase_Grupos = id[0].idFaseGrupos;
      var sql2 = "select idGrupo, numeroGrupo, nParticipantes from grupo where faseGrupos_idFaseGrupos = " + idFase_Grupos + " order by numeroGrupo;"
      data.query(sql2).then(grupos2 => {
        for (var i=0; i < grupos2.length; i++)
          grupos.push({numeroGrupo:i+1,jogadores:[],disponivel:grupos2[i].nParticipantes,});

        //posiciona cabecas de serie (nenhum, 1º ou 1º e 2º) e sorteia o resto aleatorio
        if(option < 3){
          if(option != 0){
            jogadores = sortearCabecasSerie(jogadores,grupos,option)}
          sortearGruposRandom(jogadores,grupos)
        }
        else {//option 3 sortear por clubes | 4 e 5 sortear por clubes + 1 ou 2 cabecas de serie)
          var clubes = organizarClubes(jogadores,grupos,option - 3)
          sortearGrupos(grupos,option,clubes)
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
              data.query(sql6).then(() => callback())
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
    var sizeC = campos.length;
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

  function gerarGrupos(tid,groupSize,inscritos,dataTorneio,horaInicial,minutosInicial,intervalo,duracao,campos,mao,tipoSorteio,res,callback){
    var total = inscritos.length
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
            //estoura quando tem menos mesas que grupos
            for(var i = 0;i<ids.length;i++){
              sql3 += gerarCalendarioJogosGrupos(grupos[i],horaInicial,minutosInicial,camposGrupo[i],intervalo,duracao,ids[i].idGrupo,dataTorneio,1)
              if(mao == 2){
                let l = tempo2MaoGrupos(horaInicial,minutosInicial,grupos[i],camposGrupo[i].length,duracao,intervalo)
                sql3 += gerarCalendarioJogosGrupos(grupos[i],l[0],l[1],camposGrupo[i],intervalo,duracao,ids[i].idGrupo,dataTorneio,2)
              }
            }
            sql3 = sql3.replace(/.$/,";")
            data.query(sql3).then(res1 => {
              updateGrupos(inscritos,tipoSorteio,tid,callback)
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
  //11-0|2-11|3-11|...
  function getVencedor(resultado,idOponente1,idOponente2) {
    setsGanhos1 = 0
    setsGanhos2 = 0
    let sp2 = resultado.split('|')
    if(sp2.length > 1){
      for(i=0; i < sp2.length; i++){
        let pontos = sp2[i].split('-')
        if(parseInt(pontos[0])>parseInt(pontos[1])) setsGanhos1 += 1
        else setsGanhos2 += 1
      }
      return ((setsGanhos1 > setsGanhos2) ? idOponente1 :  idOponente2)
    }
    let sp = sp2[0].split('-')
    return (parseInt(sp[0]) > parseInt(sp[1])) ? idOponente1 : ((parseInt(sp[0]) < parseInt(sp[1])) ? idOponente2 : -1)
  }


  function tempoProximaEtapa(horas,minutos,sizeEtapa,nMesas,duracao,intervalo){
    var rounds = Math.ceil(sizeEtapa/nMesas);
    var min = rounds * parseInt(duracao);
    min = min + parseInt(intervalo);
    var min2 = ((min+minutos)>60) ? (min+minutos)%60 : (min+minutos);
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
    let s = `${tipo}`+':'
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
    return listPos.sort()
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

  function updateCalendarioElim(idEliminatoria,etapaIds,mao,mesas,hora,minutos,duracao,intervalo,dataTorneio,callback){
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
      data.query(sql7).then(() => callback());
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

  function gerarEliminatorias(nJogadores,idTorneio,mao,mesas,hora,minutos,duracao,intervalo,dataTorneio,res,callback){
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
              updateCalendarioElim(idEliminatoria,etapaIds,mao,mesas,hora,minutos,duracao,intervalo,dataTorneio,callback)
            })
          })
        })
      })
    })
  }


  //tipoSorteio de grupos
  // 1 - aleatório
  // 2 - dividir 1º e 2º com ranking do 1º do grupo
  // 3 - dividir 1º e 2º e afastar clubes com ranking do 1º do grupo

  //tipoSorteio sem grupos
  // 1 - aleatório
  // 2 - aleatório + 2 rank
  // 3 - aleatorio + 4 rank
  // 4 - aleatorio + 8 rank
  // 5 - aleatorio + 16 rank

  // 6 - clubes
  // 7 - clubes + 2 rank
  // 8 - clubes + 4 rank
  // 9 - clubes + 8 rank
  // 10 - clubes + 16 rank

  // rank max = inscritos/2 caso contrário rebenta
  // futuramente adicionar 32 rank e 64 rank
  // gerado fica a 2 até ser fechado no front
  function sortearElim(inscritos,idTorneio,tipoSorteio,tipo2,res,callback){
    //DEPOIS PRECISAMOS USAR O TIPO SORTEIO PARA OS DIFERENTES TIPOS EXISTENTES
    let sql1  = `Select idEliminatoria from Eliminatoria as E join Torneio as T on
                T.idTorneio = E.Torneio_idTorneio where T.idTorneio = ${idTorneio};`
    data.query(sql1).then(re2 => {
        if (re2.length != 0) {
            let sql2 = `update Eliminatoria set gerado = 2 where idEliminatoria = ${re2[0].idEliminatoria};`
            data.query(sql2).then(re3 => {
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
                  var jogos = [];

                  if(tipoSorteio == 1)
                    jogos = sortear(inscritos.map(x => x.idEquipa),idsJogos)
                  else {
                    var mapa = [],nivel = 0,op = 0;
                    if(tipo2 == 1){  // from grupos
                      op = tipoSorteio - 1
                    }
                    else {
                      op = (tipoSorteio > 5) ? 2 : 1
                      nivel = (op == 1) ? (tipoSorteio - 2) : (tipoSorteio - 7)
                    }
                    mapa = sorteioEliminatorias(inscritos,nivel,tipo2,op)
                    jogos = mapaToJogos(mapa,idsJogos)
                  }


                  var sql3 = data.updateJogos(jogos)
                  if(idsJogos2.length > 0)
                    sql3 += data.updateJogos(gerar2Mao(jogos,idsJogos2))

                  data.query(sql3).then(() => callback())
                })
            })
        }
    })
  }

  function apuradosGrupo(nApuradosGrupo,classificacao,numeroGrupo,apurados,inscritos){
    let l = classificacao.split(':')
    let equipas = l[1].split('|')

    for (var i = 0; i < nApuradosGrupo; i++) {
      let campos = equipas[i].split('-')
      var id = parseInt(campos[1])
      var nome = campos[0]
      //BUSCAR CLUBE????
      var index = inscritos.map(c => c.idEquipa).indexOf(id);
      var clube = null
      if(index == -1)
        console.log("escachou nos clubes");
      else {
        clube = inscritos[index].clube
      }
      apurados.push({idEquipa:id,nomeEquipa:nome,clube:clube,ranking:numeroGrupo,posicao:i+1})
    }
  }

  function equipasFromGrupos(nApuradosGrupo,idTorneio,tipoSorteio,res,callback){
    var sql = data.getApuradosFromGrupos(idTorneio)
    data.query(sql).then(rank => {
      console.log(rank);
      var apurados = []
      var sql = data.getEquipasFromElim(idTorneio);
      data.query(sql).then(inscritos => {
        for (var i = 0; i < rank.length; i++) {
          apuradosGrupo(nApuradosGrupo,rank[i].classificacaoGrupo,rank[i].numeroGrupo,apurados,inscritos)
        }
        console.log(apurados)
        sortearElim(apurados,idTorneio,tipoSorteio,1,res,callback)
      })
    })
  }


  function calculaVencedor2Maos(res1,res2,id1,id2){
    let sp = res1.split('|')
    let vencedor = -1;

    if(sp.length > 1){
      let pontosGanhos1 = 0, pontosGanhos2 = 0, setsGanhos1 = 0,setsGanhos2 = 0;

      for (var r = 0; r < 2; r++){
        if(r == 1)
          sp = res2.split('|')
        for (var i = 0; i < sp.length; i++){
          if (r == 0) {
            let sp2 = sp[i].split('-')
            let vencedor = (parseInt(sp2[0]) > parseInt(sp2[1])) ? 1 : 2
            pontosGanhos1 += parseInt(sp2[0])
            pontosGanhos2 += parseInt(sp2[1])
          }
          else {
            let sp2 = sp[i].split('-')
            let vencedor = (parseInt(sp2[1]) > parseInt(sp2[0])) ? 1 : 2
            pontosGanhos1 += parseInt(sp2[1])
            pontosGanhos2 += parseInt(sp2[0])
          }
          if(vencedor == 1)
            setsGanhos1++
          else {
            setsGanhos2++
          }
        }
      }

      vencedor = (setsGanhos1 > setsGanhos2) ? id1 :
                  ((setsGanhos2 > setsGanhos1) ? id2 :
                  ((pontosGanhos1 > pontosGanhos2) ? id1 : id2))
    }
     else {
      let sp2 = res1.split('-')
      let golos1 = parseInt(sp2[0]);
      let golos2 = parseInt(sp2[1]);
      sp2 = res2.split('-')
      golos1 += parseInt(sp2[1]);
      golos2 += parseInt(sp2[0]);
      vencedor = (golos1 > golos2) ? id1 : id2
    }
    return vencedor
  }

  function sortearCabecasSerie(jogadores,grupos,option){
    var gruposLen = grupos.length;
  	var jogadores2 = []
    //organiza jogadores por clubes
    for (var i=0; i< jogadores.length; i++){
      var j = jogadores[i]
      var pos = -1;

       if(j.ranking <= gruposLen){
         grupos[j.ranking - 1].jogadores.push(j);
         grupos[j.ranking - 1].disponivel--;
         pos = j.ranking - 1;
       }
       else if(option == 2 && j.ranking <= gruposLen * 2){
          pos = gruposLen * 2 - j.ranking
          grupos[pos].jogadores.push(j);
          grupos[pos].disponivel--;
       }

      if(pos == -1)
        jogadores2.push(j);
  	}
      return jogadores2;
  }

  function sortearGrupos(grupos,option,clubes){
    var clubesSize = clubes.length;
    clubes.sort((a,b) => b.size - a.size);

    var gruposDisp = createList(grupos.length);
    var rondaDisp = createList(grupos.length);
    var ronda = option
    //percorre clubes e insere nos grupos começando pelos com mais jogadores
    for (var i=0; i < clubesSize; i++){
      var sizeC = clubes[i].size - clubes[i].sorteados.length;
      for (var i2=0; i2 < sizeC; i2++){
        if(rondaDisp.length==0){
          ronda++
          rondaDisp = grupos.filter(x => x.jogadores.length == ronda && x.disponivel > 0).map(x => x.numeroGrupo-1)
        }

        var j = clubes[i].jogadores[i2]
        var l = rondaDisp.filter(x => clubes[i].sorteados.indexOf(x) == -1);
        if(l.length == 0){
          l = gruposDisp.filter(x => clubes[i].sorteados.indexOf(x) == -1);}
        if(l.length == 0){
          l = rondaDisp
        }
        if(l.length == 0){
          l = gruposDisp
        }

        var pos = l[generate(l)];//console.log(gruposDisp)
        grupos[pos].jogadores.push(j);
        grupos[pos].disponivel--;
        if(grupos[pos].disponivel == 0){
          var index = gruposDisp.indexOf(pos);
          gruposDisp.splice(index, 1);
        }

        var index = rondaDisp.indexOf(pos);
        rondaDisp.splice(index, 1);

        clubes[i].sorteados.push(pos);
      }
    }
    return grupos;
  }

  // organiza jogadores por clube
  // option
  // 0 sem rank
  // 1 insere 1º do grupo por rank
  // 2 insere 1º e 2º do grupo por rank
  function organizarClubes(jogadores,grupos,option){
    var clubes=[],gruposLen = grupos.length;

    //organiza jogadores por clubes
    for (var i=0; i< jogadores.length; i++){
      var j = jogadores[i]
      var clube = j.clube
      var pos = -1;
      var i2 = clubes.map(e => e.clube).indexOf(clube);

    	if(i2 == -1){
        clubes.push({clube:clube, size:1,jogadores:[],sorteados:[]});
        i2 = clubes.map(e => e.clube).indexOf(clube);
      }
      else
        clubes[i2].size +=1;

      //caso se use ranking adicionar diretamente
      if(option > 0){
        if(j.ranking <= gruposLen){
          grupos[j.ranking - 1].jogadores.push(j);
          grupos[j.ranking - 1].disponivel--;
          pos = j.ranking - 1;
        }
        else if(option == 2 && j.ranking <= gruposLen * 2){
          pos = gruposLen * 2 - j.ranking
          grupos[pos].jogadores.push(j);
          grupos[pos].disponivel--;
        }
      }

      if(pos == -1)
        clubes[i2].jogadores.push(j);
      else
        clubes[i2].sorteados.push(pos);
      }
      return clubes;
  }

  //1 0 size-1
  //2 size/2-1 size/2
  //3 size/4-1 size/4 size-size/4 size-size/4-1
  //4 size/8-1 size/8 3*size/8-1 3*size/8 size-3*size/8-1 size-3*size/8 size-size/8 size-size/8-1
  function posGrupo(size,nivel){
    var base = size/(2*(Math.pow(2,nivel-1)));
    var posicoes = (nivel == 1) ? (new Array(base-1,base)) :
                    ((nivel == 2) ? (new Array(base-1,base,size-base-1,size-base)) :
                    (new Array(base-1,base,3*base-1,3*base,size-3*base-1,size-3*base,size-base,size-base-1)))

    return posicoes;
  }

  function dividirNiveis(jogadores,mapa,clubes1,clubes2,primeiros,grupos,segundos,tipo,nivel){
    var mapSize = mapa.length
    // preencher primeiros por niveis
    for (var i=0; i< jogadores.length; i++){
      var j = jogadores[i];

      if((tipo == 1 && j.posicao == 1) || (tipo == 2 && j.ranking > 0)){
        var p = -1;
        var index = 0;

        if(j.ranking == 1){
          mapa[0].jogador = {idEquipa:j.idEquipa ,clube:j.clube,rank:j.ranking};
          clubes1.push({clube:j.clube, size:1,jogadores:[],sorteados:[0]});
          p=1;
        } else if (j.ranking == 2) {
          mapa[mapSize-1].jogador = {idEquipa:j.idEquipa ,clube:j.clube,rank:j.ranking};
          if(tipo == 2)
            clubes1.push({clube:j.clube, size:1,jogadores:[],sorteados:[mapSize-1]});
          else {
            clubes2.push({clube:j.clube, size:1,jogadores:[],sorteados:[mapSize-1]});
          }
          p=2;
        } else {
          index = (j.ranking < 5) ? 1 : ((j.ranking < 9) ? 2 : ((j.ranking < 17) ? 3 : 4));

          if(tipo == 1 || index <= nivel){
            primeiros[index-1].jogadores.push(j);
            primeiros[index-1].size++;
          } else {
            segundos.push(j);
          }
        }
        if(tipo == 1)
          grupos.push({grupo:j.ranking,pos:p})
      }
      else
        segundos.push(j);
    }
    if(mapSize - jogadores.length > 0){
      var j = {idEquipa:-1,nomeEquipa:'----',clube:'----',ranking:-1,posicao:-1}
      var s = (tipo == 1) ? ((mapSize - jogadores.length) / 2) : (mapSize - jogadores.length)
      for (var i=0; i< s; i++){
        segundos.push(j)
      }
    }
  }

  function sortearPrimeiros(primeiros,mapa,listPos,grupos,par,tipo){
    var mapSize = mapa.length
    par[0].push({clube:"----", size:0,jogadores:[],sorteados:[]});
    par[1].push({clube:"----", size:0,jogadores:[],sorteados:[]});
    //sortear primeiros
    for (var i=0; i < primeiros.length; i++){
      var nivel = primeiros[i],posicoes = posGrupo(mapSize,i+1); //posicoes deste nivel

      for (var i2=0; i2 < nivel.size; i2++){
        var j = nivel.jogadores[i2],index = generate(posicoes),pos = posicoes[index];
        //adicionar no mapa
        mapa[pos].jogador = {idEquipa:j.idEquipa ,clube:j.clube,rank:j.ranking};
        posicoes.splice(index,1);
        //remover das posiçoes validas
        var p = listPos.indexOf(pos);
        listPos.splice(p,1);

        var m = (pos < mapSize/2 || tipo == 2) ? 0 : 1
        //adicionar posição no array grupos
        if(tipo == 1){
          var g = grupos.map(e => e.grupo).indexOf(j.ranking);
          grupos[g].pos = m + 1;
        }
        //adicionar posicao nos clubes
        var i3 = par[m].map(e => e.clube).indexOf(j.clube);
        if(i3 == -1)
          par[m].push({clube:j.clube, size:1,jogadores:[],sorteados:[pos]});
        else {
          par[m][i3].sorteados.push(pos);
          par[m][i3].size++;
        }
      }
      //preencher posiçoes deste nivel vazias
      for (var i2=0; i2 < posicoes.length; i2++){
        var j2 = {idEquipa:-1,clube:'----',rank:-1}
        var pos2 = posicoes[i2]
        mapa[pos2].jogador = j2
        p = listPos.indexOf(pos2);
        listPos.splice(p,1);
        var m2 = (pos2 < mapSize/2 || tipo == 2) ? 0 : 1
        var i4 = par[m2].map(e => e.clube).indexOf(j2.clube);
        par[m2][i4].sorteados.push(pos2);
        par[m2][i4].size++;
      }
    }
  }

  function sortearSegundos(par,listPos,mapa,tipo){
    var mapSize = mapa.length
    //percorrer clubes sortear segundos
    for (var c=0; c< 2; c++){
      for (var i=0; i< par[c].length; i++){
        var sizeclube = par[c][i].jogadores.length,s = 0;
        if (sizeclube > 0){
          var l = (tipo == 2) ? createList(mapSize) : ((c == 0) ? createList(mapSize/2) : createList(mapSize/2).map(v => v+mapSize/2));
          for(s=0; Math.pow(2, s) < par[c][i].size; s++);
          var npartes = Math.pow(2, s),sizePartes = (tipo == 1) ? (mapSize/2/npartes) : (mapSize/npartes);
          var chunks = chunkArrayInGroups(l,sizePartes);
          chunksDisp(chunks,par[c][i].sorteados);

          //sortear jogadores do clube
          for (var i2=0; i2< sizeclube; i2++){
            var j = par[c][i].jogadores[i2];
            var posicoesD = chunks.flat().filter(x => listPos.indexOf(x) > -1);
            if(posicoesD.length == 0){
              if(sizePartes == 2)
                posicoesD = l.filter(x => listPos.indexOf(x) > -1)
              else {
                sizePartes /= 2
                chunks = chunkArrayInGroups(l,sizePartes);
                chunksDisp(chunks,par[c][i].sorteados);
                posicoesD = chunks.flat().filter(x => listPos.indexOf(x) > -1);
              }
            }
            if(posicoesD.length == 0)
              posicoesD = listPos;

            var pos = generate(posicoesD);
            var value = posicoesD[pos];
            const index = listPos.indexOf(value);
            if (index > -1)
              listPos.splice(index, 1);
            par[c][i].sorteados.push(value);
            chunksDisp(chunks,[value]);
            mapa[value].jogador =  {idEquipa:j.idEquipa ,clube:j.clube,rank:j.ranking};
          }
        }
      }
    }
  }

  function chunksDisp(chunks,sorteados){
    var list = posicoesDisp(chunks,sorteados);
    for(var i=0; i < list.length; i++)
       chunks.splice(list[i]-i, 1);
  }

  function sortearSegundos2(par,listPos,mapa,tipo){
    var mapSize = mapa.length
    //percorrer clubes sortear segundos
    for (var c=0; c< 2; c++){
      for (var i=0; i< par[c].length; i++){
        var sizeclube = par[c][i].jogadores.length;
        if (sizeclube > 0){
          var l = (tipo == 2) ? createList(mapSize) : ((c == 0) ? createList(mapSize/2) : createList(mapSize/2).map(v => v+mapSize/2));
          //sortear jogadores do clube
          for (var i2=0; i2< sizeclube; i2++){
            var j = par[c][i].jogadores[i2];
            var posicoesD = l.filter(x => listPos.indexOf(x) > -1);
            var pos = generate(posicoesD);
            var value = posicoesD[pos];
            const index = listPos.indexOf(value);
            if (index > -1)
              listPos.splice(index, 1);
            mapa[value].jogador =  {idEquipa:j.idEquipa ,clube:j.clube,rank:j.ranking};
          }
        }
      }
    }
  }

  function nivelToSize(nivel,total){
    var mapSize = 0;
    for(mapSize = 1; mapSize < total; mapSize*=2);
    if(mapSize == 32) return 3;
    if(mapSize == 16) return 2;
    if(mapSize == 8) return 1;
    if(mapSize == 4) return 0;
  }

  // nivel 0-2rank|1-4rank|2-8rank|3-16rank
  // tipo 1-fromGrupos 2-semGrupos
  // op 1-separar clubes  2-sem restriçoes

  // 1 criar mapa vazio
  // 2 dividir primeiros por rank e segundos por clube
  // 3 sortear primeiros guardar posição nos grupos e nos clubes1 e 2
  // 4 dividir segundos em 2 metades preencher clubes1 e clubes2
  // 5 sortear segundos comecar pelo clube que tem mais
  function sorteioEliminatorias(jogadores,nivel,tipo,op){
    var total = jogadores.length,mapSize = 1,i2=0;
    var primeiros=[],mapa=[],segundos=[],grupos = [],clubes1 = [],clubes2 = [];
    var nivelMax = nivelToSize(nivel,total)
    nivel = (tipo == 1 || nivel > nivelMax) ? nivelMax : nivel

    // inicializar primeiros
    for(mapSize = 1; mapSize < total; mapSize*=2){
      if(i2 < nivel)
        primeiros.push({nivel:i2,jogadores:[],size:0});
      i2++;
    }
    // inicializar mapa
     for(i2 = 0; i2 < mapSize; i2++)
       mapa.push({pos:i2,jogador:{nomeEquipa:"undefined",grupo:-1}});

    dividirNiveis(jogadores,mapa,clubes1,clubes2,primeiros,grupos,segundos,tipo,nivel);
    //console.log(mapa.map(x=> x.pos + ":"+ x.jogador.clube + " - " +x.jogador.rank));
    var par = [clubes1,clubes2]; //jogadores das 2 metades do mapa divididos por clubes
    var listPos = createList(mapSize-1);
    listPos.splice(0,1);

    sortearPrimeiros(primeiros,mapa,listPos,grupos,par,tipo);

    //dividir segundos por metades e por clubes
    for (var i=0; i < segundos.length; i++){
      var j = segundos[i],g = 0,metade = 0;
      if(j.idEquipa == -1){
        var s1 = par[0][par[0].map(c => c.clube).indexOf(j.clube)].size;
        var s2 = par[1][par[1].map(c => c.clube).indexOf(j.clube)].size;
        metade = (s1 > s2) ? 1 : 0
      }
      else {
        g = grupos.map(e => e.grupo).indexOf(j.ranking);
        metade = (tipo == 2 || grupos[g].pos == 2) ? 0 : 1;
      }

      var index = par[metade].map(c => c.clube).indexOf(j.clube);
      if(index == -1)
        par[metade].push({clube:j.clube, size:1,jogadores:[j],sorteados:[]});
      else {
        par[metade][index].jogadores.push(j);
        par[metade][index].size++;
      }
    }

    //ordenar por length sorteados e size em caso de igualdade
    for (var c=0; c< 2; c++){
      par[c].sort(function(a, b) {
        if (a.sorteados.length < b.sorteados.length) return 1;
        if (a.sorteados.length > b.sorteados.length) return -1;
        return b.size - a.size;
      });
    }
    if(op == 2)
      sortearSegundos(par,listPos,mapa,tipo);
    else {
      sortearSegundos2(par,listPos,mapa,tipo);
    }
    console.log(mapa.map(x=> x.pos + ":"+ x.jogador.clube + " - " +x.jogador.rank));
    return mapa
  }

  //recebe jogos da ronda e atualiza com a sorteio gerado
  function mapaToJogos(mapa,idsJogos){
    var jogos = [],ronda = 0;
    for(var i=0,ronda = 0;i<mapa.length;i+=2,ronda++){
      jogos.push({idJogo:idsJogos[ronda],idOponente1:mapa[i].jogador.idEquipa,idOponente2:mapa[i+1].jogador.idEquipa})
    }
    return jogos
  }

  module.exports = {
    gerarGrupos,
    gerarEliminatorias,
    sortearElim,
    equipasFromGrupos,
    getVencedor,
    atualizaClassificacao,
    calculaVencedor2Maos,
    apuradosGrupo,
    updateGrupos
  }
