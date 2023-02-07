
#Equipas
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,1,"Porto1",2,"Porto");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,2,"Vitória1",2,"Vitória");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,3,"Vitória2",2,"Vitória");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,4,"Braga1",2,"Braga");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,5,"Porto2",2,"Porto");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,6,"Benfica1",2,"Benfica");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,7,"Benfica2",2,"Benfica");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,8,"Sporting1",2,"Sporting");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,9,"Porto3",2,"Porto");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,10,"Belenenses1",2,"Belenenses");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,111,"Vitória3",2,"Vitória");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,1141,"Portimonense1",2,"Portimonense");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,1311,"Porto4",2,"Porto");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,211,"Rio Ave1",2,"Rio Ave");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,75,"Arouca",2,"Arouca");
insert into equipa (classificacao, ranking, nomeEquipa, escalao,clube) values (0,88,"Porto5",2,"Porto");


#Utilizadores
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("João","joao@gmail.com","$2a$10$Xf1IuUVpkuHy3OlKV5dU8eIzaSFJZyDOgOE6WajSjAyMJ3QkYT56C","2000-11-01",0);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Pedro","pedro@gmail.com","$2a$10$Xf1IuUVpkuHy3OlKV5dU8eIzaSFJZyDOgOE6WajSjAyMJ3QkYT56C","2000-11-01",0);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Filipe","filipe@gmail.com","$2a$10$Xf1IuUVpkuHy3OlKV5dU8eIzaSFJZyDOgOE6WajSjAyMJ3QkYT56C","2000-11-01",0);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Diogo","diogo@gmail.com","$2a$10$Xf1IuUVpkuHy3OlKV5dU8eIzaSFJZyDOgOE6WajSjAyMJ3QkYT56C","2000-11-01",0);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Leandro","leandro@gmail.com","$2a$10$Xf1IuUVpkuHy3OlKV5dU8eIzaSFJZyDOgOE6WajSjAyMJ3QkYT56C","2000-11-01",0);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Bruno","bruno6@gmail.com","$2a$10$Xf1IuUVpkuHy3OlKV5dU8eIzaSFJZyDOgOE6WajSjAyMJ3QkYT56C","2000-11-01",0);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Tiago","tiago@gmail.com","$2a$10$Xf1IuUVpkuHy3OlKV5dU8eIzaSFJZyDOgOE6WajSjAyMJ3QkYT56C","2000-11-01",0);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Rui","rui@gmail.com","$2a$10$Xf1IuUVpkuHy3OlKV5dU8eIzaSFJZyDOgOE6WajSjAyMJ3QkYT56C","2000-11-01",0);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Luís","luis@gmail.com","$2a$10$Xf1IuUVpkuHy3OlKV5dU8eIzaSFJZyDOgOE6WajSjAyMJ3QkYT56C","2000-11-01",0);
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Pedro","organizador@gmail.com","$2a$10$Xf1IuUVpkuHy3OlKV5dU8eIzaSFJZyDOgOE6WajSjAyMJ3QkYT56C","2000-11-01",0);

#Feminina para mostrar que não se consegue registar
insert into utilizador (Nome,email,password,dataNascimento,genero) values ("Luísa","luisa@gmail.com","$2a$10$Xf1IuUVpkuHy3OlKV5dU8eIzaSFJZyDOgOE6WajSjAyMJ3QkYT56C","2000-11-01",1);



#Desportos
insert into desporto (nomeDesporto) values ("Tenis");
insert into desporto (nomeDesporto) values ("Futebol");
insert into desporto (nomeDesporto) values ("Andebol");
insert into desporto (nomeDesporto) values ("Voleibol");
insert into desporto (nomeDesporto) values ("Tenis de Mesa");

#Localidades

insert into localidade (Nome) values ("Guimarães");
insert into localidade (Nome) values ("Porto");
insert into localidade (Nome) values ("Braga");
insert into localidade (Nome) values ("Lisboa");
insert into localidade (Nome) values ("Barcelos");
insert into localidade (Nome) values ("Setúbal");

#Adicionar jogadores às equipas
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (1,1);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (2,2);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (3,3);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (4,4);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (5,5);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (6,6);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (7,7);
insert into equipa_has_utilizador(Equipa_idEquipa,Utilizador_idUtilizador) values (8,8);


