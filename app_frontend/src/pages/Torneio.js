//Componente de um único Torneio

import {useParams} from 'react-router-dom'
import {useState,useEffect} from 'react';
import TorneioDisplay from '../components/TorneioCard.js';
import InscritosDisplay from "../components/ListaInscritos.js";
import {Link} from 'react-router-dom';

const API_URL="http://localhost:3000"

export function Torneio() {
    const {id} = useParams()
    const [torneio,setTorneio] = useState("");
    const [gestao,setGestao] = useState(0);
    const [tipoTorneio,setTipoTorneio] = useState();
    const [inscritos,setInscritos] = useState([]);
    const [apurados,setApurados] = useState([]);

    const searchInscritos = async () => {
      const response = await fetch (`${API_URL}/torneios/${id}/inscritos`);
      if (response.status === 200) {
          const data = await response.json();
          setInscritos(data);
      }
      else {
          setInscritos([]);
      }
    }

    const searchApurados = async () => {
      console.log("aaaa");
      const response = await fetch (`${API_URL}/torneios/${id}/apurados`);
      if (response.status === 200) {
          const data = await response.json();
          setApurados(data);
      }
      else {
          setApurados([]);
      }
    }

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
        searchInscritos();
        searchApurados();
    },[])

    return(
        <>
            <h1>Página do torneio {id}</h1>

            <li><Link to={`/${id}/jogos`}
                 state={{ tipoTorneio : tipoTorneio }}>Jogos</Link></li>
            {torneio.terminado != -1 //a classificaçao é criada antes do torneio começar
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
            <InscritosDisplay inscritos = {inscritos} titulo = "Inscritos"/>

            {apurados?.length > 0
            ? (
              <>
              <InscritosDisplay inscritos = {apurados} titulo = "Apurados"/>
              </>
              )
            : (null)
            }
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
