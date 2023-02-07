import {useState, useRef, useEffect} from 'react';
import {useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import '../components/Buttons.css';
import '../components/LoginRegister.css';

const API_URL="http://localhost:3000"

export function Login() {

    const inputEmailRef = useRef(null);
    const inputPasswordRef = useRef(null);
    const navigate = useNavigate();

    const [alert, setAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()
        const bodyMessage = {
            "email": inputEmailRef.current.value,
            "password": inputPasswordRef.current.value
        }

        axios.post(`${API_URL}/users/login`, bodyMessage)
            .then(response => {
                localStorage.setItem("token", response.data.token)
                navigate("/")
            })
            .catch(e => {
                switch (e.response.status) {
                    case 503:
                        setAlertMsg("Utilizador não existe!")
                        break
                    case 501:
                        setAlertMsg("Password incorreta!")
                        break
                    default:
                        setAlertMsg("Algo correu mal!")
                        break
                }
                setAlert(true)
            })
    }


    /*{
        (alert) ? (
            <p className="alert" style="color: red">asdasdasd</p>
        ) : (null)
    }*/

    useEffect(() => {
        window.scrollTo(0, 0);
    },[])

    return (
        <>
        <NavbarDynamic/>

        <form className="login-info-form w3-mobile" onSubmit={handleLogin}>
            <h1>Iniciar Sessão</h1>
            <div className="campoDados">
                <p style={{color: "red", marginBottom:"10px", marginTop:(alert?"-10px":"")}}>{alert ? alertMsg : ''}</p>
                <input ref={inputEmailRef} id="email" type="email" placeholder="Email" required></input><br/>
                <input ref={inputPasswordRef} id="password" type="password" placeholder="Password" required></input>
            </div>
            <Link to="/registo" className="registerLink">Não tem conta? Registe-se.</Link>
            <div className="butoesAcceptBack" style={{ marginBottom: "50px" }}>
                <Link to="/"><button type="button" className="buttonCancel buttonBlack">Cancel</button></Link>
                <button type="submit" className="buttonAccept buttonOrange">Login</button>
            </div>
        </form>
        </>
    )
        
}