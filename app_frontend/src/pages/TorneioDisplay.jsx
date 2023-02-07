import React from 'react'
import '../components/containerTorneios.css'
import InscritosDisplay from "../components/ListaInscritos.js";
import CalendarioDisplay from "../components/CalendarioDisplay.js";
import JogoDisplay from "./JogoDisplay.jsx";
import {Link} from 'react-router-dom';

const TorneioDisplay = ({torneio,inscritos,calendario,tipo,jogos}) => {
    const escalao = (torneio.escalao == 0) ? "Seniores" :
                    (torneio.escalao == 1) ? "Sub-21" :
                    (torneio.escalao == 2) ? "Sub-20" :
                    (torneio.escalao == 3) ? "Sub-19" :
                    (torneio.escalao == 4) ? "Sub-18" :
                    (torneio.escalao == 5) ? "Sub-17" :
                    (torneio.escalao == 6) ? "Sub-16" :
                    (torneio.escalao == 7) ? "Sub-15" :
                    (torneio.escalao == 8) ? "Sub-14" :
                    (torneio.escalao == 9) ? "Sub-13" :
                    (torneio.escalao == 10) ? "Sub-12" :
                    (torneio.escalao == 11) ? "Sub-11" :
                    (torneio.escalao == 12) ? "Sub-10" :
                    (torneio.escalao == 13) ? "Sub-9" :
                    (torneio.escalao == 14) ? "Sub-8" :
                    (torneio.escalao == 15) ? "Sub-7" :
                    (torneio.escalao == 16) ? "Sub-6" :
                    "Sub-5"
    return (

<section class="py-3">
  <div class="container px-4 mx-auto">


    <div class="mb-6 bg-gray-100 rounded-xl">
      <div class="flex flex-wrap">

        <div class="w-full sm:w-1/2 lg:w-1/4 pl-4 md:pl-8 xl:pl-10 border-b lg:border-b-0 sm:border-r border-white">
          <div class="py-5 px-6">
            <h5 class="text-sm font-semibold text-orange-500 mb-6 leading-normal tracking-wide">Estado</h5>
            <div class="flex flex-wrap items-center mb-1 -m-2">
              <div class="w-auto p-2">
                <h4 class="text-2xl text-gray-800 font-bold tracking-wide">
                {torneio.terminado === 0
                ? ("Por começar")
                : (torneio.terminado === 1
                  ? ("A decorrer")
                    : "Terminado"
                )}
                </h4>
              </div>

            </div>
            <p class="text-xs font-semibold text-gray-500">
            {torneio.inscricoesAbertas === 1
            ? (
              `Inscrições abertas (${inscritos?.length})`
              )
            :   `Inscrições fechadas (${inscritos?.length})`
            }
            </p>
          </div>
        </div>

        <div class="w-full sm:w-1/2 lg:w-1/4 pl-4 md:pl-8 xl:pl-10 border-b lg:border-b-0 lg:border-r border-white">
          <div class="py-5 px-6">
            <h5 class="text-sm font-semibold text-orange-500 mb-6 leading-normal tracking-wide">Desporto</h5>
            <div class="flex flex-wrap items-center mb-1 -m-2">
              <div class="w-auto p-2">
                <h4 class="text-2xl text-gray-800 font-bold tracking-wide">{torneio.nomeDesporto}</h4>
              </div>
              <div class="w-auto p-2">
                <div class="inline-flex px-2 h-7 items-center justify-center text-orange-100 bg-orange-500 rounded-full">

                  <span class="text-xs font-medium">{escalao}</span>
                </div>
              </div>

            </div>
            <p class="text-xs font-semibold text-gray-500">
            {torneio.tamEquipa == 1
              ? "Individual"
              : `Equipas de ${torneio.tamEquipa} elementos`
            }
            {torneio.genero == 0
              ? " (Masculino)"
              : torneio.genero == 1
                ? " (Feminino)"
                : " (Indiferente)"
            }
            </p>
          </div>
        </div>

        <div class="w-full sm:w-1/2 lg:w-1/4 pl-4 md:pl-8 xl:pl-10 border-b md:border-b-0 sm:border-r border-white">
          <div class="py-5 px-6">
            <h5 class="text-sm font-semibold text-orange-500 mb-6 leading-normal tracking-wide">Tipo</h5>
            <div class="flex flex-wrap items-center mb-1 -m-2">
              <div class="w-auto p-2">
                <h4 class="text-2xl text-gray-800 font-bold tracking-wide">
                {torneio.isFederado === 1
                ? (
                  "Federado"
                  )
                : "Amador"
                }
                </h4>
              </div>
            </div>
            <p class="text-xs font-semibold text-gray-500">{torneio.nometipoTorneio}</p>
          </div>
        </div>

        <div class="w-full sm:w-1/2 lg:w-1/4 pl-4 md:pl-8 xl:pl-10">
          <div class="py-5 px-6">
            <h5 class="text-sm font-semibold text-orange-500 mb-6 leading-normal tracking-wide">Data</h5>
            <div class="flex flex-wrap items-center mb-1 -m-2">
              <div class="w-auto p-2">
                <h4 class="text-2xl text-gray-800 font-bold tracking-wide">{torneio.dataTorneio}</h4>
              </div>
            </div>
            <p class="text-xs font-semibold text-gray-500">{torneio.Nome}</p>
          </div>
        </div>


      </div>
    </div>



    <div class="flex flex-wrap -mx-3 mb-6">

      <div class="w-full lg:w-2/3 px-3 mb-6 lg:mb-0">
        <Link to={`/${torneio.idTorneio}/jogos`} state={{ tipoTorneio : torneio.tipoTorneio }}>
        <div class="h-full p-6 bg-gray-100 rounded-xl hover:bg-gray-300">
            <div className={`md:w-full lg:w-full w-full px-3 mb-8`}>
              <div class={`w-full mx-auto h-full px-3 pt-6 pb-24  rounded-xl`}>
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <h3 class="text-lg text-black font-semibold mr-2">
                    {torneio.terminado === 0
                    ? (
                      "Por começar"
                      )
                    : (torneio.terminado === 1
                    ? (
                      "A decorrer"
                      )
                    : "Terminado"
                    )
                    }
                    </h3>
                    <span class="inline-flex items-center justify-center w-6 h-7 rounded-full bg-gray-600 text-xs font-medium text-gray-100">{jogos?.length}</span>
                  </div>
                  <div>
                    <button class="inline-block mr-2 text-gray-700 hover:text-gray-300">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.6667 5.33329H6.66675V1.33329C6.66675 1.15648 6.59651 0.986913 6.47149 0.861888C6.34646 0.736864 6.17689 0.666626 6.00008 0.666626C5.82327 0.666626 5.6537 0.736864 5.52868 0.861888C5.40365 0.986913 5.33342 1.15648 5.33342 1.33329V5.33329H1.33341C1.1566 5.33329 0.987035 5.40353 0.86201 5.52855C0.736986 5.65358 0.666748 5.82315 0.666748 5.99996C0.666748 6.17677 0.736986 6.34634 0.86201 6.47136C0.987035 6.59639 1.1566 6.66663 1.33341 6.66663H5.33342V10.6666C5.33342 10.8434 5.40365 11.013 5.52868 11.138C5.6537 11.2631 5.82327 11.3333 6.00008 11.3333C6.17689 11.3333 6.34646 11.2631 6.47149 11.138C6.59651 11.013 6.66675 10.8434 6.66675 10.6666V6.66663H10.6667C10.8436 6.66663 11.0131 6.59639 11.1382 6.47136C11.2632 6.34634 11.3334 6.17677 11.3334 5.99996C11.3334 5.82315 11.2632 5.65358 11.1382 5.52855C11.0131 5.40353 10.8436 5.33329 10.6667 5.33329Z" fill="currentColor"></path>
                      </svg>
                    </button>

                  </div>
                </div>
                <div class={`h-1 w-full mb-4 rounded-full ${torneio.terminado=== 0? 'bg-blue-500' : ((torneio.terminado ===1)? 'bg-green-500' : 'bg-orange-500')}`}></div>
                <a class="w-full hover:bg-gray-700 transition duration-200" href="#">
                  {jogos.slice(0, 3).map((jogo) => (
                    <JogoDisplay jogo = {jogo}/>
                  ))}
                </a>
              </div>
            </div>
          </div>
        </Link>
      </div>


      <div class="w-full lg:w-1/3 px-3">
        <Link to={`/${torneio.idTorneio}/calendario`}>
        <div class="h-full p-6 bg-gray-100 hover:bg-gray-200 rounded-xl">
          {calendario.length >0 ?
          <CalendarioDisplay calendario = {calendario} tipo = {tipo}/>
          : (<p class="font-semibold text-center text-lg text-coolGray-900">Calendário ainda não foi gerado!</p>)
          }
        </div>
        </Link>
      </div>


    </div>



    <div class="flex flex-wrap -mx-3">


      <div class="w-full lg:w-1/2 px-3 mb-6 lg:mb-0">
        <div class="h-full p-6 bg-gray-100 rounded-xl">
          <InscritosDisplay inscritos = {inscritos} titulo = "Inscritos"/>
        </div>
      </div>


      <div class="w-full lg:w-1/2 px-3">
        <Link to={`/${torneio.idTorneio}/classificacao`}>
        <div class="h-full px-6 pt-6 pb-8 bg-white hover:bg-gray-100 rounded-xl">
          <div class="w-full mt-6 pb-4 overflow-x-auto">
          <section class="py-20 md:py-28">
            <div class="container px-4 mx-auto">
              <div class="max-w-4xl mx-auto text-center">
                <h2 class="mb-4 text-3xl md:text-4xl font-heading font-bold">Classificação</h2>
                <p class="mb-6 text-lg md:text-xl font-heading font-medium text-coolGray-500">Siga aqui a classificação do torneio</p>
              </div>
            </div>
          </section>
          </div>
        </div>
        </Link>
      </div>

    </div>

  </div>
</section>

    );
}

export default TorneioDisplay;
