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
      window.scrollTo(0, 0);
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
        ? <div class="py-3">
          <div class="container px-4 mx-auto">
            <div class="p-4 bg-red-200 rounded-lg">
              <div class="flex w-full h-full items-center justify-between">
                <div class="flex items-center pr-6">
                  <span class="flex-shrink-0 self-start">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12C9.75278 12 9.5111 12.0733 9.30554 12.2107C9.09998 12.348 8.93976 12.5432 8.84516 12.7716C8.75055 13.0001 8.72579 13.2514 8.77402 13.4939C8.82225 13.7363 8.94131 13.9591 9.11612 14.1339C9.29094 14.3087 9.51367 14.4277 9.75614 14.476C9.99862 14.5242 10.25 14.4995 10.4784 14.4049C10.7068 14.3102 10.902 14.15 11.0393 13.9445C11.1767 13.7389 11.25 13.4972 11.25 13.25C11.25 12.9185 11.1183 12.6005 10.8839 12.3661C10.6495 12.1317 10.3315 12 10 12ZM10 10.5C10.2652 10.5 10.5196 10.3946 10.7071 10.2071C10.8946 10.0196 11 9.76522 11 9.5V6.5C11 6.23478 10.8946 5.98043 10.7071 5.79289C10.5196 5.60536 10.2652 5.5 10 5.5C9.73479 5.5 9.48043 5.60536 9.2929 5.79289C9.10536 5.98043 9 6.23478 9 6.5V9.5C9 9.76522 9.10536 10.0196 9.2929 10.2071C9.48043 10.3946 9.73479 10.5 10 10.5ZM10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433284 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9971 7.34874 18.9425 4.80691 17.0678 2.93219C15.1931 1.05746 12.6513 0.00294858 10 0ZM10 18C8.41775 18 6.87104 17.5308 5.55544 16.6518C4.23985 15.7727 3.21447 14.5233 2.60897 13.0615C2.00347 11.5997 1.84504 9.99113 2.15372 8.43928C2.4624 6.88743 3.22433 5.46197 4.34315 4.34315C5.46197 3.22433 6.88743 2.4624 8.43928 2.15372C9.99113 1.84504 11.5997 2.00346 13.0615 2.60896C14.5233 3.21447 15.7727 4.23984 16.6518 5.55544C17.5308 6.87103 18 8.41775 18 10C17.9976 12.121 17.1539 14.1544 15.6542 15.6542C14.1544 17.1539 12.121 17.9976 10 18Z" fill="#7A0C2E"></path>
                    </svg>
                  </span>
                  <span class="text-sm leading-5 text-red-900 font-medium ml-3">O torneio ainda não foi sorteado!</span>
                </div>
              </div>
            </div>
          </div>
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
