-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema primeG
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema primeG
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `primeG` DEFAULT CHARACTER SET utf8 ;
USE `primeG` ;

-- -----------------------------------------------------
-- Table `primeG`.`Utilizador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Utilizador` (
  `idUtilizador` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `dataNascimento` DATE NOT NULL,
  `genero` INT NOT NULL,
  `imageName` VARCHAR(60) NULL,
  PRIMARY KEY (`idUtilizador`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Desporto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Desporto` (
  `idDesporto` INT NOT NULL AUTO_INCREMENT,
  `nomeDesporto` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idDesporto`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Localidade`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Localidade` (
  `idLocalidade` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(45) NULL,
  PRIMARY KEY (`idLocalidade`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Espaco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Espaco` (
  `idEspaco` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  `rua` VARCHAR(45) NULL,
  `contacto` VARCHAR(45) NULL,
  `Utilizador_idUtilizador` INT NOT NULL,
  `Localidade_idLocalidade` INT NOT NULL,
  `Favorito` INT NULL,
  `imageName` VARCHAR(60) NULL,
  PRIMARY KEY (`idEspaco`),
  INDEX `fk_Espaco_Utilizador1_idx` (`Utilizador_idUtilizador` ASC) VISIBLE,
  INDEX `fk_Espaco_Localidade1_idx` (`Localidade_idLocalidade` ASC) VISIBLE,
  CONSTRAINT `fk_Espaco_Utilizador1`
    FOREIGN KEY (`Utilizador_idUtilizador`)
    REFERENCES `primeG`.`Utilizador` (`idUtilizador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Espaco_Localidade1`
    FOREIGN KEY (`Localidade_idLocalidade`)
    REFERENCES `primeG`.`Localidade` (`idLocalidade`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Torneio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Torneio` (
  `idTorneio` INT NOT NULL AUTO_INCREMENT,
  `nomeTorneio` VARCHAR(45) NOT NULL,
  `idOrganizador` INT NOT NULL,
  `idDesporto` INT NOT NULL,
  `isFederado` INT NOT NULL,
  `dataTorneio` DATETIME NOT NULL,
  `inscricoesAbertas` INT NOT NULL,
  `escalao` INT NOT NULL,
  `tipoTorneio` INT NOT NULL,
  `terminado` INT NOT NULL,
  `Espaco_idEspaco` INT NOT NULL,
  `tamEquipa` INT NOT NULL,
  `genero` INT NOT NULL,
  `imageName` VARCHAR(60) NULL,
  PRIMARY KEY (`idTorneio`),
  INDEX `fk_Torneio_Utilizador_idx` (`idOrganizador` ASC) VISIBLE,
  INDEX `fk_Torneio_Desporto1_idx` (`idDesporto` ASC) VISIBLE,
  INDEX `fk_Torneio_Espaco1_idx` (`Espaco_idEspaco` ASC) VISIBLE,
  CONSTRAINT `fk_Torneio_Utilizador`
    FOREIGN KEY (`idOrganizador`)
    REFERENCES `primeG`.`Utilizador` (`idUtilizador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Torneio_Desporto1`
    FOREIGN KEY (`idDesporto`)
    REFERENCES `primeG`.`Desporto` (`idDesporto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Torneio_Espaco1`
    FOREIGN KEY (`Espaco_idEspaco`)
    REFERENCES `primeG`.`Espaco` (`idEspaco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`DesportosFav`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`DesportosFav` (
  `Utilizador_idUtilizador` INT NOT NULL,
  `Desporto_idDesporto` INT NOT NULL,
  `numeroFederado` VARCHAR(45) NULL,
  `clube` VARCHAR(45) NULL,
  `notificacao` INT NULL,
  PRIMARY KEY (`Utilizador_idUtilizador`, `Desporto_idDesporto`),
  INDEX `fk_Utilizador_has_Desporto_Desporto1_idx` (`Desporto_idDesporto` ASC) VISIBLE,
  INDEX `fk_Utilizador_has_Desporto_Utilizador1_idx` (`Utilizador_idUtilizador` ASC) VISIBLE,
  CONSTRAINT `fk_Utilizador_has_Desporto_Utilizador1`
    FOREIGN KEY (`Utilizador_idUtilizador`)
    REFERENCES `primeG`.`Utilizador` (`idUtilizador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Utilizador_has_Desporto_Desporto1`
    FOREIGN KEY (`Desporto_idDesporto`)
    REFERENCES `primeG`.`Desporto` (`idDesporto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`FaseGrupos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`FaseGrupos` (
  `idFaseGrupos` INT NOT NULL AUTO_INCREMENT,
  `numeroGrupos` INT NOT NULL,
  `Torneio_idTorneio` INT NOT NULL,
  `terminado` INT NOT NULL,
  PRIMARY KEY (`idFaseGrupos`),
  INDEX `fk_FaseGrupos_Torneio1_idx` (`Torneio_idTorneio` ASC) VISIBLE,
  CONSTRAINT `fk_FaseGrupos_Torneio1`
    FOREIGN KEY (`Torneio_idTorneio`)
    REFERENCES `primeG`.`Torneio` (`idTorneio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Grupo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Grupo` (
  `idGrupo` INT NOT NULL AUTO_INCREMENT,
  `faseGrupos_idFaseGrupos` INT NOT NULL,
  `numeroGrupo` INT NOT NULL,
  `classificacaoGrupo` VARCHAR(1000) NULL,
  `terminado` INT NOT NULL,
  `nParticipantes` INT NULL,
  PRIMARY KEY (`idGrupo`),
  INDEX `fk_Grupo_faseGrupos1_idx` (`faseGrupos_idFaseGrupos` ASC) VISIBLE,
  CONSTRAINT `fk_Grupo_faseGrupos1`
    FOREIGN KEY (`faseGrupos_idFaseGrupos`)
    REFERENCES `primeG`.`FaseGrupos` (`idFaseGrupos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Eliminatoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Eliminatoria` (
  `idEliminatoria` INT NOT NULL AUTO_INCREMENT,
  `numeroJogadores` INT NOT NULL,
  `Torneio_idTorneio` INT NOT NULL,
  `gerado` INT NOT NULL,
  PRIMARY KEY (`idEliminatoria`),
  INDEX `fk_Eliminatoria_Torneio1_idx` (`Torneio_idTorneio` ASC) VISIBLE,
  CONSTRAINT `fk_Eliminatoria_Torneio1`
    FOREIGN KEY (`Torneio_idTorneio`)
    REFERENCES `primeG`.`Torneio` (`idTorneio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Etapa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Etapa` (
  `idEtapa` INT NOT NULL AUTO_INCREMENT,
  `numeroEtapa` INT NOT NULL,
  `nomeEtapa` VARCHAR(45) NOT NULL,
  `Eliminatoria_idEliminatoria` INT NOT NULL,
  `terminado` INT NOT NULL,
  PRIMARY KEY (`idEtapa`),
  INDEX `fk_Etapa_Eliminatoria1_idx` (`Eliminatoria_idEliminatoria` ASC) VISIBLE,
  CONSTRAINT `fk_Etapa_Eliminatoria1`
    FOREIGN KEY (`Eliminatoria_idEliminatoria`)
    REFERENCES `primeG`.`Eliminatoria` (`idEliminatoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Jogo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Jogo` (
  `idJogo` INT NOT NULL AUTO_INCREMENT,
  `numeroCampo` INT NOT NULL,
  `hora` DATETIME NOT NULL,
  `idOponente1` INT NULL,
  `idOponente2` INT NULL,
  `vencedor` INT NULL,
  `resultado` VARCHAR(90) NULL,
  `Grupo_idGrupo` INT NULL,
  `ronda` INT NULL,
  `estado` INT NOT NULL,
  `idEtapa` INT NULL,
  `mao` INT NULL,
  PRIMARY KEY (`idJogo`),
  INDEX `fk_Jogo_Grupo1_idx` (`Grupo_idGrupo` ASC) VISIBLE,
  INDEX `fk_Jogo_Etapa1_idx` (`idEtapa` ASC) VISIBLE,
  CONSTRAINT `fk_Jogo_Grupo1`
    FOREIGN KEY (`Grupo_idGrupo`)
    REFERENCES `primeG`.`Grupo` (`idGrupo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Jogo_Etapa1`
    FOREIGN KEY (`idEtapa`)
    REFERENCES `primeG`.`Etapa` (`idEtapa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Equipa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Equipa` (
  `idEquipa` INT NOT NULL AUTO_INCREMENT,
  `classificacao` INT NULL,
  `ranking` INT NULL,
  `nomeEquipa` VARCHAR(45) NOT NULL,
  `escalao` INT NOT NULL,
  `clube` VARCHAR(45) NULL,
  PRIMARY KEY (`idEquipa`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Equipa_has_Utilizador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Equipa_has_Utilizador` (
  `Equipa_idEquipa` INT NOT NULL,
  `Utilizador_idUtilizador` INT NOT NULL,
  PRIMARY KEY (`Equipa_idEquipa`, `Utilizador_idUtilizador`),
  INDEX `fk_Equipa_has_Utilizador_Utilizador1_idx` (`Utilizador_idUtilizador` ASC) VISIBLE,
  INDEX `fk_Equipa_has_Utilizador_Equipa1_idx` (`Equipa_idEquipa` ASC) VISIBLE,
  CONSTRAINT `fk_Equipa_has_Utilizador_Equipa1`
    FOREIGN KEY (`Equipa_idEquipa`)
    REFERENCES `primeG`.`Equipa` (`idEquipa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Equipa_has_Utilizador_Utilizador1`
    FOREIGN KEY (`Utilizador_idUtilizador`)
    REFERENCES `primeG`.`Utilizador` (`idUtilizador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Torneio_has_Equipa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Torneio_has_Equipa` (
  `Torneio_idTorneio` INT NOT NULL,
  `Equipa_idEquipa` INT NOT NULL,
  `pendente` INT NULL,
  PRIMARY KEY (`Torneio_idTorneio`, `Equipa_idEquipa`),
  INDEX `fk_Torneio_has_Equipa_Equipa1_idx` (`Equipa_idEquipa` ASC) VISIBLE,
  INDEX `fk_Torneio_has_Equipa_Torneio1_idx` (`Torneio_idTorneio` ASC) VISIBLE,
  CONSTRAINT `fk_Torneio_has_Equipa_Torneio1`
    FOREIGN KEY (`Torneio_idTorneio`)
    REFERENCES `primeG`.`Torneio` (`idTorneio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Torneio_has_Equipa_Equipa1`
    FOREIGN KEY (`Equipa_idEquipa`)
    REFERENCES `primeG`.`Equipa` (`idEquipa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`localFav`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`localFav` (
  `Localidade_idLocalidade` INT NOT NULL,
  `Utilizador_idUtilizador` INT NOT NULL,
  PRIMARY KEY (`Localidade_idLocalidade`, `Utilizador_idUtilizador`),
  INDEX `fk_Localidade_has_Utilizador_Utilizador1_idx` (`Utilizador_idUtilizador` ASC) VISIBLE,
  INDEX `fk_Localidade_has_Utilizador_Localidade1_idx` (`Localidade_idLocalidade` ASC) VISIBLE,
  CONSTRAINT `fk_Localidade_has_Utilizador_Localidade1`
    FOREIGN KEY (`Localidade_idLocalidade`)
    REFERENCES `primeG`.`Localidade` (`idLocalidade`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Localidade_has_Utilizador_Utilizador1`
    FOREIGN KEY (`Utilizador_idUtilizador`)
    REFERENCES `primeG`.`Utilizador` (`idUtilizador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`TorneiosFav`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`TorneiosFav` (
  `Utilizador_idUtilizador` INT NOT NULL,
  `Torneio_idTorneio` INT NOT NULL,
  PRIMARY KEY (`Utilizador_idUtilizador`, `Torneio_idTorneio`),
  INDEX `fk_Utilizador_has_Torneio_Torneio1_idx` (`Torneio_idTorneio` ASC) VISIBLE,
  INDEX `fk_Utilizador_has_Torneio_Utilizador1_idx` (`Utilizador_idUtilizador` ASC) VISIBLE,
  CONSTRAINT `fk_Utilizador_has_Torneio_Utilizador1`
    FOREIGN KEY (`Utilizador_idUtilizador`)
    REFERENCES `primeG`.`Utilizador` (`idUtilizador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Utilizador_has_Torneio_Torneio1`
    FOREIGN KEY (`Torneio_idTorneio`)
    REFERENCES `primeG`.`Torneio` (`idTorneio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Notificacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Notificacao` (
  `idNotificacao` INT NOT NULL AUTO_INCREMENT,
  `Titulo` VARCHAR(140) NULL,
  `Torneio_idTorneio` INT NOT NULL,
  PRIMARY KEY (`idNotificacao`),
  INDEX `fk_Notificacao_Torneio1_idx` (`Torneio_idTorneio` ASC) VISIBLE,
  CONSTRAINT `fk_Notificacao_Torneio1`
    FOREIGN KEY (`Torneio_idTorneio`)
    REFERENCES `primeG`.`Torneio` (`idTorneio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Desporto_has_Espaco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Desporto_has_Espaco` (
  `idDesporto` INT NOT NULL,
  `idEspaco` INT NOT NULL,
  `numeroMesas` INT NULL,
  PRIMARY KEY (`idDesporto`, `idEspaco`),
  INDEX `fk_Desporto_has_Espaco_Espaco1_idx` (`idEspaco` ASC) VISIBLE,
  INDEX `fk_Desporto_has_Espaco_Desporto1_idx` (`idDesporto` ASC) VISIBLE,
  CONSTRAINT `fk_Desporto_has_Espaco_Desporto1`
    FOREIGN KEY (`idDesporto`)
    REFERENCES `primeG`.`Desporto` (`idDesporto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Desporto_has_Espaco_Espaco1`
    FOREIGN KEY (`idEspaco`)
    REFERENCES `primeG`.`Espaco` (`idEspaco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `primeG`.`Utilizador_has_Notificacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `primeG`.`Utilizador_has_Notificacao` (
  `Utilizador_idUtilizador` INT NOT NULL,
  `Notificacao_idNotificacao` INT NOT NULL,
  `Lido` INT NOT NULL,
  PRIMARY KEY (`Utilizador_idUtilizador`, `Notificacao_idNotificacao`),
  INDEX `fk_Utilizador_has_Notificacao_Notificacao1_idx` (`Notificacao_idNotificacao` ASC) VISIBLE,
  INDEX `fk_Utilizador_has_Notificacao_Utilizador1_idx` (`Utilizador_idUtilizador` ASC) VISIBLE,
  CONSTRAINT `fk_Utilizador_has_Notificacao_Utilizador1`
    FOREIGN KEY (`Utilizador_idUtilizador`)
    REFERENCES `primeG`.`Utilizador` (`idUtilizador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Utilizador_has_Notificacao_Notificacao1`
    FOREIGN KEY (`Notificacao_idNotificacao`)
    REFERENCES `primeG`.`Notificacao` (`idNotificacao`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET @@SESSION.auto_increment_increment = 1
