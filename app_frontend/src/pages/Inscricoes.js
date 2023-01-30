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
        ? (
          <div class="py-3">
            <div class="container px-4 mx-auto">
              <div class="p-4 bg-red-500 rounded-lg">
                <div class="flex w-full h-full items-center justify-between">
                  <div class="flex items-center pr-6">
                    <span class="flex-shrink-0 self-start">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 12C9.75278 12 9.5111 12.0733 9.30554 12.2107C9.09998 12.348 8.93976 12.5432 8.84516 12.7716C8.75055 13.0001 8.72579 13.2514 8.77402 13.4939C8.82225 13.7363 8.94131 13.9591 9.11612 14.1339C9.29094 14.3087 9.51367 14.4277 9.75614 14.476C9.99862 14.5242 10.25 14.4995 10.4784 14.4049C10.7068 14.3102 10.902 14.15 11.0393 13.9445C11.1767 13.7389 11.25 13.4972 11.25 13.25C11.25 12.9185 11.1183 12.6005 10.8839 12.3661C10.6495 12.1317 10.3315 12 10 12ZM10 10.5C10.2652 10.5 10.5196 10.3946 10.7071 10.2071C10.8946 10.0196 11 9.76522 11 9.5V6.5C11 6.23478 10.8946 5.98043 10.7071 5.79289C10.5196 5.60536 10.2652 5.5 10 5.5C9.73479 5.5 9.48043 5.60536 9.2929 5.79289C9.10536 5.98043 9 6.23478 9 6.5V9.5C9 9.76522 9.10536 10.0196 9.2929 10.2071C9.48043 10.3946 9.73479 10.5 10 10.5ZM10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433284 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9971 7.34874 18.9425 4.80691 17.0678 2.93219C15.1931 1.05746 12.6513 0.00294858 10 0ZM10 18C8.41775 18 6.87104 17.5308 5.55544 16.6518C4.23985 15.7727 3.21447 14.5233 2.60897 13.0615C2.00347 11.5997 1.84504 9.99113 2.15372 8.43928C2.4624 6.88743 3.22433 5.46197 4.34315 4.34315C5.46197 3.22433 6.88743 2.4624 8.43928 2.15372C9.99113 1.84504 11.5997 2.00346 13.0615 2.60896C14.5233 3.21447 15.7727 4.23984 16.6518 5.55544C17.5308 6.87103 18 8.41775 18 10C17.9976 12.121 17.1539 14.1544 15.6542 15.6542C14.1544 17.1539 12.121 17.9976 10 18Z" fill="#7A0C2E"></path>
                      </svg>
                    </span>
                    <span class="text-sm leading-5 text-red-900 font-medium ml-3">O Torneio já foi iniciado</span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )
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
                                {inscricoes?.length > 0
                                ? (<>{inscricoes.map((equipa) => (
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
                                  ))}</>)
                                : (
                                  <div class="py-3">
                                    <div class="container px-4 mx-auto">
                                      <div class="p-4 bg-red-500 rounded-lg">
                                        <div class="flex w-full h-full items-center justify-between">
                                          <div class="flex items-center pr-6">
                                            <span class="flex-shrink-0 self-start">
                                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 12C9.75278 12 9.5111 12.0733 9.30554 12.2107C9.09998 12.348 8.93976 12.5432 8.84516 12.7716C8.75055 13.0001 8.72579 13.2514 8.77402 13.4939C8.82225 13.7363 8.94131 13.9591 9.11612 14.1339C9.29094 14.3087 9.51367 14.4277 9.75614 14.476C9.99862 14.5242 10.25 14.4995 10.4784 14.4049C10.7068 14.3102 10.902 14.15 11.0393 13.9445C11.1767 13.7389 11.25 13.4972 11.25 13.25C11.25 12.9185 11.1183 12.6005 10.8839 12.3661C10.6495 12.1317 10.3315 12 10 12ZM10 10.5C10.2652 10.5 10.5196 10.3946 10.7071 10.2071C10.8946 10.0196 11 9.76522 11 9.5V6.5C11 6.23478 10.8946 5.98043 10.7071 5.79289C10.5196 5.60536 10.2652 5.5 10 5.5C9.73479 5.5 9.48043 5.60536 9.2929 5.79289C9.10536 5.98043 9 6.23478 9 6.5V9.5C9 9.76522 9.10536 10.0196 9.2929 10.2071C9.48043 10.3946 9.73479 10.5 10 10.5ZM10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433284 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9971 7.34874 18.9425 4.80691 17.0678 2.93219C15.1931 1.05746 12.6513 0.00294858 10 0ZM10 18C8.41775 18 6.87104 17.5308 5.55544 16.6518C4.23985 15.7727 3.21447 14.5233 2.60897 13.0615C2.00347 11.5997 1.84504 9.99113 2.15372 8.43928C2.4624 6.88743 3.22433 5.46197 4.34315 4.34315C5.46197 3.22433 6.88743 2.4624 8.43928 2.15372C9.99113 1.84504 11.5997 2.00346 13.0615 2.60896C14.5233 3.21447 15.7727 4.23984 16.6518 5.55544C17.5308 6.87103 18 8.41775 18 10C17.9976 12.121 17.1539 14.1544 15.6542 15.6542C14.1544 17.1539 12.121 17.9976 10 18Z" fill="#7A0C2E"></path>
                                              </svg>
                                            </span>
                                            <span class="text-sm leading-5 text-red-900 font-medium ml-3">0 inscrições pendentes!</span>
                                          </div>

                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
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
