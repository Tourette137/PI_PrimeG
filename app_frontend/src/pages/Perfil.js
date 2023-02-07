import {useNavigate,Link} from 'react-router-dom';
import {useState,useEffect, useRef} from 'react';
import axios from 'axios';
import PerfilDisplay from "./PerfilDisplay.jsx";
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import '../components/Buttons.css';
import '../components/Perfil.css';
import '../components/Popup.css';

const API_URL="http://localhost:3000"

export function Perfil() {

    const navigate = useNavigate()
    const [user, setUser] = useState("")
    const [popUp, setPopUp] = useState(false)

    const [alert, setAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState("") 
    const [popUpNewImage, setPopUpNewImage] = useState(false)
    
    const inputImageRef = useRef(null);
    
    // Handler para voltar ao Perfil
    const handleTerminarSessao = async (e) => {
        e.preventDefault()
        
        localStorage.setItem("token", null)
        navigate("/")
    }

    const handleTooglePopup = async (e) => {
        setPopUp(!popUp)
    }

    const handleTooglePopupNewImage = async (e) => {
        setPopUpNewImage(!popUpNewImage)

        setAlertMsg("")
        setAlert(false)
    }

    const handleChangeImage = async (e) => {

        const file = inputImageRef.current.files[0]
        
        const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png']

        if(!validFileTypes.find(type => type === file.type)) {
            setAlertMsg("Ficheiro deve possuir formatos JPG ou PNG!")
            setAlert(true)
            inputImageRef.current.value = null;
            return;
        }

        const formData = new FormData()
        formData.append("fotoPerfil", file)

        axios.post(`${API_URL}/users/changePicture`, formData, { headers: {'Content-Type': 'multipart/form-data', "authorization": "Bearer " + localStorage.getItem("token")}})
                .then(response => {
                    const newUser = user
                    newUser["imageUrl"] = response.data
                    setUser(newUser)
                    setAlertMsg("")
                    setAlert(false)
                    setPopUpNewImage(false)
                    inputImageRef.current.value = null;
                })
                .catch(e => {
                    setAlertMsg("Algo correu mal")
                    setAlert(true)
                    return;
                })
    }

    // Handler para add Favorito
    /*
    const handleAddFavorito = async () => {

        const headers = { "authorization": "Bearer " + localStorage.getItem("token") }
        
        axios.post(`${API_URL}/users/removeFavorito?localidade=2`, null, {headers: headers})
                .then(response => {
                    console.log(response)
                })
                .catch(e => console.log(e))
    }
    */

    // Handler para voltar ao Perfil
    /*
    const handleRemoveFavorito = async () => {

        const headers = { "authorization": "Bearer " + localStorage.getItem("token") }
        
        axios.delete(`${API_URL}/users/removeFavorito?localidade=2`, {headers: headers})
                .then(response => {
                    console.log(response)
                })
                .catch(e => console.log(e))
    }
    */
    
    // Vai a API buscar os dados do Utilizador
    const getDadosUser = async () => {

        const headers = { "authorization": "Bearer " + localStorage.getItem("token") }

        axios.get(`${API_URL}/users/perfil`, {headers: headers})
                .then(response => {
                    setUser(response.data[0])
                })
                .catch(e => console.log(e))
      }
    
    // Use Effect inicial
    useEffect(() => {
        window.scrollTo(0, 0);
        getDadosUser();
    },[])
      

    return(
        <>
        <NavbarDynamic/>

        <section className="profile-info w3-mobile" style={{marginTop: "-150px"}}>
            <h1>PERFIL UTILIZADOR</h1>

            <PerfilDisplay user = {user} handleTooglePopup = {handleTooglePopup} handleTooglePopupNewImage = {handleTooglePopupNewImage}/>

            <div className={`popup ${popUpNewImage ? 'active' : ''}`}>
                <div className="overlay">
                    <div className="overlayContent">
                        <h1>Nova Foto de Perfil</h1>
                        <p style={{color: "red", marginBottom:"10px", marginTop:(alert?"-10px":"")}}>{alert ? alertMsg : ''}</p>
                        <input className="w3-file" ref={inputImageRef} id="file" type="file"></input>
                        <div className="butoesAcceptBack" style={{marginTop:"-20px"}}>
                            <button className="buttonCancelar buttonBlack" onClick={handleTooglePopupNewImage}>Cancelar</button>
                            <button className="buttonAceitar buttonBlack" onClick={handleChangeImage}>Confirmar</button>
                        </div>
                    
                    </div>
                </div>	
            </div>

            <div style={{background:"transparent", margin: "50px 0 40px 0", boxShadow: "10px 10px 5px lightgray", borderRadius: "16px", paddingBottom:"20px"}}>
                <div className="butoesAcceptBack gridButtons containerDiv" style={{ margin: "0 0 20px 0"}}>
                    <Link to="/perfil/notificacoes"><button className="buttonBlack">Notificações</button></Link>
                    <Link to="/perfil/localidadesFavoritas"><button className="buttonBlack">Localidades Favoritas</button></Link>
                    <Link to="/perfil/desportosFavoritos"><button className="buttonBlack">Desportos Favoritos</button></Link>
                    <Link to="/perfil/inscrito"><button className="buttonBlack">Torneios Inscrito</button></Link>
                    <Link to="/perfil/favoritos"><button className="buttonBlack">Torneios Favoritos</button></Link>
                    <Link to="/perfil/historico"><button className="buttonBlack">Histórico Torneios</button></Link>
                </div>
            </div>
        </section>

            { /* <button onClick={handleAddFavorito}>Adicionar Favorito</button> */ }

            <div className={`popup ${popUp ? 'active' : ''}`}>
                <div className="overlay">
                    <div className="overlayContent">
                        
                        <h1>Deseja terminar sessão?</h1>
                        <div className="butoesAcceptBack">
                            <button className="buttonCancelar buttonBlack" onClick={handleTooglePopup}>Não</button>
                            <button className="buttonAceitar buttonBlack" onClick={handleTerminarSessao}>Sim</button>
                        </div>
                    
                    </div>
                </div>	
            </div>
        </>
    )
}