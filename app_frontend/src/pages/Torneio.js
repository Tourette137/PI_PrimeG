//Componente de um único Torneio

import {useParams} from 'react-router-dom'
//import {useState,useEffect} from 'react';
//import TorneioDisplay from "./TorneioDisplay.jsx";
import {Link} from 'react-router-dom';

export function Torneio() {
    const {id} = useParams()
    return(
        <>
            <h1>Página do torneio {id}</h1>
            <li><Link to={"/" + id + "/jogos"}>Jogos</Link></li>
            <li><Link to={"/" + id + "/classificacao"}>Classificacao</Link></li>
        </>
    )
}