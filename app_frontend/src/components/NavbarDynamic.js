import {Link} from 'react-router-dom';
import logotipo from '../images/logotipo.png'
import {useState, useEffect} from 'react';
import axios from 'axios';
import NotificacaoDisplayMenu from "../pages/NotificacaoDisplayMenu.jsx";

import "./NavbarDynamic.css";

const API_URL="http://localhost:3000"

export function NavbarDynamic() {

    const [showMenu, setShowMenu] = useState(false);
    const [count, setCount] = useState(0);
    const [isLogged, setIsLogged] = useState(false);

    const [notificacoes, setNotificacoes] = useState([]);
    const [showNotification, setShowNotification] = useState(false);

    function ReloadNav () {
        setCount(count + 1);
    };

    // Vai a API buscar os torneios inscritos do Utilizador
    const notificacoesUser = async () => {

        const headers = { "authorization": "Bearer " + localStorage.getItem("token") }

        axios.get(`${API_URL}/users/notificacoes`, {headers: headers})
                .then(response => {
                    setNotificacoes(response.data.sort((a, b) => b.idNotificacao - a.idNotificacao));
                })
                .catch(e => console.log("No Notifications"))
      }

    const handleToogleNotifications = async (e) => {
        setShowNotification(!showNotification)
    }

    const handleHideNotificatios = async (e) => {
        setShowNotification(false)
    }

    const checkLoggedIn = async (e) => {
        if (localStorage.getItem("token") !== 'null') {
            setIsLogged(true);
            console.log("Tá logado")
        }
    }

    useEffect(() => {
        if (localStorage.getItem("token") !== 'null') {
            notificacoesUser()
        }
    },[])

    return(
        <div className='distancia'>

            <header className="header">
                <nav className="nav containerDiv">
                    <Link to="/" className="nav__logo" onClick={() => {setShowMenu(false); handleHideNotificatios()}}>
                        <img src={logotipo} alt="MATCHUP"></img>
                    </Link>

                    <div className= {showMenu ? "nav__menu show-menu" : "nav__menu"}>
                        <ul className='nav__list grid'>

                            <>
                            {
                                showMenu ?
                                (<li className="nav__item">
                                    <Link to="/" className="nav__link" onClick={() => {setShowMenu(false); handleHideNotificatios()}}>
                                        <i className="uil uil-estate nav__icon"></i>Home
                                    </Link>
                                </li>
                                ) : (
                                    null
                                )
                            }
                            </>


                            <li className="nav__item">
                                <Link to="/torneios" className="nav__link" onClick={() => {setShowMenu(false); handleHideNotificatios()}}>
                                    <i className="uil uil-trophy nav__icon"></i>Torneios
                                </Link>
                            </li>

                            <li className="nav__item">
                                <Link to="/espacos" className="nav__link" onClick={() => {setShowMenu(false); handleHideNotificatios()}}>
                                    <i className="uil uil-location-pin-alt nav__icon"></i>Espaços
                                </Link>
                            </li>

                            <>
                            {
                                (localStorage.getItem("token") !== 'null') ? (
                                    <Link to="/perfil" className="nav__link" onClick={() => {setShowMenu(false); handleHideNotificatios()}}>
                                        <i className="uil uil-user nav__icon"></i>O meu Perfil
                                    </Link>
                                ) : (
                                    <Link to="/login" className="nav__link" onClick={() => {setShowMenu(false); handleHideNotificatios()}}>
                                        <i className="uil uil-user nav__icon"></i>Login
                                    </Link>
                                )
                            }
                            </>

                            <>  
                            {
                                ((localStorage.getItem("token") !== 'null') && !showMenu) ?
                                (<li className="nav__item">
                                    <div className="nav__link">
                                        <i className="uil uil-bell" style={{fontSize: "1.2rem", marginTop:"-3px", marginLeft:"-3px", cursor:"pointer"}} onClick={handleToogleNotifications}></i>
                                    </div>
                                    <div className="absolute overflow-x-auto shadow-md sm:rounded-lg containerDiv" style={{display: (showNotification ? "" : "none"), width:"400px", marginLeft:"-380px", marginTop:"10px"}}>
                                        <table className="w-full text-sm text-left text-gray-500">
                                            <thead className="text-xl text-center text-white uppercase bg-transparent" style={{background: "linear-gradient(90deg, #ff5500, #f8b028)"}}>
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
                                                    notificacoes.map((notificacao) => <NotificacaoDisplayMenu notificacao={notificacao} setShowMenu={setShowMenu} handleHideNotificatios={handleHideNotificatios}/>)
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
                                </li>
                                ) : (
                                    null
                                )
                            }
                            </>

                        </ul>

                        <i className="uil uil-times nav__close" onClick={() => setShowMenu(!showMenu)}></i>

                    </div>

                    <div className="nav__toggle" onClick={() => setShowMenu(!showMenu)}>
                        <i className="uil uil-apps"></i>
                    </div>

                </nav>
            </header>
            
        </div>
    )
}
