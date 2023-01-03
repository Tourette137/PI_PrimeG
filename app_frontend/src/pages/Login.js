import {useRef} from 'react';
import {useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL="http://localhost:3000"

export function Login() {

    const inputEmailRef = useRef(null);
    const inputPasswordRef = useRef(null);
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault()

        const bodyMessage = {
            "email": inputEmailRef.current.value,
            "password": inputPasswordRef.current.value
        }

        axios.post(`${API_URL}/users/login`, bodyMessage)
            .then(response => {
                console.log(response)
                localStorage.setItem("token", response.data.token)
                navigate("/")
            })
            .catch(e => console.log(e))
    }


    
    return (
        <>
        <h1>LOGIN</h1>
        <form onSubmit={handleLogin}>
            <div>
                <input ref={inputEmailRef} id="email" type="email" placeholder="Email" required></input><br/>
                <input ref={inputPasswordRef} id="password" type="password" placeholder="Password" required></input>
            </div>
            <button>Login</button>
        </form>
        <button><Link to="/registo">Registe-se</Link></button>
        </>
    )
        
}