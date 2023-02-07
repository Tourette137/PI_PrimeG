import JogoDisplay from "./JogoDisplay.jsx";
import {useNavigate, Link,Route,Routes} from 'react-router-dom';
import {useState,useEffect} from 'react';
import axios from 'axios';
import {NavbarDynamic} from '../components/NavbarDynamic.js';

const API_URL="http://localhost:3000"

export function PerfilHistoricoJogos() {

    const navigate = useNavigate();
    const [jogos, setJogos] = useState([]);

    // Handler para voltar ao Perfil
    const handlebackToProfile = async (e) => {
        e.preventDefault()
        navigate("/perfil")
    }

    // Vai a API buscar os torneios inscritos do Utilizador
    const jogosHistorico = async () => {

        const headers = { "authorization": "Bearer " + localStorage.getItem("token") }

        axios.get(`${API_URL}/users/jogosHistorico`, {headers: headers})
                .then(response => {
                    setJogos(response.data)
                })
                .catch(e => console.log(e))
      }

    // Use Effect inicial
    useEffect(() => {
        window.scrollTo(0, 0);
        jogosHistorico();
      },[])


    return(
        <>
        <NavbarDynamic/>
            <h1>Só entra aqui se tiver o token / estiver logado.</h1>
            <h1>HISTÓRICO DE JOGOS</h1>

            {
                jogos?.length > 0 ?
                (
                <div className="container">
                    {jogos.map((jogo) => <li><JogoDisplay jogo = {jogo}/></li>) }
                </div>
                ) : (
                <div className="empty">
                    <h2>Nao Tem Histórico de Jogos</h2>
                </div>
                )
            }

            <button onClick={handlebackToProfile}>Voltar ao Perfil</button>
        </>
    )
}