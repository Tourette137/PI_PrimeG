import {useRef, useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom'
import axios from 'axios';
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import '../components/Buttons.css';
import '../components/LoginRegister.css';

const API_URL="http://localhost:3000"

export function Registo() {

    const inputEmailRef = useRef(null);
    const inputPassword1Ref = useRef(null);
    const inputPassword2Ref = useRef(null);
    const inputNomeRef = useRef(null);
    const inputDataRef = useRef(null);
    const inputImageRef = useRef(null);

    const [alert, setAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")
    const [selectGenero, setSelectGenero] = useState();

    const navigate = useNavigate();

    const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png']


    const handleRegisto = async (e) => {
        e.preventDefault()
        
        if (inputPassword1Ref.current.value === inputPassword2Ref.current.value) {
            
            let file = null;

            if (inputImageRef.current.files.length > 0) {
                file = inputImageRef.current.files[0]
                if(!validFileTypes.find(type => type === file.type)) {
                    setAlertMsg("Ficheiro deve possuir formatos JPG ou PNG!")
                    setAlert(true)
                    return;
                }
            }

            const formData = new FormData()

            formData.append("nome", inputNomeRef.current.value)
            formData.append("email", inputEmailRef.current.value)
            formData.append("password", inputPassword1Ref.current.value)
            formData.append("dataNascimento", inputDataRef.current.value)
            formData.append("genero", selectGenero)
            formData.append("fotoPerfil", file)
    
            axios.post(`${API_URL}/users/registo`, formData, { headers: {'Content-Type': 'multipart/form-data'}})
                .then(response => {
                    navigate("/login")
                })
                .catch(e => {
                    switch (e.response.status) {
                        case 501:
                            setAlertMsg("Utilizador já existe!")
                            break
                        default:
                            setAlertMsg("Algo correu mal!")
                            break
                    }
                    setAlert(true)
                })
            
        } else {
            setAlertMsg("Passwords são diferentes!")
            setAlert(true)
        }

    }

    useEffect(() => {
        window.scrollTo(0, 0);
    },[])

    return (
        <>
        <NavbarDynamic/>
        <form className="login-info-form w3-mobile" onSubmit={handleRegisto} style={{marginTop:"-30px"}}>
            <h1>Registo utilizador</h1>
            <div className="campoDados">
                <p style={{color: "red", marginBottom:"10px", paddingTop:(alert?"10px":"")}}>{alert ? alertMsg : ''}</p>
                <input ref={inputEmailRef} id="email" type="email" placeholder="Email" required></input><br/>
                <input ref={inputPassword1Ref} id="password1" type="password" placeholder="Password" required></input><br/>
                <input ref={inputPassword2Ref} id="password2" type="password" placeholder="Repeat Password" required></input><br/>
                <input ref={inputNomeRef} id="name" type="text" placeholder="Nome" required></input><br/>
                <input ref={inputDataRef} id="date" type="date" placeholder="Data de Nascimento" required></input><br/>
                <select value={selectGenero} id="genero" name="Género" onChange={e => setSelectGenero(e.target.value)} required>
                    <option value="">Indique o seu género</option>
                    <option value="0">Masculino</option>
                    <option value="1">Feminino</option>
                </select><br/>
                <input className="w3-file" ref={inputImageRef} id="file" type="file"></input>
            </div>
            <div className="butoesAcceptBack" style={{ marginBottom: "50px" }}>
                <Link to="/"><button type="button" className="buttonCancel buttonBlack">Cancel</button></Link>
                <button type="submit" className="buttonAccept buttonOrange">Registo</button>
            </div>
        </form>
        </>
    )
        
}