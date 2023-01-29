import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import GrupoDisplay from "../components/GrupoDisplay.js";
import ElimDisplay from "./ElimDisplay.jsx";
import axios from 'axios';
import InscritosDisplay from "../components/ListaInscritos.js";

const API_URL="http://localhost:3000"

export function GestTorneio({ id,terminado,tipoTorneio, ...props }) {

    const [classificacaoGrupo,setClassificacaoGrupo] = useState([]);
    const [classificacaoElim,setClassificacaoElim] = useState([]);
    const [elimSize,setElimSize] = useState(0);

    const [tipo1,setTipo1] = useState("grupos");
    const [fecharSorteio,setFecharSorteio] = useState(0);

    // variaveis criar elim
    const [inputDuracaoJogo,setInputDuracaoJogo] = useState();
    const [inputIntervaloEtapas,setInputIntervaloEtapas] = useState();
    const [inputDataElim,setInputDataElim] = useState();
    const [groupSize,setGroupSize] = useState();
    const [tipoSorteio,setTipoSorteio] = useState();
    const [inscritos,setInscritos] = useState([]);
    const [apurados,setApurados] = useState([]);

    const searchApurados = async () => {
      const response = await fetch (`${API_URL}/torneios/${id}/apurados`);
      if (response.status === 200) {
          const data = await response.json();
          setApurados(data);
      }
      else {
          setApurados([]);
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
    }

    // Função que vai buscar a classificação dos grupos.
    const searchGrupos = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/classificacao/grupos`);
        if (response.status === 200) {
            const data = await response.json();
            setClassificacaoGrupo(data);
        }
        else {
            setClassificacaoGrupo([]);
        }
      }

    const searchSorteio = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/SorteioElim`);
        if (response.status === 200) {
            const data = await response.json();
            setFecharSorteio(data.gerado);
        }
        else {
            setFecharSorteio(1);
        }
    }

    // Função que vai buscar a classificação das eliminatórias.
    const searchElim = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/classificacao/eliminatorias`);
        if (response.status === 200) {
            const data = await response.json();
            setClassificacaoElim(data);
            setElimSize(data.length)
            searchSorteio()
        }
        else {
            setClassificacaoElim([]);
        }
    }

    const handleFecharSorteio = async (e) => {
        e.preventDefault();
        const headers = {
              "authorization": "Bearer " +localStorage.getItem("token")
        }
        axios.post(`${API_URL}/torneios/${id}/gestao/fecharSorteioElim`, {},{headers: headers})
              .then(response => {
                setFecharSorteio(1);
        }).catch(e => console.log(e))
    }

    const handleGrupo = async (e) => {
        e.preventDefault();
        const headers = {
              "authorization": "Bearer " +localStorage.getItem("token")
        }
        const bodyGrupo = {
              "duracao" : parseInt(inputDuracaoJogo),
              "intervalo" : parseInt(inputIntervaloEtapas),
              "groupSize" : parseInt(groupSize)
        }
        axios.post(`${API_URL}/torneios/${id}/gestao/criarFaseGrupos`, bodyGrupo,{headers: headers})
              .then(response => {
                searchGrupos();
        }).catch(e => console.log(e))
    }

    const handleElim = async (e) => {
        e.preventDefault();
        const headers = {
              "authorization": "Bearer " +localStorage.getItem("token")
        }
        if(tipoTorneio === 1 || tipoTorneio === 4){
            const bodyElim = {
              "duracao" : inputDuracaoJogo,
              "intervalo" : inputIntervaloEtapas
            }
            axios.post(`${API_URL}/torneios/${id}/gestao/criarEliminatorias`, bodyElim,{headers: headers})
                .then(response => {
                  searchElim();
            }).catch(e => console.log(e))
        }
        else {
            const bodyElimG = {
              "duracao" : inputDuracaoJogo,
              "intervalo" : inputIntervaloEtapas,
              "nApurados" : 2,
              "dataT" : inputDataElim
            }
            axios.post(`${API_URL}/torneios/${id}/gestao/criarEliminatoriasFromGrupos`, bodyElimG,{headers: headers})
                .then(response => {
                  searchElim();
            }).catch(e => console.log(e))
        }
    }

    const handleSorteio = async (e) => {
          e.preventDefault();
          const headers = {"authorization": "Bearer " +localStorage.getItem("token")}

          if(tipoTorneio === 1 || tipoTorneio === 4){
              axios.post(`${API_URL}/torneios/${id}/gestao/sortearEliminatorias`,  {"tipoSorteio" : tipoSorteio},{headers: headers})
                  .then(response => {
                    searchElim();
              }).catch(e => console.log(e))
          } else {
              const bodyElimG = {
                "nApuradosGrupo" : 2,
                "tipoSorteio" : tipoSorteio
              };
              axios.post(`${API_URL}/torneios/${id}/gestao/sortearEliminatoriasFromGrupos`, bodyElimG,{headers: headers})
                  .then(response => {
                    searchElim();
              }).catch(e => console.log(e))
          }
    }

    const handleSorteioGrupo = async (e) => {
        e.preventDefault();
        const headers = {"authorization": "Bearer " +localStorage.getItem("token")}
        axios.post(`${API_URL}/torneios/${id}/gestao/sortearFaseGrupos`, {"tipoSorteio" : tipoSorteio},{headers: headers})
              .then(response => {
                searchGrupos();
        }).catch(e => console.log(e))
    }


    // Vai buscar os grupos e as eliminatórias.
    useEffect(() => {
      searchGrupos();
      searchElim();
      searchInscritos();
      searchApurados();
    },[])




    return(
        <div className = "mb-32">
        <div onChange={e=>setTipo1(e.target.value)}>
            <input type="radio" value="eliminatorias" name="tipoamostrar" checked={("eliminatorias"===tipo1) ? "checked" : ""}/> Eliminatorias
            <input type="radio" value="grupos" name="tipoamostrar" checked={("grupos"===tipo1) ? "checked" : ""}/> Grupos
        </div>

        <br/>
        {tipo1==="grupos"
        ?
            (classificacaoGrupo?.length > 0
            ? (
              <div>
                <div className="inscritos">
                  <InscritosDisplay inscritos = {inscritos} titulo = "Inscritos"/>
                </div>
                <div className="grupos">
                  <h1 className = "text-center pt-10 text-2xl font-bold">Fase de Grupos</h1>

                  <br/>
                  <ul>
                  {classificacaoGrupo.map((grupo) => (
                    <li><GrupoDisplay grupo = {grupo}/></li>
                  ))}

                  {terminado === 0 // permitir gerar novo sorteio caso o torneio não tenha começado
                    ?  (
                        <form onSubmit={handleSorteioGrupo}>
                          <label>Tipo Sorteio: </label>
                            <select value={tipoSorteio} id="tipoSorteio" name="TipoSorteio" onChange={e => setTipoSorteio(e.target.value)} required>
                                <option value="">Indique o tipo de sorteio</option>
                                <option value="0">Sorteio sem restrições</option>
                                <option value="1">Sorteio com 1 cabeça de série</option>
                                <option value="2">Sorteio com 2 cabeça de série</option>
                                <option value="3">Sorteio por clubes</option>
                                <option value="4">Sorteio por clubes com 1 cabeça de série</option>
                                <option value="5">Sorteio por clubes com 2 cabeça de série</option>
                            </select>
                            <button>Sortear Grupos</button>
                        </form>
                      )
                    : (null)
                  }

                  </ul>
                </div>
              </div>
            )
            : ((tipoTorneio === 1 || tipoTorneio === 4)
              ? (
                <div className="empty_eliminatorias">
                    <h2>Este torneio não contém fase grupos</h2>
                </div>
                )
              : (
                <div className="empty_grupos">
                    <div className="inscritos">
                      <InscritosDisplay inscritos = {inscritos} titulo = "Inscritos"/>
                    </div>
                    <h2>Criar fase de grupos!</h2>
                    <form className="bg-white border border-gray-200 w-min rounded-xl p-6 mx-auto" onSubmit={handleGrupo}>
                        <div>
                            <label className="text-black font-bold w-auto">Tamanho dos grupo: </label>
                            <select className="w-auto relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none" value={groupSize} id="groupSize" name="GroupSize" onChange={e => setGroupSize(e.target.value)} required>
                                <option value="">Indique o tamanho de cada grupo</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>
                            <br/>

                              <label className="text-black font-bold w-auto">Novo sorteio </label>

                                <select className="w-auto relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none" value={tipoSorteio} id="tipoSorteio" name="TipoSorteio" onChange={e => setTipoSorteio(e.target.value)} required>
                                <option value="">Indique o tipo de sorteio</option>
                                <option value="0">Sorteio sem restrições</option>
                                <option value="1">Sorteio com 1 cabeça de série</option>
                                <option value="2">Sorteio com 2 cabeças de série</option>
                                <option value="3">Sorteio por clubes</option>
                                <option value="4">Sorteio por clubes com 1 cabeça de série</option>
                                <option value="5">Sorteio por clubes com 2 cabeças de série</option>
                            </select>
                            <br/>
                            <label>Duração jogo: </label>
                                <input value={inputDuracaoJogo} id="duracaoJogo" type="number" onChange={(e) => setInputDuracaoJogo(e.target.value)} required></input>
                                <br/>
                            <br/>
                            <label>Intervalo entre jornadas: </label>
                                <input value={inputIntervaloEtapas} id="intervaloEtapa" type="number" onChange={(e) => setInputIntervaloEtapas(e.target.value)} required></input>
                                <br/>
                            <br/>
                        </div>
                        <button>Criar Grupos</button>
                    </form>
                </div>
                )
              )
            )

        :
            (elimSize > 0
            ? (
              <div className="mb-8">
                  <div className="inscritos">
                    <InscritosDisplay inscritos = {apurados} titulo = "Apurados"/>
                  </div>
                  <div className="eliminatorias">
                    <ElimDisplay className="" elim = {classificacaoElim} elimSize = {elimSize} tipo={1}/>
                  </div>

                  {(fecharSorteio === 0 || fecharSorteio === 2)
                  ? ( ((tipoTorneio === 2 || tipoTorneio > 4)
                      ? (
                          <form className="bg-white border border-gray-200 w-min rounded-xl p-6 mx-auto" onSubmit={handleSorteio}>
                            <label className="text-black font-bold w-auto">Novo sorteio </label>

                              <select className="w-auto relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none" value={tipoSorteio} id="tipoSorteio" name="TipoSorteio" onChange={e => setTipoSorteio(e.target.value)} required>
                                  <option value="">Indique o tipo de sorteio</option>
                                  <option value="1">Sorteio sem restrições</option>
                                  <option value="2">Separar 1º e 2º do grupo</option>
                                  <option value="3">Separar 1º e 2º do grupo e mesmo clube</option>
                              </select>
                              <button className="mt-4 bg-orange-500 p-2 text-white rounded-xl">Sortear Eliminatorias</button>
                          </form>
                      )
                      : (
                        <form  className="bg-white border border-gray-200 w-min rounded-xl p-6 mx-auto" onSubmit={handleSorteio}>
                          <label className="text-black font-bold w-auto">Tipo Sorteio</label>
                            <select className="w-auto relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none" value={tipoSorteio} id="tipoSorteio" name="TipoSorteio" onChange={e => setTipoSorteio(e.target.value)} required>
                                <option value="">Indique o tipo de sorteio</option>
                                <option value="1">Sorteio sem restrições</option>
                                <option value="2">Sorteio sem restrições + 2 por ranking</option>
                                <option value="3">Sorteio sem restrições + 4 por ranking</option>
                                <option value="4">Sorteio sem restrições + 8 por ranking</option>
                                <option value="5">Sorteio sem restrições + 16 por ranking</option>
                                <option value="6">separar do mesmo clube</option>
                                <option value="7">2 por ranking + separar do mesmo clube</option>
                                <option value="8">4 por ranking + separar do mesmo clube</option>
                                <option value="9">8 por ranking + separar do mesmo clube</option>
                                <option value="10">16 por ranking + separar do mesmo clube</option>
                            </select>
                            <button cclassName="my-4 bg-orange-500 p-2 text-white rounded-xl">Sortear Eliminatorias</button>
                        </form>
                      )
                    )
                  )
                  :
                    (<> Sorteio Fechado </>)
                  }

                  {fecharSorteio === 2
                    ?
                      (<button className="p-2 bg-white rounded-xl mt-2 text-black border-2 border-black hover:bg-black hover:text-white" onClick={handleFecharSorteio}>Fechar Sorteio</button>)
                    :
                      (<></>)
                  }
              </div>
              )
            : ((tipoTorneio === 3 || tipoTorneio === 0 || (classificacaoGrupo?.length === 0 && (tipoTorneio > 4 || tipoTorneio === 2)))
              ? (
                <div className="empty_eliminatorias">
                    <p>Este torneio não contém fase eliminatória ou criar a fase de grupos primeiro!</p>
                </div>
                )
              : (
                <div className="empty_eliminatorias">
                  <div className="inscritos">
                    <InscritosDisplay inscritos = {inscritos} titulo = "Inscritos"/>
                  </div>
                    <h2>Criar fase eliminatória!</h2>
                    <form onSubmit={handleElim}>
                        <div>
                            <label>Data: </label>
                            <input value={inputDataElim} id="datetime-local" type="datetime-local" onChange={(e) => setInputDataElim(e.target.value)} required></input>
                            <br/>
                            <label>Duração jogo: </label>
                                <input value={inputDuracaoJogo} id="duracaoJogo" type="number" onChange={(e) => setInputDuracaoJogo(e.target.value)} required></input>
                                <br/>
                            <br/>
                            <label>Intervalo entre etapas: </label>
                                <input value={inputIntervaloEtapas} id="intervaloEtapa" type="number" onChange={(e) => setInputIntervaloEtapas(e.target.value)} required></input>
                                <br/>
                            <br/>
                        </div>
                        <button>Criar Eliminatorias</button>
                    </form>
                </div>
                )
              )
            )
        }
        </div>
    )
}
