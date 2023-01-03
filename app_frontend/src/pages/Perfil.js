import {useNavigate,Link,Route,Routes} from 'react-router-dom';
import {useState,useEffect} from 'react';
import axios from 'axios';
import PerfilDisplay from "./PerfilDisplay.jsx";
import {NavbarDynamic} from '../components/NavbarDynamic.js';

const API_URL="http://localhost:3000"

export function Perfil() {

    const navigate = useNavigate()
    const [user, setUser] = useState("")
    
    // Handler para voltar ao Perfil
    const handleTerminarSessao = async (e) => {
        e.preventDefault()
        
        localStorage.setItem("token", null)
        navigate("/")
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
            <h1>Só entra aqui se tiver o token / estiver logado.</h1>
            <h1>PERFIL UTILIZADOR</h1>

            <PerfilDisplay user = {user}/>

            <button onClick={handleTerminarSessao}>Logout</button>

            <button><Link to="/perfil/inscrito">Torneios Inscrito</Link></button>
            <button><Link to="/perfil/favoritos">Torneios Favoritos</Link></button>
            <button><Link to="/perfil/historico">Historico Torneios</Link></button>
            <button><Link to="/perfil/historicoJogos">Historico Jogos</Link></button>
            <button><Link to="/perfil/notificacoes">Notificacoes</Link></button>
            { /* <button onClick={handleAddFavorito}>Adicionar Favorito</button> */ }
        </>
    )
}