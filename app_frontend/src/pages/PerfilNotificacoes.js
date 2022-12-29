import NotificacaoDisplay from "./NotificacaoDisplay.jsx";
import {useNavigate, Link,Route,Routes} from 'react-router-dom';
import {useState,useEffect} from 'react';
import axios from 'axios';

const API_URL="http://localhost:3000"

export function PerfilNotificacoes() {

    const navigate = useNavigate();
    const [notificacoes, setNotificacoes] = useState([]);

    // Handler para voltar ao Perfil
    const handlebackToProfile = async (e) => {
        e.preventDefault()
        navigate("/perfil")
    }

    // Vai a API buscar os torneios inscritos do Utilizador
    const notificacoesUser = async () => {

        const headers = { "authorization": "Bearer " + localStorage.getItem("token") }

        axios.get(`${API_URL}/users/notificacoes`, {headers: headers})
                .then(response => {
                    setNotificacoes(response.data)
                })
                .catch(e => console.log(e))
      }

    // Use Effect inicial
    useEffect(() => {
        notificacoesUser();
      },[])


    return(
        <>
            <h1>Só entra aqui se tiver o token / estiver logado.</h1>
            <h1>NOTIFICACOES</h1>

            {
                notificacoes?.length > 0 ?
                (
                <div className="container">
                    {notificacoes.map((notificacao) => <li><NotificacaoDisplay notificacao={notificacao}/></li>) }
                </div>
                ) : (
                <div className="empty">
                    <h2>Nao Tem Notificações</h2>
                </div>
                )
            }

            <button onClick={handlebackToProfile}>Voltar ao Perfil</button>
        </>
    )
}