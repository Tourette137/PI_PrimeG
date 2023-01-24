import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';
import '../components/Buttons.css';

const API_URL="http://localhost:3000"

export function Inscricoes({ id,terminado,inscricoesA, ...props }) {
    const [inscricoesAbertas,setInscricoesAbertas] = useState(inscricoesA);
    const [inscricoes,setInscricoes] = useState([]);

    const searchInscricoes = async () => {
      const response = await fetch (`${API_URL}/torneios/${id}/inscricoes`);
      if (response.status === 200) {
          const data = await response.json();
          setInscricoes(data);
      }
      else {
          setInscricoes([]);
      }
    }

    const handleFecharInscricoes = async (e) => {
        e.preventDefault();
        const headers = {
            "authorization": "Bearer " +localStorage.getItem("token")
        }
        const tipo = (inscricoesAbertas == 1) ? 0 : 1
        const body = {
            "tipo" : tipo
        }

        axios.post(`${API_URL}/torneios/${id}/gestao/fecharInscricoes`, body,{headers: headers})
            .then(response => {
              setInscricoesAbertas(tipo)
        }).catch(e => console.log(e))
    }

    function gerirIncricao(equipa) {
      const headers = {
          "authorization": "Bearer " +localStorage.getItem("token")
      }
      const body = {
          "idEquipa" : equipa.idEquipa,
          "pendente" : equipa.pendente
      }
      axios.post(`${API_URL}/torneios/${id}/gestao/gerirInscricao`,body,{headers: headers})
          .then(response => {
            searchInscricoes();
      }).catch(e => console.log(e))
    }

    useEffect(() => {
      if(terminado === 0 && inscricoesAbertas === 1)
        searchInscricoes();
    },[inscricoesAbertas])

    return(
        <>
        {(terminado > 0 )
        ? (<h3>O Torneio já foi iniciado</h3>)
        : ((inscricoesAbertas === 1 )
            ?
              (<div className="place-content-center">
                <div className="">
                    <section class="bg-coolGray-50 py-4">
                      <div class="container px-4 mx-auto">
                        <div class="pt-6 bg-white overflow-hidden border border-coolGray-100 rounded-md shadow-dashboard">
                          <h2 class="px-6 mb-4 text-lg text-coolGray-900 font-semibold">Gerir Inscritos</h2>
                          <div class="px-6 overflow-x-auto">
                            <table class="w-full">
                              <tbody>
                                <tr class="whitespace-nowrap h-11 bg-gray-100 bg-opacity-80">
                                <th class="px-4 font-semibold text-xs text-coolGray-500 uppercase text-left rounded-l-md">
                                  <p>Nome</p>
                                </th>
                                <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">Ranking</th>
                                <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">Clube</th>
                                <th class="whitespace-nowrap px-4 font-semibold text-xs text-coolGray-500 uppercase text-center">Aceitar/Recusar</th>
                                </tr>
                                {inscricoes.map((equipa) => (
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
                                      <th class="whitespace-nowrap px-4 bg-white text-sm font-medium text-coolGray-800 text-center">
                                          <button className="text-xl p-1 mr-1" onClick={() => gerirIncricao({idEquipa:equipa.idEquipa,pendente:1})}> ✅</button>
                                          <button className="text-xl p-1" onClick={() => gerirIncricao({idEquipa:equipa.idEquipa,pendente:2})}>❌</button>
                                      </th>
                                    </tr>
                                  )
                                  )
                                  }
                                  </tbody></table>
                              </div>
                            </div>
                          </div>
                        </section>
                    </div>
                <div className="butoesAcceptBack gridButtons container" style={{ margin: "0 0 30px 0" }}>
                  <button className="buttonBlack" onClick={handleFecharInscricoes}>Fechar inscrições</button>
                </div>
              </div>
              )
            :
              (<div className="butoesAcceptBack gridButtons container " style={{ margin: "0 0 30px 0" }}>
                <button className="buttonBlack" onClick={handleFecharInscricoes}>Abir inscrições</button>
              </div>
            )
          )
        }
        </>
    )
}
