import React from 'react'
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

const API_URL="http://localhost:3000"

const NotificacaoDisplayMenu = ({notificacao, setShowMenu, handleHideNotificatios}) => {
    const navigate = useNavigate();

    const [notTitulo, setNotTitulo] = useState("");
    const [notDesporto, setNotDesporto] = useState("");
    const [notLocalidade, setNotLocalidade] = useState("");

    // Handler para voltar ao Perfil
    const handlebackGoToTorneios = async (e, idTorneio, lido, idNotificacao) => {
        
        e.preventDefault()

        if(!lido) {
            console.log("ENTREI")
            const headers = { "authorization": "Bearer " + localStorage.getItem("token") }
            
            const bodyMessage = {
                "idNotificacao": idNotificacao
            }

            axios.post(`${API_URL}/users/notificacaoVista`, bodyMessage, {headers: headers})
                .then(response => {
                    console.log(response)
                })
                .catch(e => {
                    console.log(e)
                })
        }

        navigate(`/torneios/${idTorneio}`)
    }

    // Criar variaveis
    const createVariables = async () => {
        const [newNotTitulo, newNotDesporto, newNotLocalidade] = await notificacao.Titulo.split("$$");
        setNotTitulo(newNotTitulo);
        setNotDesporto(newNotDesporto);
        setNotLocalidade(newNotLocalidade);
    }

    // Use Effect inicial
    useEffect(() => {
        createVariables();
     },[])


    return (
        <tr className= {notificacao.Lido ? "bg-gray-200 hover:bg-gray-300 text-lg border-b cursor-pointer" : "bg-white hover:bg-gray-100 text-lg border-b cursor-pointer"} onClick={(e) => {handlebackGoToTorneios(e, notificacao.Torneio_idTorneio, notificacao.Lido, notificacao.idNotificacao); setShowMenu(false); handleHideNotificatios()}}>
            <td className="px-6 py-4 text-base">
                Novo Torneio: <b>{notTitulo}</b> de <b>{notDesporto}</b> em <b>{notLocalidade}</b>
            </td>
        </tr>
    )
}

/*
<div className="notification">
            
            <div>
                <p>Titulo(Username): {notificacao.Titulo}</p>
            </div>

            <div>
                <p>ID Torneio: {notificacao.Torneio_idTorneio}</p>
            </div>

            <div>
                {notificacao.Lido ?
                    (<p>Lido</p>)
                :   (<p>Por ler</p>) 
                }
            </div>

        </div>
*/

export default NotificacaoDisplayMenu;