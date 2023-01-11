import {useRef, useState,useEffect} from 'react';
import {useNavigate } from 'react-router-dom'
import axios from 'axios';
import {Link} from 'react-router-dom';
import {NavbarDynamic} from '../components/NavbarDynamic.js';

const API_URL="http://localhost:3000"



export function RegistoEspaco() {

    const [desporto,setDesporto] = useState("");
    const [localidade,setLocalidade] = useState("");

    //Variáveis para depois criarmos o espaço se ele pretender

    const inputnomeEspacoRef = useRef(null);
    const inputruaEspacoRef = useRef(null);
    const inputContactoEspacoRef = useRef(null);
    const inputNMesasRef = useRef(null);

    //Variáveis auxiliares para guardar os espaços,localidades e torneios da BD e a espaçosFav para ver se mostramos
    // espaços sugeridos ou se ele quer introduzir ele mesmo o espaço

    const [desportos, setDesportos] = useState([]);
    const [localidades,setLocalidades] = useState([]);


    const navigate = useNavigate();

    //Função que vai buscar os desportos da Base de Dados
    const searchDesportos = async () => {
        const response = await fetch (`${API_URL}/desportos`);
        if (response.status === 200) {
            const data = await response.json();
            setDesportos(data);
        }
        else {
            setDesportos([]);
        }
    }

    // Vai à API buscar as localidades existentes para que possa escolher sobre essa.
    const searchLocalidades = async () => {
        const response = await fetch (`${API_URL}/localidades`);
        if (response.status === 200) {
            const data = await response.json();
            setLocalidades(data);
        }
        else {
            setLocalidades([]);
        }
    }

    //Procura inicial de desportos para ele registar um torneio por desporto, procura também as localidades para caso ele queira adicionar o espaço
    useEffect(() => {
        searchLocalidades();
        searchDesportos();
    },[])

    const handleRegisto = async (e) => {
        e.preventDefault();

        const headers = {
            "authorization": "Bearer " +localStorage.getItem("token")
        }

        const bodyEspaco = {
            "nome" : inputnomeEspacoRef.current.value,
            "rua" : inputruaEspacoRef.current.value,
            "contacto" : inputContactoEspacoRef.current.value,
            "localidade" : localidade,
            "desporto" : desporto,
            "nMesas" : inputNMesasRef.current.value
        }

        axios.post(`${API_URL}/espacos/registoNFavorito`, bodyEspaco,{headers: headers})
            .then(response => {
            const idEspaco = response.data.idEspaco
            navigate(`/espacos/${idEspaco}`)
        }).catch(e => console.log(e))
    }


    return (
        <>
        <NavbarDynamic/>
        <h1>Registo de Espaco</h1>
        <form onSubmit={handleRegisto}>
            <div>
                <label>Desporto: </label>
                <select value={desporto} id="desporto" name="Desporto" onChange={e => setDesporto(e.target.value)} required>
                <option value="">Indique o desporto pretendido</option>
                    {desportos.map((desporto) => (
                        <option value ={desporto.idDesporto}>{desporto.nomeDesporto}</option>
                    ))}
                </select>

                <br/>

                <label>Localidade: </label>
                <select value={localidade} id="localidade" name="Localidade" onChange={e => setLocalidade(e.target.value)} required>
                <option value="">Indique a localidade pretendida</option>
                    {localidades.map((localidade) => (
                        <option value ={localidade.idLocalidade}>{localidade.Nome}</option>
                    ))}
                </select>

                <br/>


                <label>Nome do Espaço: </label>
                <input ref={inputnomeEspacoRef} id="nomeEspaco" type="nomeEspaco" placeholder="Nome do Espaço" required></input>

                <br/>

                <label>Nome da Rua: </label>
                <input ref={inputruaEspacoRef} id="ruaEspaco" type="ruaEspaco" placeholder="Nome da Rua" required></input>

                <br/>

                <label>Contacto do Espaço: </label>
                <input ref={inputContactoEspacoRef} id="contactoEspaco" type="contactoEspaco" placeholder="Contacto do Espaço" required></input>

                <br/>

                <label>Numéro de campos do Espaço: </label>
                <input ref={inputNMesasRef} id="nMesasEspaco" type="nMesasEspaco" placeholder="Número de campos" required></input>
            </div>
            <button>Registar</button>
            <Link to ={"/espacos"}>
              <button>Voltar</button>
            </Link>
        </form>
        </>
    )
}
