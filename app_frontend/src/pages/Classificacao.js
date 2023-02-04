import {useState,useEffect} from 'react';
import {useParams} from 'react-router-dom'
import GrupoDisplay from "../components/GrupoDisplay.js";
import ElimDisplay from "./ElimDisplay.jsx";
import {NavbarDynamic} from '../components/NavbarDynamic.js';

const API_URL="http://localhost:3000"

export function Classificacao() {
    const {id} = useParams()
    const [classificacaoGrupo,setClassificacaoGrupo] = useState([]);
    const [classificacaoElim,setClassificacaoElim] = useState([]);
    const [elimSize,setElimSize] = useState(0);
    const [tipo,setTipo] = useState("");
    const [loading1,setLoading1] = useState(false);
    const [loading2,setLoading2] = useState(false);

    // Função que vai buscar a classificação dos grupos.
    const searchGrupos = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/classificacao/grupos`);
        if (response.status === 200) {
            const data = await response.json();
            setClassificacaoGrupo(data);
        }
        else {
            setClassificacaoGrupo([]);
            setTipo("eliminatorias")
        }
        setLoading1(false);
    }


    // Função que vai buscar a classificação das eliminatórias.
    const searchElim = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/classificacao/eliminatorias`);
        if (response.status === 200) {
            const data = await response.json();
            setClassificacaoElim(data);
            setElimSize(data.length)
        }
        else {
            setClassificacaoElim([]);
            setTipo("grupos")
        }
        setLoading2(false);
    }

    function changeTipo(t){
      if(t === tipo)
        t = ""
      setTipo(t);
    }

    // Vai buscar os grupos e as eliminatórias.
    useEffect(() => {
      setLoading1(true);
      setLoading2(true);
        searchGrupos();
        searchElim();
      },[])

    if(loading1 || loading2)
      return (<div>Loading!</div>)

    return(
        <>
        <NavbarDynamic/>
        <div className='titulo pt-8 pb-3'>
          <h1>Classificação</h1>
        </div>

        {classificacaoGrupo.length == 0 && classificacaoElim.length == 0
        ? <div class="p-4 mt-16 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-200" role="alert">
            <span class="font-medium">O torneio ainda não foi sorteado!</span>
          </div>
        : <section class="py-3">
          <div class="container px-4 mx-auto">
            <div class="flex flex-wrap -mx-3 -mb-8">

            {classificacaoGrupo?.length > 0
            ? (
              <div className={`${
                  (tipo === "" && elimSize > 0) ? 'lg:w-1/2' : (tipo === "") ? 'lg:w-full' : (tipo === "grupos") ? 'md:w-full lg:w-full' : 'hidden'
                }  w-full md:w-full px-3 mb-8 `}>

                <div class={`${(tipo === "") ? 'max-w-xl' : 'w-full'} mx-auto h-full px-3 pt-6 pb-24 bg-gray-100 rounded-xl`}>
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                      <h3 class="text-lg text-black font-semibold mr-2">Grupos</h3>
                      <span class="inline-flex items-center justify-center w-6 h-7 rounded-full bg-gray-600 text-xs font-medium text-gray-100">{classificacaoGrupo?.length}</span>
                    </div>
                    <div>
                      <button class="inline-block mr-2 text-gray-700 hover:text-gray-300" onClick={() => changeTipo("grupos")}>
                      {(tipo === "grupos"
                        ? "-"
                        :
                      (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.6667 5.33329H6.66675V1.33329C6.66675 1.15648 6.59651 0.986913 6.47149 0.861888C6.34646 0.736864 6.17689 0.666626 6.00008 0.666626C5.82327 0.666626 5.6537 0.736864 5.52868 0.861888C5.40365 0.986913 5.33342 1.15648 5.33342 1.33329V5.33329H1.33341C1.1566 5.33329 0.987035 5.40353 0.86201 5.52855C0.736986 5.65358 0.666748 5.82315 0.666748 5.99996C0.666748 6.17677 0.736986 6.34634 0.86201 6.47136C0.987035 6.59639 1.1566 6.66663 1.33341 6.66663H5.33342V10.6666C5.33342 10.8434 5.40365 11.013 5.52868 11.138C5.6537 11.2631 5.82327 11.3333 6.00008 11.3333C6.17689 11.3333 6.34646 11.2631 6.47149 11.138C6.59651 11.013 6.66675 10.8434 6.66675 10.6666V6.66663H10.6667C10.8436 6.66663 11.0131 6.59639 11.1382 6.47136C11.2632 6.34634 11.3334 6.17677 11.3334 5.99996C11.3334 5.82315 11.2632 5.65358 11.1382 5.52855C11.0131 5.40353 10.8436 5.33329 10.6667 5.33329Z" fill="currentColor"></path>
                        </svg>))}
                      </button>

                    </div>
                  </div>
                  <div class="h-1 w-full mb-4 rounded-full bg-blue-500"></div>
                  <a class="w-full hover:bg-gray-700 transition duration-200">
                  {(tipo === "grupos"
                    ?
                      ((classificacaoGrupo.map((grupo) => (
                      <GrupoDisplay grupo = {grupo}/>
                    ))))
                    :
                      ((classificacaoGrupo.slice(0,2).map((grupo) => (
                      <GrupoDisplay grupo = {grupo}/>
                    ))))
                  )}
                  </a>

                </div>
              </div>
            ) : (null)
          }

          {elimSize > 0
          ? (
              <div className={`${
                  (tipo === "" && classificacaoGrupo?.length > 0) ? 'lg:w-1/2' : (tipo === "") ? 'lg:w-full' : (tipo === "eliminatorias") ? 'md:w-full lg:w-full' : 'hidden'
                }  w-full px-3 mb-8 `}>

                <div class={`${(tipo === "") ? 'max-w-xl' : 'w-full'} mx-auto h-full px-3 pt-6 pb-24 bg-gray-100 rounded-xl`}>
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                      <h3 class="text-lg text-black font-semibold mr-2">Eliminatorias</h3>
                      <span class="inline-flex items-center justify-center w-6 h-7 rounded-full bg-gray-600 text-xs font-medium text-gray-100">{elimSize}</span>
                    </div>
                    <div>
                      <button class="inline-block mr-2 text-gray-700 hover:text-gray-300" onClick={() => changeTipo("eliminatorias")}>
                        {(tipo === "eliminatorias"
                          ? "-"
                          :
                        (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.6667 5.33329H6.66675V1.33329C6.66675 1.15648 6.59651 0.986913 6.47149 0.861888C6.34646 0.736864 6.17689 0.666626 6.00008 0.666626C5.82327 0.666626 5.6537 0.736864 5.52868 0.861888C5.40365 0.986913 5.33342 1.15648 5.33342 1.33329V5.33329H1.33341C1.1566 5.33329 0.987035 5.40353 0.86201 5.52855C0.736986 5.65358 0.666748 5.82315 0.666748 5.99996C0.666748 6.17677 0.736986 6.34634 0.86201 6.47136C0.987035 6.59639 1.1566 6.66663 1.33341 6.66663H5.33342V10.6666C5.33342 10.8434 5.40365 11.013 5.52868 11.138C5.6537 11.2631 5.82327 11.3333 6.00008 11.3333C6.17689 11.3333 6.34646 11.2631 6.47149 11.138C6.59651 11.013 6.66675 10.8434 6.66675 10.6666V6.66663H10.6667C10.8436 6.66663 11.0131 6.59639 11.1382 6.47136C11.2632 6.34634 11.3334 6.17677 11.3334 5.99996C11.3334 5.82315 11.2632 5.65358 11.1382 5.52855C11.0131 5.40353 10.8436 5.33329 10.6667 5.33329Z" fill="currentColor"></path>
                        </svg>))}
                      </button>

                    </div>
                  </div>
                  <div class="h-1 w-full mb-4 rounded-full bg-orange-500"></div>
                  <a class="w-full hover:bg-gray-700 transition duration-200 bg-black">
                    {(tipo === "eliminatorias"
                      ?
                      (<ElimDisplay elim = {classificacaoElim} elimSize = {elimSize} tipo = {1}/>)
                      :
                      (<ElimDisplay elim = {classificacaoElim} elimSize = {elimSize} tipo = {2}/>)
                    )}
                  </a>

                </div>
              </div>
            )
          : (null)
          }


          </div>
        </div>
      </section>
    }
    </>
    )
}
