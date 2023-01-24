import React from 'react'

const GrupoDisplay = ({grupo}) => {
    return (
        <section class="bg-coolGray-50 py-4">
          <div class="container px-4 mx-auto">
            <div class="pt-6 bg-white overflow-hidden border border-coolGray-100 rounded-md shadow-dashboard">
              <h2 class="px-6 mb-4 text-lg text-coolGray-900 font-semibold">Grupo {grupo.numeroGrupo}</h2>
              <div class="px-6 overflow-x-auto">
                <table class="w-full">
                  <tbody>
                    <tr class="whitespace-nowrap h-11 bg-gray-100 bg-opacity-80">
                    <th class="px-4 font-semibold text-xs text-coolGray-500 uppercase text-left rounded-l-md">
                      <p>Equipa</p>
                    </th>
                    <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">P</th>
                    <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">V</th>
                    <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">D</th>
                    {grupo.tipoClassificacao == 1
                      ? (
                        <>
                        <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">E</th>
                        <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">GM</th>
                        <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">GS</th>
                        </>
                      ) : (
                        <>
                        <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">sG</th>
                        <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">sP</th>
                        <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">pG</th>
                        <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">pP</th>
                        </>
                      )
                    }
                    </tr>

                    {grupo.classificacaoGrupo.map((equipa) => (
                    <tr class="h-18 border-b border-coolGray-100">
                      <th class="whitespace-nowrap px-4 bg-white text-left">
                        <div class="flex items-center -m-2">
                          <div class="w-auto p-2">
                            <p class="text-sm font-medium text-coolGray-800">{equipa.nomeEquipa}</p>
                          </div>
                        </div>
                      </th>
                      <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">{equipa.pontos}</th>
                      <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">{equipa.vitorias}</th>
                      <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">{equipa.derrotas}</th>
                      {grupo.tipoClassificacao == 1
                        ? (
                          <>
                          <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">{equipa.empates}</th>
                          <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">{equipa.golosMarcados}</th>
                          <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">{equipa.golosSofridos}</th>
                          </>
                        ) : (
                          <>
                          <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">{equipa.setsGanhos}</th>
                          <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">{equipa.setsPerdidos}</th>
                          <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">{equipa.pontosGanhos}</th>
                          <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">{equipa.pontoPerdidos}</th>
                          </>
                        )
                      }
                    </tr>
                    )
                  )
                  }
                  </tbody></table>
              </div>
            </div>
          </div>
        </section>
    )
}

export default GrupoDisplay;
