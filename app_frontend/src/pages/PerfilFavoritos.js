import TorneioCard from "../components/TorneioCard.js";
import {useNavigate, Link,Route,Routes} from 'react-router-dom';
import {useState,useEffect} from 'react';
import axios from 'axios';
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import '../components/Buttons.css';
import '../components/titulo.css';

const API_URL="http://localhost:3000"

export function PerfilFavoritos() {

    const navigate = useNavigate();
    const [torneios, setTorneios] = useState([]);

    // Handler para voltar ao Perfil
    const handlebackToProfile = async (e) => {
        e.preventDefault()
        navigate("/perfil")
    }

    // Vai a API buscar os torneios favoritos do Utilizador
    const torneiosInscrito = async () => {

        const headers = { "authorization": "Bearer " + localStorage.getItem("token") }

        axios.get(`${API_URL}/users/torneiosFavoritos`, {headers: headers})
                .then(response => {
                    setTorneios(response.data)
                })
                .catch(e => console.log(e))
      }

    // Use Effect inicial
    useEffect(() => {
        window.scrollTo(0, 0);
        torneiosInscrito();
      },[])


    return(
        <>
        <NavbarDynamic/>
        <div className='titulo pt-8 pb-3'>
          <h1>Torneios Favoritos</h1>
        </div>

            {
                torneios?.length > 0 ?
                (
                <div className="container mx-auto" style={{marginTop:"40px"}}>
                    {torneios.map((torneio) => <div style={{marginLeft:"-25px"}}><Link to={"/torneios/" + torneio.idTorneio}><TorneioCard torneio = {torneio}/></Link></div>) }
                </div>
                ) : (
                <div className="empty mt-10 text-center text-xl">
                    <h2>Não possui Torneios Favoritos</h2>
                </div>
                )
            }

        <div className="butoesAcceptBack" style={{marginBottom: "50px", textAlign:"center"}}>
            <button className="buttonBlack" onClick={handlebackToProfile}>Voltar ao Perfil</button>
        </div>
        </>
    )
}