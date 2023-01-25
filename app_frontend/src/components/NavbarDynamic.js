import {Link} from 'react-router-dom';
import logotipo from '../images/logotipo.png'
import {useState, useEffect} from 'react';

import "./NavbarDynamic.css";

export function NavbarDynamic() {

    const [showMenu, setShowMenu] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn()
    },[])

    const homeComponent =
        <li className="nav__item">
            <Link to="/" className="nav__link">
                <i className="uil uil-estate nav__icon"></i>Home
            </Link>
        </li>

    return(
      <div className="mb-16">
        <header className="header">
            <nav className="nav container">
                <Link to="/" className="nav__logo">
                    <img src={logotipo} alt="MATCHUP"></img>
                </Link>

                <div className= {showMenu ? "nav__menu show-menu" : "nav__menu"}>
                    <ul className='nav__list grid'>

                        <>
                        {
                            showMenu ?
                            (<li className="nav__item">
                                <Link to="/" className="nav__link">
                                    <i className="uil uil-estate nav__icon"></i>Home
                                </Link>
                            </li>
                            ) : (
                                null
                            )
                        }
                        </>

                        {
                            /*
                            <li className="nav__item">
                                <Link to="/" className="nav__link">
                                    <i className="uil uil-at nav__icon"></i>About Us
                                </Link>
                            </li>
                            */
                        }


                        <li className="nav__item">
                            <Link to="/torneios" className="nav__link">
                                <i className="uil uil-trophy nav__icon"></i>Torneios
                            </Link>
                        </li>

                        <li className="nav__item">
                            <Link to="/espacos" className="nav__link">
                                <i className="uil uil-location-pin-alt nav__icon"></i>Espaços
                            </Link>
                        </li>

                        <>
                        {
                            (localStorage.getItem("token") !== 'null') ? (
                                <Link to="/perfil" className="nav__link">
                                    <i className="uil uil-user nav__icon"></i>O meu Perfil
                                </Link>
                            ) : (
                                <Link to="/login" className="nav__link">
                                    <i className="uil uil-user nav__icon"></i>Login
                                </Link>
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