#Espaços

insert into espaco (nome,rua,contacto,Utilizador_idUtilizador,Localidade_idLocalidade,favorito,imageName) values ("PavilhãoDesportivo1","S. Maria","963789923",1,1,1,"Espaco1");
insert into espaco (nome,rua,contacto,Utilizador_idUtilizador,Localidade_idLocalidade,favorito,imageName) values ("PavilhãoDesportivo2","Av. Conde Margaride","945789923",1,1,1,"Espaco2");
insert into espaco (nome,rua,contacto,Utilizador_idUtilizador,Localidade_idLocalidade,favorito,imageName) values ("PavilhãoDesportivo3","Av, da Universidade","962794923",1,1,1,"Espaco3");

insert into espaco (nome,rua,contacto,Utilizador_idUtilizador,Localidade_idLocalidade,favorito,imageName) values ("PavilhãoDesportivo4","R. de Bonjóia","915789923",1,2,1,"Espaco4");
insert into espaco (nome,rua,contacto,Utilizador_idUtilizador,Localidade_idLocalidade,favorito,imageName) values ("PavilhãoDesportivo5","R. 25 de Abril","915789923",1,3,1,"Espaco5");
insert into espaco (nome,rua,contacto,Utilizador_idUtilizador,Localidade_idLocalidade,favorito,imageName) values ("PavilhãoDesportivo6","R. Luís de Camões","989789923",1,4,1,"Espaco6");
insert into espaco (nome,rua,contacto,Utilizador_idUtilizador,Localidade_idLocalidade,favorito,imageName) values ("PavilhãoDesportivo7","R. de Paiois","989782223",1,5,1,"Espaco7");
insert into espaco (nome,rua,contacto,Utilizador_idUtilizador,Localidade_idLocalidade,favorito,imageName) values ("PavilhãoDesportivo8","R. Latino Coelho","984782223",1,5,1,"Espaco8");


#Espaços para os desportos
insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values(1,1,10);
insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values(1,2,5);
insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values(1,3,4);
insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values(2,4,5);
insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values(3,5,5);
insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values(4,6,5);
insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values(5,7,7);
insert into desporto_has_espaco (idDesporto,idEspaco,numeroMesas) values(5,8,6);


#Torneios

#Torneio que vai ser terminado de futebol
insert into torneio (nomeTorneio,idOrganizador,
                    idDesporto,isFederado,dataTorneio,
                    inscricoesAbertas,escalao,tipoTorneio,
                    terminado,Espaco_idEspaco,tamEquipa,genero,imageName) 
                    values ("Torneio de Futebol",10,2,0,'2023-02-06 10:30:00',0,2,2,0,4,11,1,"Torneio1");

#Torneio de 2 mãos de eliminatória.
insert into torneio (nomeTorneio,idOrganizador,
                    idDesporto,isFederado,dataTorneio,
                    inscricoesAbertas,escalao,tipoTorneio,
                    terminado,Espaco_idEspaco,tamEquipa,genero,imageName) 
                    values ("Torneio 2 mãos",10,2,0,'2023-02-06 10:30:00',0,3,4,0,4,11,1,"Torneio2");

#Torneio para testarmos na apresentação
insert into torneio (nomeTorneio,idOrganizador,
                    idDesporto,isFederado,dataTorneio,
                    inscricoesAbertas,escalao,tipoTorneio,
                    terminado,Espaco_idEspaco,tamEquipa,genero,imageName) 
                    values ("Torneio de Tenis",10,1,0,'2023-02-06 10:30:00',0,2,2,0,1,1,1,"Torneio3");


#Equipas para o torneio 1
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,1,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,2,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,3,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,4,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,5,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,6,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,7,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (1,8,0);

#Equipas para o torneio 2
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (2,1,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (2,2,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (2,3,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (2,4,0);

#Equipas para o torneio que vamos usar na apresentação:

insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (3,1,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (3,2,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (3,3,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (3,4,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (3,5,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (3,6,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (3,7,0);
insert into torneio_has_equipa (Torneio_idTorneio,Equipa_idEquipa,pendente) values (3,8,0);