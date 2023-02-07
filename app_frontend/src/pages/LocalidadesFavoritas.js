import {NavbarDynamic} from '../components/NavbarDynamic.js';
import {useNavigate,Link} from 'react-router-dom';
import {useState,useEffect, useRef} from 'react';
import axios from 'axios';
import '../components/LocalidadesFavoritas.css';
import '../components/Buttons.css';
import '../components/Popup.css';

import trashIcon from "../images/trash-solid.svg"

const API_URL="http://localhost:3000"

export function LocalidadesFavoritas() {

    const navigate = useNavigate()

    const [allLocalidades, setAllLocalidades] = useState([])
    const [allLocalidadesNames, setAllLocalidadesNames] = useState([])
    const [localidadesFav, setLocalidadesFav] = useState([])
    
    const [popUpNewLocalidade, setPopUpNewLocalidade] = useState(false)
    const [popUpDeleteLocalidade, setPopUpDeleteLocalidade] = useState(false)
    const [deleteLocalidade, setDeleteLocalidade] = useState("")

    const [alert, setAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState("") 

    const [changes, setChanges] = useState(0) 

    const newLocalidade = useRef(null);


    const getAllLocalidades = async (e) => {
        axios.get(`${API_URL}/users/allLocalidades`)
                .then(response => {
                    setAllLocalidades(response.data)
                    setAllLocalidadesNames(response.data.map(({Nome})=> Nome))
                })
                .catch(e => console.log(e))
    }

    const getLocalidadesFav = async (e) => {
        const headers = { "authorization": "Bearer " + localStorage.getItem("token") }

        axios.get(`${API_URL}/users/localidadesFav`, {headers: headers})
                .then(response => {
                    setLocalidadesFav(response.data.map(({Nome})=> Nome))
                })
                .catch(e => console.log(e))
    }

    const handleAddFavorito = async (e) => {

        e.preventDefault()

        if (localidadesFav.includes(newLocalidade.current.value)) {
            setAlert(true)
            setAlertMsg("Localidade Favorita já existente")
        } 
        else if (!allLocalidadesNames.includes(newLocalidade.current.value)) {
            setAlert(true)
            setAlertMsg("Localidade não existente")
        }
        else {
            const newLocalidadeID = allLocalidades.find(localidade => {
                return localidade.Nome === newLocalidade.current.value
            }).idLocalidade

            const headers = { "authorization": "Bearer " + localStorage.getItem("token") }
        
            axios.post(`${API_URL}/users/addFavorito?localidade=${newLocalidadeID}`, null, {headers: headers})
                    .then(response => {
                        console.log(response)
                        setChanges(changes + 1)

                        setAlert(false)
                        setAlertMsg("")
                        newLocalidade.current.value = null
                        
                        setPopUpNewLocalidade(!popUpNewLocalidade)
                    })
                    .catch(e => console.log(e))
        }

    }

    const handleTogglePopupNewLocalidade = async (e) => {
        setPopUpNewLocalidade(!popUpNewLocalidade)
        
        newLocalidade.current.value = null
        setAlert(false)
        setAlertMsg("")
    }

    const handleRemoveFavorito = async (e) => {
        e.preventDefault()

        const deleteLocalidadeID = allLocalidades.find(localidade => {
            return localidade.Nome === deleteLocalidade
        }).idLocalidade

        const headers = { "authorization": "Bearer " + localStorage.getItem("token") }
        
        axios.delete(`${API_URL}/users/removeFavorito?localidade=${deleteLocalidadeID}`, {headers: headers})
                .then(response => {
                    console.log(response)
                    setChanges(changes + 1)

                    setDeleteLocalidade("")
                    setPopUpDeleteLocalidade(!popUpDeleteLocalidade)
                })
                .catch(e => console.log(e))

    }

    const handleTogglePopupDeleteLocalidade = async (e, localidade) => {
        setDeleteLocalidade(localidade)
        setPopUpDeleteLocalidade(!popUpDeleteLocalidade)
    }

    // Handler para voltar ao Perfil
    const handlebackToProfile = async (e) => {
        e.preventDefault()
        navigate("/perfil")
    }

    // Use Effect inicial
    useEffect(() => {
        window.scrollTo(0, 0);
        getAllLocalidades();
        getLocalidadesFav();
     },[])

     useEffect(() => {
        getLocalidadesFav();
     },[changes])

    return(
        <>
            <NavbarDynamic/>

            <section className="login-info-form w3-mobile">
                <h1 style={{marginBottom: "40px"}}>Localidades Favoritas</h1>
                    
                <div className="paragensFavoritas">
                    {
                        localidadesFav?.length > 0 ?
                        (
                          <div className="containerDiv">
                            {localidadesFav.map((localidade) => 
                                <>
                                <div className= "informacaoParagem">
                                    <h3 key={localidade} style={{float: "left"}}>{localidade}</h3>
                                    <img onClick={(event) => handleTogglePopupDeleteLocalidade(event, localidade)} style={{cursor:"pointer"}} className="deleteButton" src={trashIcon} alt="Lixo"/>
                                </div>
                                <hr/>
                                </>
                            )}
                          </div>
                        ) : (
                            <h2>Não possui Localidades Favoritas</h2>
                        )
                    }
                    
                </div>

                <div style={{marginTop: "20px", cursor: "pointer"}} onClick={handleTogglePopupNewLocalidade} className="registerLink">Adicionar nova Localidade Favorita</div>
                <div className="butoesAcceptBack" style={{marginBottom: "50px"}}>
                    <button className="buttonBlack" onClick={handlebackToProfile}>Voltar ao Perfil</button>
                </div>

                </section>

                <div className={`popup ${popUpNewLocalidade ? 'active' : ''}`}>
                    <div className="overlay">
                        <form className="overlayContent">
                            <label>Nova Localidade Favorita</label>
                            <p style={{color: "red", marginBottom:"10px", marginTop:(alert?"10px":"")}}>{alert ? alertMsg : ''}</p>
                            <input ref={newLocalidade} style={{marginBottom:"5px"}} list="localidades" id="partida" type="text" placeholder="Localidade Favorita" required/>

                            <div className="butoesAcceptBack">
                                <button onClick={handleTogglePopupNewLocalidade} type="button" className="buttonCancelar buttonBlack">Cancelar</button>
                                <button onClick={handleAddFavorito} className="buttonAceitar buttonBlack">Adicionar</button>
                            </div>
                        </form>
                    </div>	
                </div>

                <div className={`popup ${popUpDeleteLocalidade ? 'active' : ''}`}>
                    <div className="overlay">
                        <div className="overlayContent">
                            <h1>Deseja eliminar esta localidade?</h1>
                            <div className="butoesAcceptBack">
                                <button onClick={(event) => handleTogglePopupDeleteLocalidade(event, "")} className="buttonCancelar buttonBlack" type="button">Não</button>
                                <button onClick={(event) => handleRemoveFavorito(event)} className="buttonAceitar buttonBlack">Sim</button>
                            </div>
                        </div>
                    </div>	
                </div>

                <datalist id="localidades">
                    {allLocalidades.map((localidade) =>
                        <option key={localidade.idLocalidade} value={localidade.Nome} />
                    )}
                </datalist>
        </>
    )
}