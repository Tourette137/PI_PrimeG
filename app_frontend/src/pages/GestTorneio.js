import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import GrupoDisplay from "../components/GrupoDisplay.js";
import ElimDisplay from "./ElimDisplay.jsx";
import axios from 'axios';
import InscritosDisplay from "../components/ListaInscritos.js";
import '../components/RadioForm.css';

const API_URL="http://localhost:3000"

export function GestTorneio({ id,terminado,tipoTorneio, ...props }) {

    const [classificacaoGrupo,setClassificacaoGrupo] = useState([]);
    const [classificacaoElim,setClassificacaoElim] = useState([]);
    const [elimSize,setElimSize] = useState(0);

    const [tipo1,setTipo1] = useState("");
    const [fecharSorteio,setFecharSorteio] = useState(0);

    // variaveis criar elim
    const [inputDuracaoJogo,setInputDuracaoJogo] = useState();
    const [inputIntervaloEtapas,setInputIntervaloEtapas] = useState();
    const [inputDataElim,setInputDataElim] = useState();
    const [groupSize,setGroupSize] = useState();
    const [tipoSorteio,setTipoSorteio] = useState();
    const [inscritos,setInscritos] = useState([]);
    const [apurados,setApurados] = useState([]);

    const [loading1,setLoading1] = useState(false);
    const [loading2,setLoading2] = useState(false);
    const [loading3,setLoading3] = useState(false);
    const [loading4,setLoading4] = useState(false);

    const [alert, setAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")

    const searchApurados = async () => {
      const response = await fetch (`${API_URL}/torneios/${id}/apurados`);
      if (response.status === 200) {
          const data = await response.json();
          setApurados(data);
      }
      else {
          setApurados([]);
      }
      setLoading1(false);
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
      setLoading2(false);
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
        setLoading3(false);
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
            console.log();
            setClassificacaoElim(data);
            setElimSize(data.length)
            searchSorteio()
        }
        else {
            setClassificacaoElim([]);
        }
        setLoading4(false);
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
        if (inscritos.length >= parseInt(groupSize)){
        axios.post(`${API_URL}/torneios/${id}/gestao/criarFaseGrupos`, bodyGrupo,{headers: headers})
              .then(response => {
                if(response.status==200){
                  console.log("aqui")
                  searchGrupos();
                  setAlert(false);
                }
              }).catch(e => {console.log(e);
                            setAlert(true);
                            console.log(alert);
                            setAlertMsg("O Torneio ainda tem inscrições abertas!");
              })
            }
        else{
          setAlert(true);
          setAlertMsg("O número de inscritos é menor que o tamanho de um grupo!")
          }
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
                  if(response.status==200){
                    searchElim();
                    setAlert(false);
                  }
            }).catch(e => {console.log(e);
              setAlert(true);
              setAlertMsg("O Torneio ainda tem inscrições abertas!");
            })
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
                  if(response.status==200){
                    searchElim();
                    setAlert(false);
                  }
            }).catch(e => {console.log(e);
              setAlert(true);
              setAlertMsg("A fase de grupos ainda não terminou!");
            })
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
    

    const handleTipoTorneio = async (e) => {
      if(tipoTorneio == 1 || tipoTorneio == 4) {
        setTipo1("eliminatorias");
      }
      else {
        setTipo1("grupos");
      }
    } 

    // Vai buscar os grupos e as eliminatórias.
    useEffect(() => {
      window.scrollTo(0, 0);
      setLoading1(true);
      setLoading2(true);
      setLoading3(true);
      setLoading4(true);
      searchGrupos();
      searchElim();
      searchInscritos();
      searchApurados();
      handleTipoTorneio();
    },[])



    return(
      <div className = "mb-32">

        <div className="viagem-form w3-mobile radio-list" onChange={e=>setTipo1(e.target.value)}>
              <form>
                {(tipoTorneio != 0 && tipoTorneio != 3 && tipoTorneio != 1 && tipoTorneio != 4) 
                ?   <div className="w3-row-padding w3-mobile">
                      <div className = "w3-half w3-center w3-mobile radio-item">
                        <input type="radio" id="grupos" value="grupos" name="tipoamostrar" checked={("grupos"===tipo1) ? "checked" : ""}/>
                        <label for="grupos" style={{justifyContent:"center"}}>Grupos</label><br/>
                      </div>
                      <div className = "w3-half w3-center w3-mobile radio-item ">
                        <input type="radio" id="eliminatorias" value="eliminatorias" name="tipoamostrar" checked={("eliminatorias"===tipo1) ? "checked" : ""}/>
                        <label for="eliminatorias" style={{justifyContent:"center"}}>Eliminatórias</label><br/>
                      </div>
                    </div>
                : ""
                }
              </form>
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
                        <form className="bg-white border border-gray-200 w-2/3 rounded-xl p-10 mx-auto" onSubmit={handleSorteioGrupo}>
                          <label className="text-gray-700 font-bold w-full">Novo Sorteio </label>
                            <select className="w-full relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none" value={tipoSorteio} id="tipoSorteio" name="TipoSorteio" onChange={e => setTipoSorteio(e.target.value)} required>
                                <option value="">Indique o tipo de sorteio</option>
                                <option value="0">Sorteio sem restrições</option>
                                <option value="1">Sorteio com 1 cabeça de série</option>
                                <option value="2">Sorteio com 2 cabeça de série</option>
                                <option value="3">Sorteio por clubes</option>
                                <option value="4">Sorteio por clubes com 1 cabeça de série</option>
                                <option value="5">Sorteio por clubes com 2 cabeça de série</option>
                            </select>
                            <button className="mt-4 bg-orange-500 p-2 text-white rounded-xl hover:bg-orange-700">Sortear Grupos</button>
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
                          <span class="text-sm leading-5 text-red-900 font-medium ml-3">Este torneio não contém fase grupos</span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                )
              : (
                <div className="empty_grupos">
                    <div className="inscritos">
                      <InscritosDisplay inscritos = {inscritos} titulo = "Inscritos"/>
                    </div>
                    <form className="bg-white border border-gray-200 w-2/3 rounded-xl p-10 mx-auto" onSubmit={handleGrupo}>
                        <div className="text-black text-xl font-bold w-full mb-4">
                            <label className="w-full">Criar fase de grupos </label>
                        </div>
                            <label className="text-gray-700 font-bold w-full mt-2">Tamanho dos grupos </label>
                            <select className="w-full relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none" value={groupSize} id="groupSize" name="GroupSize" onChange={e => setGroupSize(e.target.value)} required>
                                <option value="">Indique o tamanho de cada grupo</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>
                            <br/>
                          <br/>
                          <label className="text-gray-700 font-bold w-full">Tipo sorteio </label>

                                <select className="w-full relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none" value={tipoSorteio} id="tipoSorteio" name="TipoSorteio" onChange={e => setTipoSorteio(e.target.value)} required>
                                <option value="">Indique o tipo de sorteio</option>
                                <option value="0">Sorteio sem restrições</option>
                                <option value="1">Sorteio com 1 cabeça de série</option>
                                <option value="2">Sorteio com 2 cabeças de série</option>
                                <option value="3">Sorteio por clubes</option>
                                <option value="4">Sorteio por clubes com 1 cabeça de série</option>
                                <option value="5">Sorteio por clubes com 2 cabeças de série</option>
                                </select>
                                <br/>
                            <br/>
                            <label className="text-gray-700 font-bold w-full">Duração jogo (min) </label>
                                <input className="w-full relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none border border-black"  value={inputDuracaoJogo} id="duracaoJogo" type="number" onChange={(e) => setInputDuracaoJogo(e.target.value)} required></input>
                                <br/>
                            <br/>
                            <label className="text-gray-700 font-bold w-full">Intervalo entre jornadas (min) </label>
                                <input className="w-full relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none border border-black" value={inputIntervaloEtapas} id="intervaloEtapa" type="number" onChange={(e) => setInputIntervaloEtapas(e.target.value)} required></input>
                                <br/>
                            <br/>
                            {(alert)
                              ? (<div class="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-200" role="alert">
                                    <span class="font-medium">{alertMsg}</span>
                                </div>)
                              : null
                            }
                        <button className="mt-4 bg-orange-500 p-2 text-white rounded-xl hover:bg-orange-700">Criar Grupos</button>
                    </form>
                </div>
                )
              )
            )

        :
            (elimSize > 0
            ? (
              <div className="mb-8">
                  {(tipoTorneio === 2 || tipoTorneio > 4)
                    ? (<InscritosDisplay inscritos = {apurados} titulo = "Apurados"/>)
                    : (<InscritosDisplay inscritos = {inscritos} titulo = "Inscritos"/>)
                  }
                  <div className="eliminatorias">
                    <ElimDisplay className="" elim = {classificacaoElim} elimSize = {elimSize} tipo={1}/>
                  </div>

                  {(fecharSorteio === 0 || fecharSorteio === 2)
                  ? ( ((tipoTorneio === 2 || tipoTorneio > 4)
                      ? (
                          <form className="bg-white border border-gray-200 w-2/3 rounded-xl p-10 mx-auto" onSubmit={handleSorteio}>
                            <label className="text-gray-700 font-bold w-full">Novo sorteio </label>

                              <select className="w-full relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none" value={tipoSorteio} id="tipoSorteio" name="TipoSorteio" onChange={e => setTipoSorteio(e.target.value)} required>
                                  <option value="">Indique o tipo de sorteio</option>
                                  <option value="1">Sorteio sem restrições</option>
                                  <option value="2">Separar 1º e 2º do grupo</option>
                                  <option value="3">Separar 1º e 2º do grupo e mesmo clube</option>
                              </select>
                              <button className="mt-4 bg-orange-500 p-2 text-white rounded-xl hover:bg-orange-700">Sortear Eliminatorias</button>
                          </form>
                      )
                      : (
                        <form  className="bg-white border border-gray-200 w-2/3 rounded-xl p-10 mx-auto" onSubmit={handleSorteio}>
                          <label className="text-gray-700 font-bold w-full">Tipo Sorteio</label>
                            <select className="w-full relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none" value={tipoSorteio} id="tipoSorteio" name="TipoSorteio" onChange={e => setTipoSorteio(e.target.value)} required>
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
                            <button className="my-4 bg-orange-500 p-2 text-white rounded-xl hover:bg-orange-700">Sortear Eliminatorias</button>
                        </form>
                      )
                    )
                  )
                  :
                    (<div className="p-2 bg-red-500 rounded-xl text-red-100 w-1/2 mx-auto"> Sorteio Fechado </div>)
                  }

                  {fecharSorteio === 2
                    ?
                      (<button className="p-2 bg-gray-200 rounded-xl mt-2 text-black hover:bg-black hover:text-white" onClick={handleFecharSorteio}>Fechar Sorteio</button>)
                    :
                      (<></>)
                  }
              </div>
              )
            : ((tipoTorneio === 3 || tipoTorneio === 0 || (classificacaoGrupo?.length === 0 && (tipoTorneio > 4 || tipoTorneio === 2)))
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
                          <span class="text-sm leading-5 text-red-900 font-medium ml-3">Este torneio não contém fase eliminatória ou criar fase de grupos primeiro!</span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                )
              : (
                <div className="empty_eliminatorias">
                  {inscritos.length > 0
                  ? <div className="inscritos">
                      <InscritosDisplay inscritos = {inscritos} titulo = "Inscritos"/>
                    </div>
                  : null
                  }
                  
                    <form className="bg-white border border-gray-200 w-2/3 rounded-xl p-10 mx-auto" onSubmit={handleElim}>
                      <div className="text-black text-xl font-bold w-full mb-4">
                          <label className="w-full">Criar eliminatorias </label>
                      </div>
                            <label className="text-gray-700 font-bold w-full mt-2">Data </label>
                            <input className="w-full relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none border border-black"  value={inputDataElim} id="datetime-local" type="datetime-local" onChange={(e) => setInputDataElim(e.target.value)} required></input>
                            <br/>
                            <br/>
                            <label className="text-gray-700 font-bold w-full mt-2">Duração jogo (min) </label>
                                <input className="w-full relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none border border-black"  value={inputDuracaoJogo} id="duracaoJogo" type="number" onChange={(e) => setInputDuracaoJogo(e.target.value)} required></input>
                                <br/>
                            <br/>
                            <label className="text-gray-700 font-bold w-full mt-2">Intervalo entre etapas (min) </label>
                                <input className="w-full relative py-2 pl-2 pr-6 cursor-pointer bg-transparent text-xs text-gray-500 font-semibold appearance-none outline-none border border-black"  value={inputIntervaloEtapas} id="intervaloEtapa" type="number" onChange={(e) => setInputIntervaloEtapas(e.target.value)} required></input>
                                <br/>
                            <br/>
                            {(alert)
                              ? (<div class="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-200" role="alert">
                                    <span class="font-medium">{alertMsg}</span>
                                </div>)
                              : null
                            }
                        <button className="my-4 bg-orange-500 p-2 text-white rounded-xl hover:bg-orange-700">Criar Eliminatorias</button>
                    </form>
                </div>
                )
              )
            )
        }
        </div>
    )
}
