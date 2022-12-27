//Componente de um único Torneio

import {useParams} from 'react-router-dom'
import {useState,useEffect} from 'react';
import TorneioDisplay from "./TorneioDisplay.jsx";
import {Link} from 'react-router-dom';

const API_URL="http://localhost:3000"

export function Torneio() {
    const {id} = useParams()    
    const [torneio,setTorneio] = useState("");

    // Vai à API buscar a informação do torneio para dar display na página principal
    const searchTorneio = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}`);
        if (response.status === 200) {
            const data = await response.json();
            setTorneio(data);
        }
        else {
            setTorneio([]);
        }
      }
    
    //Search inicial do torneio
    useEffect(() => {
        searchTorneio();
    },[])
    
    return(
        <>
            <h1>Página do torneio {id}</h1>
            <li><Link to={"/" + id + "/jogos?t=" + torneio.tipoTorneio}>Jogos</Link></li>
            {torneio.terminado != 0 
            ?
            (<li><Link to={"/" + id + "/classificacao"}>Classificacao</Link></li>)
            : (null)
            }
        {torneio !== ""
        ? (<div className = "Torneio">
          <TorneioDisplay torneio = {torneio}/>   
          </div>
        )
        : (<div className="empty">
            <h2>Não existe esse torneio!</h2>
            </div>
        )
        }
        </>
    )
}