import {useLocation,useParams} from 'react-router-dom'
import {useState,useEffect} from 'react';
import JogoDisplay from "./JogoDisplay.jsx";
import {NavbarDynamic} from '../components/NavbarDynamic.js';
//import {Link,Route,Routes} from 'react-router-dom';
import '../components/titulo.css';

const API_URL="http://localhost:3000/torneios"

export function Jogos() {
    const {id} = useParams();
    const [jogos1,setJogos1] = useState([]);
    const [jogos2,setJogos2] = useState([]);
    const [jogos3,setJogos3] = useState([]);
    const [tipo,setTipo] = useState("");
    const [filtro,setFiltro] = useState("");
    let location = useLocation();
    const tipoTorneio = location.state.tipoTorneio;


    const searchJogos = async (tipo) => {
        let pedido = API_URL + "/" + id + "/" + tipo;

        if (filtro !== "") {
            pedido += `?filtro=${filtro}`;
        }

        const response = await fetch (pedido);
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            if(tipo === "jogosaDecorrer")
              setJogos1(data);
            if(tipo === "jogosPorComecar")
              setJogos2(data);
            if(tipo === "jogosEncerrados")
              setJogos3(data);


        }
        else {
          if(tipo === "jogosaDecorrer")
            setJogos1([]);
          if(tipo === "jogosPorComecar")
            setJogos2([]);
          if(tipo === "jogosEncerrados")
            setJogos3([]);
        }
    }

    useEffect(() => {
        searchJogos("jogosaDecorrer");
        searchJogos("jogosPorComecar");
        searchJogos("jogosEncerrados");
    },[tipo,filtro])


    //Para mudar o filtro de federado
    const handleFiltro = event => {
        if (event.target.value === "Todos") setFiltro("");
        else setFiltro(event.target.value);
      };

    function changeTipo(t){
      if(t === tipo)
        t = ""
      setTipo(t);
      console.log(tipo);
    }

    let showOptions = false;
    if(tipoTorneio == 2 || tipoTorneio == 5 || tipoTorneio == 6 || tipoTorneio == 7) {
        showOptions = true;
    }
    console.log(tipoTorneio);
    //
    // {showOptions
    //     ? <form>
    //         <label>Filtro: </label>
    //         <select onChange={handleFiltro}>
    //             <option defaultValue="Todos">Todos</option>
    //             <option value="FaseGrupos">Fase de Grupos</option>
    //             <option value="Eliminatorias">Eliminatórias</option>
    //         </select>
    //       </form>
    //     : <div></div>
    // }
    return(
        <>
        <NavbarDynamic/>
        <div className='titulo pt-8 pb-3'>
          <h1>Jogos</h1>
        </div>


        <section class="py-3">
          <div class="container px-4 mx-auto">
            <div class="flex flex-wrap -mx-3 -mb-8">

              <div className={`${
                  (tipo === "") ? 'md:w-1/2 lg:w-1/3' : (tipo === "jogosPorComecar") ? 'md:w-full lg:w-full' : 'hidden'
                }  w-full px-3 mb-8 `}>

                <div class={`${(tipo === "") ? 'max-w-sm' : 'w-full'} mx-auto h-full px-3 pt-6 pb-24 bg-gray-100 rounded-xl`}>
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                      <h3 class="text-lg text-black font-semibold mr-2">Por começar</h3>
                      <span class="inline-flex items-center justify-center w-6 h-7 rounded-full bg-gray-600 text-xs font-medium text-gray-100">{jogos2?.length}</span>
                    </div>
                    <div>
                      <button class="inline-block mr-2 text-gray-700 hover:text-gray-300" onClick={() => changeTipo("jogosPorComecar")}>
                      {(tipo === "jogosPorComecar"
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
                  {(tipo === "jogosPorComecar"
                    ? ((jogos2.map((jogo) => (
                      <JogoDisplay jogo = {jogo}/>
                    ))))
                    :
                  (
                    (jogos2.slice(0, 3).map((jogo) => (
                      <JogoDisplay jogo = {jogo}/>
                    ))))
                  )}
                  </a>

                </div>
              </div>


              

              <div className={`${
                  (tipo === "") ? 'md:w-1/2 lg:w-1/3' : (tipo === "jogosaDecorrer") ? 'md:w-full lg:w-full' : 'hidden'
                }  w-full px-3 mb-8 `}>

                <div class={`${(tipo === "") ? 'max-w-sm' : 'w-full'} mx-auto h-full px-3 pt-6 pb-24 bg-gray-100 rounded-xl`}>
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                      <h3 class="text-lg text-black font-semibold mr-2">A decorrer</h3>
                      <span class="inline-flex items-center justify-center w-6 h-7 rounded-full bg-gray-600 text-xs font-medium text-gray-100">{jogos1?.length}</span>
                    </div>
                    <div>
                      <button class="inline-block mr-2 text-gray-700 hover:text-gray-300" onClick={() => changeTipo("jogosaDecorrer")}>
                      {(tipo === "jogosaDecorrer"
                        ? "-"
                        :
                      (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.6667 5.33329H6.66675V1.33329C6.66675 1.15648 6.59651 0.986913 6.47149 0.861888C6.34646 0.736864 6.17689 0.666626 6.00008 0.666626C5.82327 0.666626 5.6537 0.736864 5.52868 0.861888C5.40365 0.986913 5.33342 1.15648 5.33342 1.33329V5.33329H1.33341C1.1566 5.33329 0.987035 5.40353 0.86201 5.52855C0.736986 5.65358 0.666748 5.82315 0.666748 5.99996C0.666748 6.17677 0.736986 6.34634 0.86201 6.47136C0.987035 6.59639 1.1566 6.66663 1.33341 6.66663H5.33342V10.6666C5.33342 10.8434 5.40365 11.013 5.52868 11.138C5.6537 11.2631 5.82327 11.3333 6.00008 11.3333C6.17689 11.3333 6.34646 11.2631 6.47149 11.138C6.59651 11.013 6.66675 10.8434 6.66675 10.6666V6.66663H10.6667C10.8436 6.66663 11.0131 6.59639 11.1382 6.47136C11.2632 6.34634 11.3334 6.17677 11.3334 5.99996C11.3334 5.82315 11.2632 5.65358 11.1382 5.52855C11.0131 5.40353 10.8436 5.33329 10.6667 5.33329Z" fill="currentColor"></path>
                        </svg>))}
                      </button>

                    </div>
                  </div>
                  <div class="h-1 w-full mb-4 rounded-full bg-green-500"></div>
                  <a class="w-full hover:bg-gray-700 transition duration-200">
                  {(tipo === "jogosaDecorrer"
                    ? ((jogos1.map((jogo) => (
                      <JogoDisplay jogo = {jogo}/>
                    ))))
                    :
                  (
                    (jogos1.slice(0, 3).map((jogo) => (
                      <JogoDisplay jogo = {jogo}/>
                    ))))
                  )}

                  </a>

                </div>
              </div>

              <div className={`${
                  (tipo === "") ? 'md:w-1/2 lg:w-1/3' : (tipo === "jogosEncerrados") ? 'md:w-full lg:w-full' : 'hidden'
                }  w-full px-3 mb-8 `}>

                <div class={`${(tipo === "") ? 'max-w-sm' : 'w-full'} mx-auto h-full px-3 pt-6 pb-24 bg-gray-100 rounded-xl`}>
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                      <h3 class="text-lg text-black font-semibold mr-2">Encerrados</h3>
                      <span class="inline-flex items-center justify-center w-6 h-7 rounded-full bg-gray-600 text-xs font-medium text-gray-100">{jogos3?.length}</span>
                    </div>
                    <div>
                      <button class="inline-block mr-2 text-gray-700 hover:text-gray-300" onClick={() => changeTipo("jogosEncerrados")}>
                        {(tipo === "jogosEncerrados"
                          ? "-"
                          :
                        (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.6667 5.33329H6.66675V1.33329C6.66675 1.15648 6.59651 0.986913 6.47149 0.861888C6.34646 0.736864 6.17689 0.666626 6.00008 0.666626C5.82327 0.666626 5.6537 0.736864 5.52868 0.861888C5.40365 0.986913 5.33342 1.15648 5.33342 1.33329V5.33329H1.33341C1.1566 5.33329 0.987035 5.40353 0.86201 5.52855C0.736986 5.65358 0.666748 5.82315 0.666748 5.99996C0.666748 6.17677 0.736986 6.34634 0.86201 6.47136C0.987035 6.59639 1.1566 6.66663 1.33341 6.66663H5.33342V10.6666C5.33342 10.8434 5.40365 11.013 5.52868 11.138C5.6537 11.2631 5.82327 11.3333 6.00008 11.3333C6.17689 11.3333 6.34646 11.2631 6.47149 11.138C6.59651 11.013 6.66675 10.8434 6.66675 10.6666V6.66663H10.6667C10.8436 6.66663 11.0131 6.59639 11.1382 6.47136C11.2632 6.34634 11.3334 6.17677 11.3334 5.99996C11.3334 5.82315 11.2632 5.65358 11.1382 5.52855C11.0131 5.40353 10.8436 5.33329 10.6667 5.33329Z" fill="currentColor"></path>
                        </svg>))}
                      </button>

                    </div>
                  </div>
                  <div class="h-1 w-full mb-4 rounded-full bg-orange-500"></div>
                  <a class="w-full hover:bg-gray-700 transition duration-200">
                  {(tipo === "jogosEncerrados"
                    ? ((jogos3.map((jogo) => (
                      <JogoDisplay jogo = {jogo}/>
                    ))))
                    :
                  (
                    (jogos3.slice(0, 3).map((jogo) => (
                      <JogoDisplay jogo = {jogo}/>
                    ))))
                  )}
                  </a>

                </div>
              </div>

            </div>
          </div>
        </section>
        </>
    )
}
