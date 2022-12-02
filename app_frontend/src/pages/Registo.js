import {useRef, useState} from 'react';
import {useNavigate } from 'react-router-dom'
import axios from 'axios';

const API_URL="http://localhost:3000"

export function Registo() {

    const inputEmailRef = useRef(null);
    const inputPassword1Ref = useRef(null);
    const inputPassword2Ref = useRef(null);
    const inputNomeRef = useRef(null);
    const inputDataRef = useRef(null);

    const [selectGenero, setSelectGenero] = useState();

    const navigate = useNavigate();


    const handleRegisto = async (e) => {
        e.preventDefault()

        if (inputPassword1Ref.current.value === inputPassword2Ref.current.value) {

            const bodyMessage = {
                "nome": inputNomeRef.current.value,
                "email": inputEmailRef.current.value,
                "password": inputPassword1Ref.current.value,
                "dataNascimento": inputDataRef.current.value,
                "genero": selectGenero
            }
    
            axios.post(`${API_URL}/users/registo`, bodyMessage)
                .then(response => {
                    console.log(response)
                    navigate("/login")
                })
                .catch(e => console.log(e))
            
        } else {
            console.log("Passwords são diferentes")
        }

    }


    
    return (
        <>
        <h1>Registo</h1>
        <form onSubmit={handleRegisto}>
            <div>
                <input ref={inputEmailRef} id="email" type="email" placeholder="Email" required></input><br/>
                <input ref={inputPassword1Ref} id="password1" type="password" placeholder="Password" required></input><br/>
                <input ref={inputPassword2Ref} id="password2" type="password" placeholder="Repeat Password" required></input><br/>
                <input ref={inputNomeRef} id="name" type="text" placeholder="Nome" required></input><br/>
                <input ref={inputDataRef} id="date" type="date" placeholder="Data de Nascimento" required></input><br/>
                <select value={selectGenero} id="genero" name="Género" onChange={e => setSelectGenero(e.target.value)} required>
                    <option value="">Indique o seu género</option>
                    <option value="0">Masculino</option>
                    <option value="1">Feminino</option>
                </select>
            </div>
            <button>Registo</button>
        </form>
        </>
    )
        
}