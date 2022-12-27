import React from 'react'
import {useState,useEffect} from 'react';

const JogoDisplay = ({jogo}) => {
    const API_URL="http://localhost:3000/equipa"

    const [equipa1,setEquipa1] = useState([]);
    const [equipa2,setEquipa2] = useState([]);

    const searchEquipa1 = async () => {
        let pedido = API_URL + "/" + jogo.idOponente1;
        const response = await fetch (pedido);
        if (response.status === 200) {
            const data = await response.json();
            setEquipa1(data);
        }
        else {
            setEquipa1([]);
        }
    }

    const searchEquipa2 = async () => {
        let pedido = API_URL + "/" + jogo.idOponente2;
        const response = await fetch (pedido);
        if (response.status === 200) {
            const data = await response.json();
            setEquipa2(data);
        }
        else {
            setEquipa2([]);
        }
    }

    useEffect(() => {
        searchEquipa1();
        searchEquipa2();
    },[])

    let nomeEquipa1 = ""
    let nomeEquipa2 = ""
    equipa1.map((equipa) =>
        nomeEquipa1 = equipa.nomeEquipa
    )
    equipa2.map((equipa) =>
        nomeEquipa2 = equipa.nomeEquipa
    )

    let resultadofinal = "";
    if (jogo.resultado != null) {
        var aux = jogo.resultado.split("|");
        aux.forEach(element => {
            var aux2 = element.split("-");
            if (resultadofinal === ""){
                resultadofinal += nomeEquipa1;
                resultadofinal += " ";
                resultadofinal += aux2[1];
            }
            else {
                resultadofinal += " - ";
                resultadofinal += aux2[1];
                resultadofinal += " ";
                resultadofinal += nomeEquipa2;
            }     
        });
    }

    
    let isGroup = ""
    if(jogo.Grupo_idGrupo===null || typeof jogo.Grupo_idGrupo === undefined){
        isGroup = false;
    }
    else {
        isGroup = true;
    }
    return (
        <div className="jogo">
            <div>
            {isGroup 
                ? <p>Grupo: {jogo.numeroGrupo}</p>
                : <p>Eliminatória: {jogo.nomeEtapa}</p>
            }
            </div>
            <div>
            <p>Número Campo: {jogo.numeroCampo}</p>
            </div>

            <div>
                <p>Data: {jogo.hora}</p>
            </div>

            <div>
                <p>Resultado: {resultadofinal}</p>
            </div>
        </div>
    )
}

export default JogoDisplay;