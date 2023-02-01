use primeg;

DROP TRIGGER IF EXISTS torneio_trigger;

DELIMITER $$
CREATE TRIGGER torneio_trigger AFTER INSERT ON Torneio FOR EACH ROW 
BEGIN
	DECLARE insert_desporto VARCHAR(45);
    DECLARE insert_localidade VARCHAR(45);
    DECLARE insert_titulo_notificacao VARCHAR(45);
    
    SET @insert_desporto = (SELECT nomeDesporto FROM Desporto WHERE idDesporto = NEW.idDesporto);
    SET @insert_localidade = (SELECT L.Nome FROM Localidade as L JOIN Espaco as E ON E.Localidade_idLocalidade = L.idLocalidade WHERE E.idEspaco = NEW.Espaco_idEspaco);
    SET @insert_titulo_notificacao = CONCAT( NEW.nomeTorneio, "$$", @insert_desporto, "$$", @insert_localidade);
    
	INSERT INTO Notificacao (Titulo, Torneio_idTorneio) VALUES (@insert_titulo_notificacao, NEW.idTorneio);
END$$
DELIMITER ;



DROP TRIGGER IF EXISTS notificacao_trigger;

DELIMITER $$
CREATE TRIGGER notificacao_trigger AFTER INSERT ON Notificacao FOR EACH ROW 
BEGIN
	INSERT INTO Utilizador_has_Notificacao (
		SELECT DF.Utilizador_idUtilizador, NEW.idNotificacao, 0
			FROM Notificacao as N
			JOIN Torneio as T ON T.idTorneio = N.Torneio_idTorneio
			JOIN DesportosFav as DF ON DF.Desporto_idDesporto = T.idDesporto
			WHERE N.idNotificacao = NEW.idNotificacao
		UNION
		SELECT LF.Utilizador_idUtilizador, NEW.idNotificacao, 0
			FROM Notificacao as N
			JOIN Torneio as T ON T.idTorneio = N.Torneio_idTorneio
			JOIN Espaco as E ON E.idEspaco = T.Espaco_idEspaco
			JOIN localFav as LF ON LF.Localidade_idLocalidade = E.Localidade_idLocalidade
			WHERE N.idNotificacao = NEW.idNotificacao
		);
END$$
DELIMITER ;


-- use primeg;
-- INSERT INTO Notificacao (Titulo, Torneio_idTorneio) VALUES ("TEXTO", 1);
-- INSERT INTO DesportosFav (Utilizador_idUtilizador, Desporto_idDesporto) VALUES (1, 1);
-- INSERT INTO DesportosFav (Utilizador_idUtilizador, Desporto_idDesporto) VALUES (2, 1);
-- INSERT INTO localFav VALUES (1, 2);
-- INSERT INTO localFav VALUES (1, 3);