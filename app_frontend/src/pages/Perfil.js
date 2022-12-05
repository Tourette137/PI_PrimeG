import {useNavigate } from 'react-router-dom';

export function Perfil() {

    const navigate = useNavigate();

    const handleTerminarSessao = async (e) => {
        e.preventDefault()

        localStorage.setItem("token", null)
        navigate("/")
    }

    return(
        <>
            <h1>Só entra aqui se tiver o token / estiver logado.</h1>
            <h1>PERFIL UTILIZADOR</h1>

            <button onClick={handleTerminarSessao}>Logout</button>
        </>
    )
}