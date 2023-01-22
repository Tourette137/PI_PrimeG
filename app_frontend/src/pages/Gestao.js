import {useState,useEffect} from 'react';
import {useParams,useNavigate} from 'react-router-dom'
import GrupoDisplay from "./GrupoDisplay.jsx";
import ElimDisplay from "./ElimDisplay.jsx";
import CalendarioDisplay from "./CalendarioDisplay.jsx";
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import axios from 'axios';

const API_URL="http://localhost:3000"

export function Gestao() {
    const {id} = useParams()
    const [classificacaoGrupo,setClassificacaoGrupo] = useState([]);
    const [classificacaoElim,setClassificacaoElim] = useState([]);
    const [calendarioGrupos,setCalendarioGrupos] = useState([]);
    const [calendarioElim,setCalendarioElim] = useState([]);
    const [torneio,setTorneio] = useState("");
    const navigate = useNavigate();
    const [tipo,setTipo] = useState("grupos");
    const [fecharSorteio,setFecharSorteio] = useState(0);


    // variaveis criar elim
    const [inputDuracaoJogo,setInputDuracaoJogo] = useState();
    const [inputIntervaloEtapas,setInputIntervaloEtapas] = useState();
    const [inputDataElim,setInputDataElim] = useState();
    const [groupSize,setGroupSize] = useState();
    const [tipoSorteio,setTipoSorteio] = useState();

    // Função que vai buscar a classificação dos grupos.
    const searchGrupos = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/classificacao/grupos`);
        if (response.status === 200) {
            const data = await response.json();
            setClassificacaoGrupo(data);
            searchCalendarioGrupos();
        }
        else {
            setClassificacaoGrupo([]);
        }
      }

      const searchCalendarioGrupos = async () => {
          const response = await fetch (`${API_URL}/torneios/${id}/calendario/grupos`);
          if (response.status === 200) {
              const data = await response.json();
              setCalendarioGrupos(data);
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
          }
          else {
              setCalendarioElim([]);
          }
      }

      const searchSorteio = async () => {
          const response = await fetch (`${API_URL}/torneios/${id}/SorteioElim`);
          if (response.status === 200) {
              const data = await response.json();
              console.log(data);
              setFecharSorteio(data.gerado);
          }
          else {
              setFecharSorteio(1);
          }
      }

      const searchTorneio = async () => {
        let requestOptions = {}
        let aux = localStorage.getItem("token");
        let response = null

        if(aux !== "null"){
          requestOptions = {
            headers: {'Authorization': "Bearer " + localStorage.getItem("token")}
          }
          response = await fetch (`${API_URL}/torneios/${id}`,requestOptions);
        }
        else {
          response = await fetch (`${API_URL}/torneios/${id}`);
        }
        if (response.status === 200) {
            const data = await response.json();
            if(!data.isOrganizador) {
              navigate(`/torneios/${id}`)
            }
            setTorneio(data);
        }
        else {
            setTorneio([]);
        }
      }

    // Função que vai buscar a classificação das eliminatórias.
    const searchElim = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/classificacao/eliminatorias`);
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            setClassificacaoElim(data);
            searchCalendarioElim()
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
          if(torneio.tipoTorneio === 1 || torneio.tipoTorneio === 4){
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
            console.log(inputDataElim);
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
          const headers = {
              "authorization": "Bearer " +localStorage.getItem("token")
          }

          if(torneio.tipoTorneio === 1 || torneio.tipoTorneio === 4){
              const bodyElim = {
                "tipoSorteio" : tipoSorteio
              };
              axios.post(`${API_URL}/torneios/${id}/gestao/sortearEliminatorias`, bodyElim,{headers: headers})
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

      const handleTipo = async(event) => {
          setTipo(event.target.value);
      };

    // Vai buscar os grupos e as eliminatórias.
    useEffect(() => {
      searchTorneio();
      searchGrupos();
      searchElim();
    },[])


    return(
        <>
        <NavbarDynamic/>
        <h1>Gestao:</h1>
        <div onChange={handleTipo}>
            <input type="radio" value="eliminatorias" name="torneios" checked={("eliminatorias"===tipo) ? "checked" : ""}/> Eliminatorias
            <input type="radio" value="grupos" name="torneios" checked={("grupos"===tipo) ? "checked" : ""}/> Grupos
        </div>

        <br/>
        {tipo==="grupos"
        ?
            (classificacaoGrupo?.length > 0
            ? (
              <div>
                <div className="grupos">
                  <h1> Fase de Grupos: </h1>
                  <br/>
                  <ul>
                  {classificacaoGrupo.map((grupo) => (
                    <li><GrupoDisplay grupo = {grupo}/></li>
                  ))}
                  </ul>
                </div>
                <div className="calendarioGrupos">
                  <h1> Calendário: </h1>
                  <br/>
                  <ul>
                  {calendarioGrupos.map((calendario) => (
                    <li><CalendarioDisplay calendario = {calendario}/></li>
                  ))}
                  </ul>
                </div>
              </div>
            )
            : ((torneio.tipoTorneio === 1 || torneio.tipoTorneio === 4)
              ? (
                <div className="empty_eliminatorias">
                    <h2>Este torneio não contém fase grupos</h2>
                </div>
                )
              : (
                <div className="empty_grupos">
                    <h2>Criar fase de grupos!</h2>
                    <form onSubmit={handleGrupo}>
                        <div>
                            <label>Tamanho dos grupo: </label>
                            <select value={groupSize} id="groupSize" name="GroupSize" onChange={e => setGroupSize(e.target.value)} required>
                                <option value="">Indique o tamanho de cada grupo</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>
                            <br/>
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
            (classificacaoElim?.length > 0
            ? (
              <div>
                  <div className="eliminatorias">
                    <h1> Fase Eliminatória: </h1>
                    <ul>
                    {classificacaoElim.map((classificacaoElim) => (
                      <li><ElimDisplay elim = {classificacaoElim}/></li>
                    ))}
                    </ul>
                  </div>

                  {(fecharSorteio === 0 || fecharSorteio === 2)
                  ? (
                      <form onSubmit={handleSorteio}>
                        <label>Tipo Sorteio: </label>
                          <select value={tipoSorteio} id="tipoSorteio" name="TipoSorteio" onChange={e => setTipoSorteio(e.target.value)} required>
                              <option value="">Indique o tipo de sorteio</option>
                              <option value="-1">Sorteio sem restrições</option>
                          </select>
                          <button>Sortear Eliminatorias</button>
                      </form>
                    )
                  :
                    (<> Sorteio Fechado </>)
                  }

                  {fecharSorteio === 2
                    ?
                      (<button onClick={handleFecharSorteio}>Fechar Sorteio</button>)
                    :
                      (<></>)
                  }


                  <div className="calendarioElim">
                    <h1> Calendario: </h1>
                    <ul>
                    {calendarioElim.map((calendario) => (
                      <li><CalendarioDisplay calendario = {calendario}/></li>
                    ))}
                    </ul>
                  </div>
              </div>
              )
            : ((torneio.tipoTorneio === 3 || torneio.tipoTorneio === 0 || (classificacaoGrupo?.length === 0 && (torneio.tipoTorneio > 4 || torneio.tipoTorneio === 2)))
              ? (
                <div className="empty_eliminatorias">
                    <p>Este torneio não contém fase eliminatória ou criar a fase de grupos primeiro!</p>
                </div>
                )
              : (
                <div className="empty_eliminatorias">
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
        </>
    )
}
