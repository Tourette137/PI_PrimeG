import {useRef,useState,useEffect} from 'react';
import {useParams} from 'react-router-dom'
import GrupoDisplay from "./GrupoDisplay.jsx";
import ElimDisplay from "./ElimDisplay.jsx";
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import axios from 'axios';
import { DateTimeInput } from 'react-admin';

const API_URL="http://localhost:3000"

export function Gestao() {
    const {id} = useParams()
    const [classificacaoGrupo,setClassificacaoGrupo] = useState([]);
    const [classificacaoElim,setClassificacaoElim] = useState([]);
    const [torneio,setTorneio] = useState("");

    // variaveis criar elim
    const inputDuracaoJogoRef = useRef(null);
    const inputIntervaloEtapasRef = useRef(null);
    const inputDataElimRef = useRef(null);
    const [groupSize,setGroupSize] = useState();
    const [tipoSorteio,setTipoSorteio] = useState();

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

      const searchTorneio = async () => {
          const response = await fetch (`${API_URL}/torneios/${id}`);
          if (response.status === 200) {
              const data = await response.json();
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
        }
        else {
            setClassificacaoElim([]);
        }
      }

      const handleGrupo = async (e) => {
          e.preventDefault();
          const headers = {
              "authorization": "Bearer " +localStorage.getItem("token")
          }
          console.log(inputDuracaoJogoRef);
          console.log(inputIntervaloEtapasRef);

          const bodyGrupo = {
              "duracao" : parseInt(inputDuracaoJogoRef.current.value),
              "intervalo" : parseInt(inputIntervaloEtapasRef.current.value),
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
              "duracao" : parseInt(inputDuracaoJogoRef.current.value),
              "intervalo" : parseInt(inputIntervaloEtapasRef.current.value)
            }
            axios.post(`${API_URL}/torneios/${id}/gestao/criarEliminatorias`, bodyElim,{headers: headers})
                .then(response => {
                  searchElim();
            }).catch(e => console.log(e))
          }
          else {
            const bodyElimG = {
              "duracao" : 20,
              "intervalo" : 10,
              "nApurados" : 2,
              "dataT" : inputDataElimRef.current.value
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

    // Vai buscar os grupos e as eliminatórias.
    useEffect(() => {
        searchGrupos();
        searchElim();
        searchTorneio();
      },[])



    return(
        <>
        <NavbarDynamic/>

        <h1>Gestao:</h1>

        <br/>

        {classificacaoGrupo?.length > 0
        ? (
        <div className="grupos">
          <h1> Fase de Grupos: </h1>
          <br/>
          <ul>
          {classificacaoGrupo.map((grupo) => (
            <li><GrupoDisplay grupo = {grupo}/></li>
          ))}
          </ul>
        </div>
        )
        : (
        <div className="empty_grupos">
            <h2>Este torneio não contém fase de grupos!</h2>
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
                    <label>Duração jogo: </label>
                    <input ref={inputDuracaoJogoRef} id="duracaoJogo" type="duracaoJogo" placeholder="Duração jogo" required></input>
                    <br/>
                    <label>Intervalo entre jornadas: </label>
                    <input ref={inputIntervaloEtapasRef} id="intervaloEtapa" type="intervaloEtapa" placeholder="Intervalo entre etapas" required></input>
                </div>
                <button>Criar Grupos</button>
            </form>
        </div>
        )}

        <br/>

        {classificacaoElim?.length > 0
        ? (
        <div className="eliminatorias">
          <h1> Fase Eliminatória: </h1>
          <ul>
          {classificacaoElim.map((classificacaoElim) => (
            <li><ElimDisplay elim = {classificacaoElim}/></li>
          ))}
          </ul>
        </div>
        )
        : (
        <div className="empty_eliminatorias">
            <h2>Este torneio não contém fase eliminatória!</h2>
            <form onSubmit={handleElim}>
                <div>
                    <label>Data: </label>
                    <input ref={inputDataElimRef} id="datetime-local" type="datetime-local" placeholder="Data do Torneio" required></input>
                    <br/>
                    <label>Duração jogo: </label>
                    <input ref={inputDuracaoJogoRef} id="duracaoJogo" type="duracaoJogo" placeholder="Duração jogo" required></input>
                    <br/>
                    <label>Intervalo entre etapas: </label>
                    <input ref={inputIntervaloEtapasRef} id="intervaloEtapa" type="intervaloEtapa" placeholder="Intervalo entre etapas" required></input>
                </div>
                <button>Criar Eliminatorias</button>
            </form>
            <form onSubmit={handleSorteio}>
              <label>Tipo Sorteio: </label>
                <select value={tipoSorteio} id="tipoSorteio" name="TipoSorteio" onChange={e => setTipoSorteio(e.target.value)} required>
                    <option value="">Indique o tipo de sorteio</option>
                    <option value="-1">-1</option>
                </select>
                <button>Sortear Eliminatorias</button>
            </form>
        </div>
        )}
        </>
    )
}
