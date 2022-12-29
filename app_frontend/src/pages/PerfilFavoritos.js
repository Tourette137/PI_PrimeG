import TorneioDisplay from "./TorneioDisplay.jsx";
import {useNavigate, Link,Route,Routes} from 'react-router-dom';
import {useState,useEffect} from 'react';
import axios from 'axios';

const API_URL="http://localhost:3000"

export function PerfilFavoritos() {

    const navigate = useNavigate();

    const handlebackToProfile = async (e) => {
        e.preventDefault()

        navigate("/perfil")
    }

    const [torneios, setTorneios] = useState([]);

    // Vai à API buscar as localidades existentes para que possa escolher uma delas.
    const torneiosInscrito = async () => {

        const headers = {
            "authorization": "Bearer " + localStorage.getItem("token")
        }

        axios.get(`${API_URL}/users/torneiosFavoritos`, {headers: headers})
                .then(response => {
                    setTorneios(response.data)
                })
                .catch(e => console.log(e))
      }

    
    useEffect(() => {
        torneiosInscrito();
      },[])

    return(
        <>
            <h1>Só entra aqui se tiver o token / estiver logado.</h1>
            <h1>TORNEIOS FAVORITOS</h1>

            {
                torneios?.length > 0 ?
                (
                <div className="container">
                    {torneios.map((torneio) => <li><Link to={"/torneios/" + torneio.idTorneio}><TorneioDisplay torneio = {torneio}/></Link></li>) }
                </div>
                ) : (
                <div className="empty">
                    <h2>Nao Tem Torneios</h2>
                </div>
                )
            }

            <button onClick={handlebackToProfile}>Voltar ao Perfil</button>
        </>
    )
}