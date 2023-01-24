insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,1,"Benfas",2,"c1");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,2,"Toumdela",2,"c4");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,3,"SCBrarrocos",2,"c3");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,4,"Capa Sia",2,"c2");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,5,"Mavista",2,"c1");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,6,"Famaligato",2,"c5");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,7,"Vitela",2,"c5");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,8,"VSC",2,"c6");
#insert into equipa (classificacao, ranking, nomeEquipa, escalao) values (0,9,"PUUOORTO",2);


insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Repgon1","u1@gmail.com","123","2000-11-01",1);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Joumm2","joum2@gmail.com","123","2000-11-01",1);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Repgon3","rep3@gmail.com","123","2000-11-01",1);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Joumm4","joum4@gmail.com","123","2000-11-01",1);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Repgo5n","rep5@gmail.com","123","2000-11-01",1);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Joumm6","joum6@gmail.com","123","2000-11-01",1);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Repgon7","rep7@gmail.com","123","2000-11-01",1);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Joumm","joum@gmail.com","123","2000-11-01",1);


insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (1,1);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (2,2);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (3,3);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (4,4);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (5,5);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (6,6);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (7,7);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (8,8);

insert into desporto (nomeDesporto) values ("TENIS");
insert into localidade (Nome) values ("Guimaraes");
insert into localidade (Nome) values ("Porto");
insert into desporto (nomeDesporto) values ("Futebol");
insert into espaco (nome,rua,contacto,Utilizador_idUtilizador,Localidade_idLocalidade) values ("Asa","D.Joao IV","9177tiratirametemete",1,1);
insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values(1,1,10);
insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values(2,1,10);

insert into torneio (nomeTorneio,idOrganizador,
                    idDesporto,isFederado,dataTorneio,
                    inscricoesAbertas,escalao,tipoTorneio,
                    terminado,Espaco_idEspaco,tamEquipa,genero) 
                    values ("ATP",1,2,1,'2012-06-18 10:34:09',0,2,0,0,1,1,1);

insert into DesportosFav(Utilizador_idUtilizador, Desporto_idDesporto, numeroFederado, clube, notificacao) values (1,1,1454,"c7",1);
insert into DesportosFav(Utilizador_idUtilizador, Desporto_idDesporto, numeroFederado, clube, notificacao) values (2,1,2345,"c1",1);
insert into DesportosFav(Utilizador_idUtilizador, Desporto_idDesporto, numeroFederado, clube, notificacao) values (3,1,3345,"c2",1);
insert into DesportosFav(Utilizador_idUtilizador, Desporto_idDesporto, numeroFederado, clube, notificacao) values (4,1,4465,"c2",1);
insert into DesportosFav(Utilizador_idUtilizador, Desporto_idDesporto, numeroFederado, clube, notificacao) values (5,1,5667,"c3",1);
insert into DesportosFav(Utilizador_idUtilizador, Desporto_idDesporto, numeroFederado, clube, notificacao) values (6,1,6876,"c4",1);
insert into DesportosFav(Utilizador_idUtilizador, Desporto_idDesporto, numeroFederado, clube, notificacao) values (7,1,7455,"c5",1);
insert into DesportosFav(Utilizador_idUtilizador, Desporto_idDesporto, numeroFederado, clube, notificacao) values (8,1,8356,"c6",1);


insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,1,1);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,2,1);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,3,1);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,4,1);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,5,1);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,6,1);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,7,1);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,8,1);



select * from equipa;
select * from torneio_has_equipa;
select * from utilizador;
select * from equipa_has_utilizador;
select * from DesportosFav;
