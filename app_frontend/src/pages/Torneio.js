//Componente de um único Torneio

import {useParams} from 'react-router-dom'
import {useState,useEffect} from 'react';
import TorneioDisplay from "./TorneioDisplay.jsx";
import {Link} from 'react-router-dom';
import {NavbarDynamic} from '../components/NavbarDynamic.js';

const API_URL="http://localhost:3000"

export function Torneio() {
    const {id} = useParams()
    const [torneio,setTorneio] = useState("");
    const [gestao,setGestao] = useState(0);
    const [tipoTorneio,setTipoTorneio] = useState();

    // Vai à API buscar a informação do torneio para dar display na página principal
    const searchTorneio = async () => {
        let requestOptions = {}
        let aux = localStorage.getItem("token");
        let response = null


        if(aux != "null") {
            requestOptions = {
                headers: {'Authorization': "Bearer " + localStorage.getItem("token")}
            }
            response = await fetch (`${API_URL}/torneios/${id}`,requestOptions);
        }
        else {
            response = await fetch (`${API_URL}/torneios/${id}`);
        }
        
        const data = await response.json();
        if (response.status === 200) {
            console.log(data)
            if(data.isOrganizador) {
                setGestao(1);
            } 
            setTorneio(data);
            setTipoTorneio(data.tipoTorneio);
        }
        else {
            setTorneio([]);
        }
      }
      console.log(gestao)

    //Search inicial do torneio
    useEffect(() => {
        searchTorneio();
    },[])

    return(
        <>
        <NavbarDynamic/>
            <h1>Página do torneio {id}</h1>

            <li><Link to={`/${id}/jogos`}
                 state={{ tipoTorneio : tipoTorneio }}>Jogos</Link></li>
            {torneio.terminado != 0
            ?
            (<li><Link to={"/" + id + "/classificacao"}>Classificação</Link></li>)
            : (null)
            }
            {gestao == 1
            ?
            <li><Link to={`/${id}/gestao`}
                state={{tipoTorneio : tipoTorneio}}>Gestão</Link></li>
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
