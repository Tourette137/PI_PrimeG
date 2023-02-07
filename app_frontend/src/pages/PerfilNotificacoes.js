import NotificacaoDisplay from "./NotificacaoDisplay.jsx";
import {useNavigate, Link,Route,Routes} from 'react-router-dom';
import {useState,useEffect} from 'react';
import axios from 'axios';
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import '../components/Buttons.css';

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
                    setNotificacoes(response.data.sort((a, b) => b.idNotificacao - a.idNotificacao));
                })
                .catch(e => console.log(e))
      }

    // Use Effect inicial
    useEffect(() => {
        window.scrollTo(0, 0);
        notificacoesUser();
      },[])


    return(
        <>
        <NavbarDynamic/>

            <div className="pt-12">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg containerDiv">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-3xl text-center text-white uppercase bg-transparent" style={{background: "linear-gradient(90deg, #ff5500, #f8b028)"}}>
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Notificações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            notificacoes?.length > 0 ?
                            (
                                notificacoes.map((notificacao) => <NotificacaoDisplay notificacao={notificacao}/>)
                            ) : (
                            <tr className="text-lg bg-white border-b">
                                <td className="px-6 py-4">
                                    Não existem notificações
                                </td>
                            </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>

                <div className="butoesAcceptBack" style={{marginBottom: "50px" ,textAlign:"center"}}>
                    <button className="buttonBlack" onClick={handlebackToProfile}>Voltar ao Perfil</button>
                </div>
            </div>


        </>
    )
}