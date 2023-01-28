import React from 'react'

const InscritosDisplay = ({inscritos,titulo}) => {
    return (
        <section class="bg-coolGray-50 py-4">
          <div class="container px-4 mx-auto">
            <div class="pt-6 bg-white overflow-hidden border border-coolGray-100 rounded-md shadow-dashboard">
              <h2 class="px-6 mb-4 text-lg text-coolGray-900 font-semibold">{titulo}</h2>
              <div class="px-6 pb-4">
                <table class="w-full">
                  <tbody>
                    <tr class="whitespace-nowrap h-11 bg-gray-100 bg-opacity-80">
                    <th class="px-4 font-semibold text-xs text-orange-500 uppercase text-left rounded-l-md">
                      <p>Nome</p>
                    </th>
                    <th class="whitespace-nowrap px-4 font-semibold text-xs text-orange-500 uppercase text-center">
                      {(titulo === "Apurados"
                        ?
                          "Grupo"

                        : "Ranking"
                      )
                      }

                    </th>
                    <th class="whitespace-nowrap px-4 font-semibold text-xs text-orange-500 uppercase text-center">Clube</th>
                    </tr>

                    {inscritos.map((equipa) => (
                    <tr class="h-18 border-b border-coolGray-100">
                      <th class="whitespace-nowrap px-4 bg-white text-left">
                        <div class="flex items-center -m-2">
                          <div class="w-auto p-2">
                            <p class="text-sm font-medium text-coolGray-800">{equipa.nomeEquipa}</p>
                          </div>
                        </div>
                      </th>
                      <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">{equipa.ranking}</th>
                      <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">{equipa.clube}</th>
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

export default InscritosDisplay;
