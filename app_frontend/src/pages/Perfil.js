import {useNavigate,Link} from 'react-router-dom';
import {useState,useEffect} from 'react';
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
    
    // Handler para voltar ao Perfil
    const handleTerminarSessao = async (e) => {
        e.preventDefault()
        
        localStorage.setItem("token", null)
        navigate("/")
    }

    const handleTooglePopup = async (e) => {
        setPopUp(!popUp)
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
                    console.log(response.data[0])
                    setUser(response.data[0])
                })
                .catch(e => console.log(e))
      }
    
    // Use Effect inicial
    useEffect(() => {
       getDadosUser();
    },[])
      

    return(
        <>
        <NavbarDynamic/>

        <section className="profile-info w3-mobile" style={{marginTop: "-150px"}}>
            <h1>PERFIL UTILIZADOR</h1>

            <PerfilDisplay user = {user} handleTooglePopup = {handleTooglePopup}/>


            <div className="butoesAcceptBack gridButtons container" style={{ margin: "0 0 30px 0" }}>
                <button className="buttonBlack"><Link to="/perfil/inscrito">Torneios Inscrito</Link></button>
                <button className="buttonBlack"><Link to="/perfil/favoritos">Torneios Favoritos</Link></button>
                <button className="buttonBlack"><Link to="/perfil/historico">Historico Torneios</Link></button>
                <button className="buttonBlack"><Link to="/perfil/historicoJogos">Historico Jogos</Link></button>
                <button className="buttonBlack"><Link to="/perfil/notificacoes">Notificacoes</Link></button>
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