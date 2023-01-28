//Componente de um único Torneio

import {useParams} from 'react-router-dom'
import {useState,useEffect} from 'react';
//import TorneioDisplay from '../components/TorneioCard.js';
import TorneioDisplay from './TorneioDisplay.jsx';
import InscritosDisplay from "../components/ListaInscritos.js";
import {Link} from 'react-router-dom';
import CalendarioDisplay from "../components/CalendarioDisplay.js";

const API_URL="http://localhost:3000"

export function Torneio() {
    const {id} = useParams()
    const [torneio,setTorneio] = useState("");
    const [gestao,setGestao] = useState(0);
    const [tipoTorneio,setTipoTorneio] = useState();
    const [inscritos,setInscritos] = useState([]);
    const [apurados,setApurados] = useState([]);
    const [calendarioGrupos,setCalendarioGrupos] = useState([]);
    const [calendarioElim,setCalendarioElim] = useState([]);
    const [loading1,setLoading1] = useState(false);
    const [loading2,setLoading2] = useState(false);
    const [jogos,setJogos] = useState([]);

    const searchJogos = async () => {
        let pedido = API_URL + "/torneios/" + id + "/jogosPorComecar";

        const response = await fetch (pedido);
        if (response.status === 200) {
            const data = await response.json();
            setJogos(data);
        }
        else {
          setJogos([]);
        }
    }

    const searchInscritos = async () => {
      const response = await fetch (`${API_URL}/torneios/${id}/inscritos`);
      if (response.status === 200) {
          const data = await response.json();
          setInscritos(data);
      }
      else {
          setInscritos([]);
      }
      setLoading2(false);
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

    const searchCalendarioGrupos = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/calendario/grupos`);
        if (response.status === 200) {
            const data = await response.json();
            setCalendarioGrupos(data);
            console.log(data);
        }
        else {
            setCalendarioGrupos([]);
        }
    }

    const searchCalendarioElim = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/calendario/eliminatorias`);
        if (response.status === 200) {
            const data = await response.json();
            setCalendarioElim(data);
            console.log(data);
        }
        else {
            setCalendarioElim([]);
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
        setLoading1(false);
    }
      console.log(gestao)

    //Search inicial do torneio
    useEffect(() => {
      setLoading1(true);
      setLoading2(true);
      searchTorneio();
      searchInscritos();
      searchApurados();
      searchCalendarioGrupos();
      searchCalendarioElim();
      searchJogos();
    },[])

    if(loading1 || loading2)
      return (<div>LOADING!!!</div>)

    return(
        <>
            <div className='titulo'>
              <h1>{torneio.nomeTorneio}</h1>
            </div>

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
            {calendarioGrupos?.length > 0
            ? (
              <TorneioDisplay torneio = {torneio} inscritos = {inscritos} calendario={calendarioGrupos.splice(0,5)} tipo = "1" jogos = {jogos}/>
              )
            : (<TorneioDisplay torneio = {torneio} inscritos = {inscritos} calendario={calendarioElim.splice(0,5)} tipo = "2" jogos = {jogos}/>
            )
            }



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
