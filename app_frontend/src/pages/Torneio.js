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

        {torneio !== ""
        ? (<div className = "Torneio">
            {calendarioGrupos?.length > 0
            ? (
              <TorneioDisplay torneio = {torneio} inscritos = {inscritos} calendario={calendarioGrupos.splice(0,5)} tipo = "1" jogos = {jogos}/>
              )
            : (<TorneioDisplay torneio = {torneio} inscritos = {inscritos} calendario={calendarioElim.splice(0,5)} tipo = "2" jogos = {jogos}/>
            )
            }

            <section class="py-3">
              <div class="container px-4 mx-auto">
              <div class="flex flex-wrap my-6 -mx-3">

              {apurados?.length > 0
              ? (
                <div class="w-full lg:w-1/2 px-3 mb-6 lg:mb-0">
                  <div class="h-full p-6 bg-gray-100 rounded-xl">
                      <InscritosDisplay inscritos = {apurados} titulo = "Apurados"/>
                  </div>
                </div>
                )
              : (null)
              }


                <div class="w-full lg:w-1/2 px-3">
                  <div class="h-full px-6 pt-6 pb-8 bg-white rounded-xl">
                    <div class="w-full mt-6 pb-4 overflow-x-auto">
                    <section class="py-20 md:py-28 bg-white">
                      <div class="container px-4 mx-auto">
                        <div class="max-w-4xl mx-auto text-center">
                          <h2 class="mb-4 text-3xl md:text-4xl font-heading font-bold">
                          {gestao == 1
                          ?
                          "Gestão"
                          : "Incrições"
                          }
                          </h2>

                          {gestao == 1
                          ?
                          (<>
                            <p class="mb-6 text-lg md:text-xl font-heading font-medium text-coolGray-500">Personalize o torneio a seu gosto!</p>
                            <a class="inline-block py-3 px-7 w-full md:w-auto text-lg leading-7 text-green-50 bg-orange-500 hover:bg-orange-600 font-medium text-center focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 border border-transparent rounded-md shadow-sm" href={`/${id}/gestao`}>-></a>
                          </>)
                          :
                          (<>
                            <p class="mb-6 text-lg md:text-xl font-heading font-medium text-coolGray-500">Increva-se neste torneio!</p>
                            <a class="inline-block py-3 px-7 w-full md:w-auto text-lg leading-7 text-green-50 bg-orange-500 hover:bg-orange-600 font-medium text-center focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 border border-transparent rounded-md shadow-sm" href={`/${id}/`}>Inscrever></a>
                          </>)
                          }
                          </div>
                      </div>
                    </section>
                    </div>
                  </div>
                </div>

              </div>
              </div>
            </section>




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
