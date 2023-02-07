//Componente de um único Torneio

import {useParams} from 'react-router-dom'
import {useState,useEffect, useRef} from 'react';
//import TorneioDisplay from '../components/TorneioCard.js';
import TorneioDisplay from './TorneioDisplay.jsx';
import InscritosDisplay from "../components/ListaInscritos.js";
import '../components/titulo.css';
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import axios from 'axios';
import EspacoCard from '../components/EspacoCard.js';
import profileIcon from '../images/espaco.png'

const API_URL="http://localhost:3000"

export function Torneio() {
    const {id} = useParams()
    const [torneio,setTorneio] = useState("");
    const [gestao,setGestao] = useState(0);
    const [tipoTorneio,setTipoTorneio] = useState();
    const [inscritos,setInscritos] = useState([]);
    const [apurados,setApurados] = useState([]);
    const [calendarioGrupos,setCalendarioGrupos] = useState([]);
    const [calendarioElim,setCalendarioElim] = useState([]);
    const [loading1,setLoading1] = useState(false);
    const [loading2,setLoading2] = useState(false);
    const [loading3,setLoading3] = useState(false);
    const [loading4,setLoading4] = useState(false);
    const [loading5,setLoading5] = useState(false);
    const [jogos,setJogos] = useState([]);
    const [espaco,setEspaco] = useState();

    const [estaInscrito,setEstaInscrito] = useState(false);
    const [emailUser, setEmailUser] = useState("");
    const [emailOrganizador, setEmailOrganizador] = useState("");
    const [emailInscritos, setEmailInscritos] = useState([]);
    const [inputEmails, setInputEmails] = useState([{email : ''}])
    const [popUpInscricao,setPopUpInscricao] = useState(false);
    const [isFavorito,setIsFavorito] = useState(false);
    const [popUpAddFavorito,setPopUpAddFavorito] = useState(false);
    const [popUpRemoveFavorito,setPopUpRemoveFavorito] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const newNomeEquipa = useRef(null);
    const newRankingEquipa = useRef(null);
    const newClubeEquipa = useRef(null);

    const searchInscritos = async () => {
      const response = await fetch (`${API_URL}/torneios/${id}/inscritos`);
      if (response.status === 200) {
          const data = await response.json();
          setInscritos(data);
          console.log(data)
      }
      else {
          setInscritos([]);
      }
      setLoading2(false);
    }

    const verificaEstaInscrito = async () => {
      const requestOptions = {
        headers: {'Authorization': "Bearer " + localStorage.getItem("token")}
      }

      const response = await fetch (`${API_URL}/torneios/${id}/estaInscrito`, requestOptions);

      if (response.status === 200) {
          const data = await response.json();
          setEstaInscrito(data);
      }
      else {
        setEstaInscrito(false);
      }

      const responseMail = await fetch (`${API_URL}/users/email`, requestOptions);

      if (responseMail.status === 200) {
          const dataMail = await responseMail.json();
          setEmailUser(dataMail[0].email);
      }
    }

    const getEmailsInfo = async () => {
      const response = await fetch (`${API_URL}/torneios/${id}/emailsInscritos`);

      if (response.status === 200) {
          const data = await response.json();
          setEmailOrganizador(data.emailOrganizador[0].email)
          setEmailInscritos(data.emailsInscritos.map(({email})=> email))
      }
      else {
        setEstaInscrito(false);
      }
    }

    const handleTogglePopupInscricao = async (e) => {
      setAlert(false)
      setAlertMsg("")
      newNomeEquipa.current.value = null
      newClubeEquipa.current.value = null
      newRankingEquipa.current.value = null

      setPopUpInscricao(!popUpInscricao)
    }

    const handleEfetuaInscricao = async (e) => {
      e.preventDefault()

      const newInputEmails = [...inputEmails]
      newInputEmails[0].email = emailUser
      setInputEmails(newInputEmails)

      const novoNomeEquipa = inscritos.find(inscrito => {
          return inscrito.nomeEquipa === newNomeEquipa.current.value
      })

      if(!(novoNomeEquipa === undefined)) {
        setAlert(true)
        setAlertMsg("Nome de Equipa já existente")
        return;
      } else {
        setAlert(false)
        setAlertMsg("")
      }

      if(newRankingEquipa.current.value <= 0) {
        setAlert(true)
        setAlertMsg("Ranking de equipa tem de ser positivo")
        return;
      } else {
        setAlert(false)
        setAlertMsg("")
      }

      const hasOrganizador = inputEmails.find(input => {
        return input.email === emailOrganizador
      }) !== undefined

      if(hasOrganizador) {
        setAlert(true)
        setAlertMsg("Um elemento de equipa é o organizador")
        return;
      } else {
        setAlert(false)
        setAlertMsg("")
      }

      if (inputEmails.filter((item, index) => index === inputEmails.findIndex(i => i.email === item.email)).length !== torneio.tamEquipa) {
        setAlert(true)
        setAlertMsg("Elementos da equipa devem ser todos diferentes")
        return;
      } else {
        setAlert(false)
        setAlertMsg("")
      }

      if (emailInscritos.filter(item => (inputEmails.map(({email})=> email)).includes(item)).length > 0) {
        setAlert(true)
        setAlertMsg("Pelo menos 1 elemento já se encontra inscrito neste torneio noutra equipa")
        return;
      } else {
        setAlert(false)
        setAlertMsg("")
      }

      const headers = { "authorization": "Bearer " + localStorage.getItem("token") }

      const body = { "emails": inputEmails.map(({email})=> email) ,
                    "tamEquipa" : torneio.tamEquipa,
                    "escalao" :torneio.escalao,
                    "dataTorneio" :torneio.dataTorneio,
                    "nomeEquipa" :newNomeEquipa.current.value,
                    "ranking" :newRankingEquipa.current.value,
                    "clube" :newClubeEquipa.current.value,
                    "genero":torneio.genero}

      axios.post(`${API_URL}/torneios/${id}/inscricaoTorneio`, body, {headers: headers})
            .then(response => {
              console.log(response)
              setEstaInscrito(true)
            })
            .catch(e => {
              if(e.response.status === 501) {
                setAlert(true)
                setAlertMsg(e.response.data)
              } else {
                console.log(e)
              }
            })
    }


    const handleChangeElemento = (e, index) => {
      const newInputEmails = [...inputEmails]
      newInputEmails[index].email = e.target.value
      setInputEmails(newInputEmails)
    };


    const searchApurados = async () => {

      const response = await fetch (`${API_URL}/torneios/${id}/apurados`);
      if (response.status === 200) {
          const data = await response.json();
          setApurados(data);
      }
      else {
          setApurados([]);
      }
      setLoading5(false);
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
        setLoading4(false);
    }

    const searchCalendarioElim = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/calendario/eliminatorias`);
        if (response.status === 200) {
            const data = await response.json();
            setCalendarioElim(data);
            setLoading3(false);
        }
        else {
            setCalendarioElim([]);
            setLoading3(false);
        }
    }

    // Vai à API buscar a informação do torneio para dar display na página principal
    const searchTorneio = async () => {
        let requestOptions = {}
        let aux = localStorage.getItem("token");
        let response = null


        if(aux != "null") {
            requestOptions = {
                headers: {'Authorization': "Bearer " + localStorage.getItem("token")}
            }
            response = await fetch (`${API_URL}/torneios/${id}`,requestOptions);
        }
        else {
            response = await fetch (`${API_URL}/torneios/${id}`);
        }

        const data = await response.json();
        if (response.status === 200) {
            if(data.isOrganizador) {
                setGestao(1);
            }
            setTorneio(data);
            console.log(data);
            setTipoTorneio(data.tipoTorneio);
            setInputEmails(Array.from({ length: data.tamEquipa }, () => ({ email: '' })))

            let tipo = "/jogosPorComecar";
            if(data.terminado == 1)
              tipo = "/jogosaDecorrer";
            else if (data.terminado == 2)
              tipo = "/jogosEncerrados";

            let pedido = API_URL + "/torneios/" + id + tipo;

            response = await fetch (pedido);
            if (response.status === 200) {
                const data2 = await response.json();
                setJogos(data2);
            }
            else {
              setJogos([]);
            }

            response = await fetch (`${API_URL}/espacos/${data.idEspaco}`);
            if (response.status === 200) {
                const data = await response.json();
                setEspaco(data[0]);
            }
            else {
                setEspaco([]);
            }
        }
        else {
            setTorneio([]);
        }
        setLoading1(false);

    }

    const verificaTorneioFavorito = async () => {

      const headers = { "authorization": "Bearer " + localStorage.getItem("token") }

      axios.get(`${API_URL}/torneios/${id}/possuiTorneioFavorito`, {headers: headers})
            .then(response => {
              setIsFavorito(response.data)
            })
            .catch(e => {
                console.log(e)
            })
    }

    const handleAddFavorito = async (e) => {

      e.preventDefault()

      const headers = { "authorization": "Bearer " + localStorage.getItem("token") }

      axios.post(`${API_URL}/users/addFavorito?torneio=${id}`, null, {headers: headers})
              .then(response => {
                setIsFavorito(true)
                setPopUpAddFavorito(!popUpAddFavorito)
              })
              .catch(e => console.log(e))
  }

  const handleTogglePopupAddFavorito = async (e) => {
      setPopUpAddFavorito(!popUpAddFavorito)
  }

  const handleRemoveFavorito = async (e) => {
      e.preventDefault()

      const headers = { "authorization": "Bearer " + localStorage.getItem("token") }

      axios.delete(`${API_URL}/users/removeFavorito?torneio=${id}`, {headers: headers})
              .then(response => {
                setIsFavorito(false)
                setPopUpRemoveFavorito(!popUpRemoveFavorito)
              })
              .catch(e => console.log(e))

  }

  const handleTogglePopupRemoveFavorito = async (e, localidade) => {
      setPopUpRemoveFavorito(!popUpRemoveFavorito)
  }


    //Search inicial do torneio
    useEffect(() => {
      window.scrollTo(0, 0);
      setLoading1(true);
      setLoading2(true);
      setLoading3(true);
      setLoading4(true);
      setLoading5(true);
      searchTorneio();
      searchInscritos();
      searchApurados();
      searchCalendarioGrupos();
      searchCalendarioElim();
      verificaEstaInscrito();
      getEmailsInfo();
      verificaTorneioFavorito();
    },[])

    if(loading1 || loading2  || loading3  || loading4 || loading5)
      return (<div>LOADING!!!</div>)

    return(
        <>
        <NavbarDynamic/>
            <div className='titulo pt-8 pb-3'>
              <h1>{torneio.nomeTorneio}</h1>
            </div>

        {torneio !== ""
        ? (<div className = "Torneio">
            {calendarioGrupos?.length > 0
            ? (
              <TorneioDisplay torneio = {torneio} inscritos = {inscritos} calendario={calendarioGrupos.slice(0,5)} tipo = "1" jogos = {jogos}/>
              )
            : (<TorneioDisplay torneio = {torneio} inscritos = {inscritos} calendario={calendarioElim.slice(0,5)} tipo = "2" jogos = {jogos} espaco = {espaco}/>
            )
            }

            <section class="py-3">
              <div class="container px-4 mx-auto">


              <div class="flex flex-wrap -mx-3">

              <div class="w-full lg:w-1/2 px-3 mb-6">
                <div class="h-full px-6 pt-6 pb-8 bg-white rounded-xl">

                  <div class="w-full mt-6 pb-4 overflow-x-auto">
                  <section class="py-2">
                    <div class="container px-4 mx-auto">
                      <div class="max-w-4xl mx-auto text-center">
                        <div className="mx-auto w-[320px] h-[250px] bg-transparent">
                        {(espaco.imageUrl == null || espaco.imageUrl == undefined) ?
                              (<img className="w-[320px] h-[250px] object-contain" src={profileIcon} alt="Espaco Picture"></img>)
                          :   (<img className="w-[320px] h-[250px] object-contain" src={espaco.imageUrl} alt="Espaco Picture2"></img>)
                          }
                        </div>
                        <h2 class="my-4 text-3xl md:text-4xl font-heading font-bold">{espaco.nome}</h2>
                        <p class="mb-6 text-lg md:text-xl font-heading font-medium text-coolGray-500">{espaco.rua}</p>
                      </div>
                    </div>
                  </section>
                  </div>

                </div>
              </div>

              {apurados?.length > 0
              ? (
                <div class="w-full lg:w-1/2 px-3 mb-6">
                  <div class="h-full p-6 bg-gray-100 rounded-xl">
                      <InscritosDisplay inscritos = {apurados} titulo = "Apurados"/>
                  </div>
                </div>
                )
              : (null)
              }


              {
                ((localStorage.getItem("token")) !== 'null') ?
                (
                <>
                <div class="w-full lg:w-1/2 px-3 mb-6">
                  <div class="h-full px-6 pt-6 pb-8 bg-white rounded-xl">
                    <div class="w-full mt-6 pb-4 overflow-x-auto">
                      <section class="py-20 md:py-28 bg-white">
                        <div class="container px-4 mx-auto">
                          <div class="max-w-4xl mx-auto text-center">
                            <h2 class="mb-4 text-3xl md:text-4xl font-heading font-bold">
                            {gestao == 1
                            ?
                            "Gestão"
                            : "Inscrições"
                            }
                            </h2>

                            {gestao == 1
                            ?
                            (<>
                              <p class="mb-6 text-lg md:text-xl font-heading font-medium text-coolGray-500">Personalize o torneio a seu gosto!</p>
                              <a class="inline-block py-3 px-7 w-full md:w-auto text-lg leading-7 text-green-50 bg-orange-500 hover:bg-orange-600 font-medium text-center focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 border border-transparent rounded-md shadow-sm" href={`/${id}/gestao`}>-&gt;</a>
                            </>)
                            :
                            (<>
                              { estaInscrito ? (
                                <>
                                  <p class="mb-6 text-lg md:text-xl font-heading font-medium text-coolGray-500">Já se encontra inscrito neste torneio!</p>
                                </>
                              ) : (
                                <>
                                  <p class="mb-6 text-lg md:text-xl font-heading font-medium text-coolGray-500">Increva-se neste torneio!</p>
                                  <a class="inline-block py-3 px-7 w-full md:w-auto text-lg leading-7 text-green-50 bg-orange-500 hover:bg-orange-600 font-medium text-center focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 border border-transparent rounded-md shadow-sm" onClick={handleTogglePopupInscricao} style={{cursor:"pointer"}}>Inscrever</a>

                                  <div className={`popup ${popUpInscricao ? 'active' : ''}`}>
                                    <div className="overlay">
                                        <form className="overlayContent" onSubmit={handleEfetuaInscricao}>
                                            <label>Nova Inscricao</label>
                                            <input ref={newNomeEquipa} id="novoNomeEquipa" style={{marginBottom:"10px"}} type="text" placeholder="Nome Equipa" required/>
                                            <input ref={newClubeEquipa} id="novoNomeEquipa" style={{marginBottom:"10px"}} type="text" placeholder="Nome Clube" required/>
                                            <input ref={newRankingEquipa} id="novoNomeEquipa" style={{marginBottom:"10px"}} type="number" placeholder="Ranking Equipa" required/>

                                            <label style={{marginTop:"10px"}}>Elemento(s) Equipa</label>
                                            <input  style={{marginBottom:"10px"}} type="email" placeholder={emailUser} disabled="disabled"/>
                                            { torneio.tamEquipa > 1 ?
                                              (inputEmails.map((input, index) => {
                                                if (index > 0) {
                                                  return (
                                                  <div key={index}>
                                                    <input style={{marginBottom:"10px"}} value={input.value} type="email" placeholder={"Email elemento nº " + (index+1)} onChange={(e) => handleChangeElemento(e, index)} required/>
                                                  </div>
                                                  )
                                                }
                                              })
                                              ) : (null)
                                            }
                                            <p style={{color: "red", marginTop:(alert?"10px":"")}}>{alert ? alertMsg : ''}</p>

                                            <div className="butoesAcceptBack">
                                                <button onClick={handleTogglePopupInscricao} type="button" className="buttonCancelar buttonBlack">Cancelar</button>
                                                <button type="submit" className="buttonAceitar buttonBlack">Inscrever</button>
                                            </div>
                                        </form>
                                    </div>
                                  </div>
                                </>
                              )
                              }
                            </>)
                            }
                            </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>

                <div class="w-full lg:w-1/2 px-3 mb-6">
                  <div class="h-full px-6 pt-6 pb-8 bg-white rounded-xl">
                    <div class="w-full mt-6 pb-4 overflow-x-auto">
                      <section class="py-20 md:py-28 bg-white">
                        <div class="container px-4 mx-auto">
                          <div class="max-w-4xl mx-auto text-center">
                            <h2 class="mb-4 text-3xl md:text-4xl font-heading font-bold">
                            {isFavorito ? "Remover Favorito" : "Adicionar Favorito"}
                            </h2>
                            { isFavorito ? (
                            <>
                            <p class="mb-6 text-lg md:text-xl font-heading font-medium text-coolGray-500">Remova este torneio dos Favoritos!</p>
                            <a class="inline-block py-3 px-7 w-full md:w-auto text-lg leading-7 text-green-50 bg-orange-500 hover:bg-orange-600 font-medium text-center focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 border border-transparent rounded-md shadow-sm" onClick={handleTogglePopupRemoveFavorito} style={{cursor:"pointer"}}>Remover Favorito</a>
                            <div className={`popup ${popUpRemoveFavorito ? 'active' : ''}`}>
                              <div className="overlay">
                                  <div className="overlayContent">
                                      <h1>Deseja eliminar este torneio dos Favoritos?</h1>
                                      <div className="butoesAcceptBack">
                                          <button onClick={(event) => handleTogglePopupRemoveFavorito(event)} className="buttonCancelar buttonBlack" type="button">Não</button>
                                          <button onClick={(event) => handleRemoveFavorito(event)} className="buttonAceitar buttonBlack">Sim</button>
                                      </div>
                                  </div>
                                </div>
                            </div>
                            </>
                            ) : (
                            <>
                            <p class="mb-6 text-lg md:text-xl font-heading font-medium text-coolGray-500">Adicione este torneio aos Favoritos!</p>
                            <a class="inline-block py-3 px-7 w-full md:w-auto text-lg leading-7 text-green-50 bg-orange-500 hover:bg-orange-600 font-medium text-center focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 border border-transparent rounded-md shadow-sm" onClick={handleTogglePopupAddFavorito} style={{cursor:"pointer"}}>Adicionar Favorito</a>
                            <div className={`popup ${popUpAddFavorito ? 'active' : ''}`}>
                              <div className="overlay">
                                  <div className="overlayContent">
                                      <h1>Deseja adicionar este torneio aos Favoritos?</h1>
                                      <div className="butoesAcceptBack">
                                          <button onClick={(event) => handleTogglePopupAddFavorito(event)} className="buttonCancelar buttonBlack" type="button">Não</button>
                                          <button onClick={(event) => handleAddFavorito(event)} className="buttonAceitar buttonBlack">Sim</button>
                                      </div>
                                  </div>
                                </div>
                            </div>
                            </>
                            )
                            }
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
                </>
                ) : (null)
              }

              </div>
              </div>
            </section>




          </div>
        )
        : (<div class="py-3">
            <div class="container px-4 mx-auto">
              <div class="p-4 bg-red-500 rounded-lg">
                <div class="flex w-full h-full items-center justify-between">
                  <div class="flex items-center pr-6">
                    <span class="flex-shrink-0 self-start">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 12C9.75278 12 9.5111 12.0733 9.30554 12.2107C9.09998 12.348 8.93976 12.5432 8.84516 12.7716C8.75055 13.0001 8.72579 13.2514 8.77402 13.4939C8.82225 13.7363 8.94131 13.9591 9.11612 14.1339C9.29094 14.3087 9.51367 14.4277 9.75614 14.476C9.99862 14.5242 10.25 14.4995 10.4784 14.4049C10.7068 14.3102 10.902 14.15 11.0393 13.9445C11.1767 13.7389 11.25 13.4972 11.25 13.25C11.25 12.9185 11.1183 12.6005 10.8839 12.3661C10.6495 12.1317 10.3315 12 10 12ZM10 10.5C10.2652 10.5 10.5196 10.3946 10.7071 10.2071C10.8946 10.0196 11 9.76522 11 9.5V6.5C11 6.23478 10.8946 5.98043 10.7071 5.79289C10.5196 5.60536 10.2652 5.5 10 5.5C9.73479 5.5 9.48043 5.60536 9.2929 5.79289C9.10536 5.98043 9 6.23478 9 6.5V9.5C9 9.76522 9.10536 10.0196 9.2929 10.2071C9.48043 10.3946 9.73479 10.5 10 10.5ZM10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433284 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9971 7.34874 18.9425 4.80691 17.0678 2.93219C15.1931 1.05746 12.6513 0.00294858 10 0ZM10 18C8.41775 18 6.87104 17.5308 5.55544 16.6518C4.23985 15.7727 3.21447 14.5233 2.60897 13.0615C2.00347 11.5997 1.84504 9.99113 2.15372 8.43928C2.4624 6.88743 3.22433 5.46197 4.34315 4.34315C5.46197 3.22433 6.88743 2.4624 8.43928 2.15372C9.99113 1.84504 11.5997 2.00346 13.0615 2.60896C14.5233 3.21447 15.7727 4.23984 16.6518 5.55544C17.5308 6.87103 18 8.41775 18 10C17.9976 12.121 17.1539 14.1544 15.6542 15.6542C14.1544 17.1539 12.121 17.9976 10 18Z" fill="#7A0C2E"></path>
                      </svg>
                    </span>
                    <span class="text-sm leading-5 text-red-900 font-medium ml-3">Este torneio não existe!</span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )
        }
        </>
    )
}
