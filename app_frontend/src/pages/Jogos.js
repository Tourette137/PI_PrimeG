import {useParams,useSearchParams} from 'react-router-dom'
import {useState,useEffect} from 'react';
import JogoDisplay from "./JogoDisplay.jsx";
//import {Link,Route,Routes} from 'react-router-dom';

const API_URL="http://localhost:3000/torneios"

export function Jogos() {
    const {id} = useParams();
    const [jogos,setJogos] = useState([]);
    const [tipo,setTipo] = useState("jogosaDecorrer");
    const [filtro,setFiltro] = useState("");
    let [searchParams, setSearchParams] = useSearchParams();

    let tipoTorneio = searchParams.get("t");

    const searchJogos = async (tipo) => {
        let pedido = API_URL + "/" + id + "/" + tipo;

        if (filtro !== "") {
            pedido += `?filtro=${filtro}`;
        }

        const response = await fetch (pedido);
        if (response.status === 200) {
            const data = await response.json();
            //console.log(data);
            setJogos(data);
        }
        else {
            setJogos([]);
        }
    }

    useEffect(() => {
        searchJogos(tipo);
    },[tipo,filtro])
    
    //Para mudar o tipo de jogos para o que ele selecionar no form.
    const handleTipo = event => {
        setTipo(event.target.value);
    };

    //Para mudar o filtro de federado
    const handleFiltro = event => {
        if (event.target.value === "Todos") setFiltro("");
        else setFiltro(event.target.value);
      };

    let showOptions = false;
    if(tipoTorneio == 2 || tipoTorneio == 5 || tipoTorneio == 6 || tipoTorneio == 7) {
        showOptions = true;
    }
    console.log(tipoTorneio);
    return(
        <>
        <h1>Jogos do Torneio</h1>
        <div onChange={handleTipo}>
            <input type="radio" value="jogosPorComecar" name="jogos" checked={("jogosPorComecar"===tipo) ? "checked" : ""} /> Por Começar
            <input type="radio" value="jogosEncerrados" name="jogos" checked={("jogosEncerrados"===tipo) ? "checked" : ""}/> Encerrados
            <input type="radio" value="jogosaDecorrer" name="jogos" checked={("jogosaDecorrer"===tipo) ? "checked" : ""}/> A Decorrer
        </div>

        <br/>
        <br/>

        {showOptions
            ? <form>
                <label>Filtro: </label>
                <select onChange={handleFiltro}>
                    <option defaultValue="Todos">Todos</option>
                    <option value="FaseGrupos">Fase de Grupos</option>
                    <option value="Eliminatorias">Eliminatórias</option>                    
                </select>
              </form>
            : <div></div>
        }
        

        {jogos?.length > 0 
        ? (
        <div className="container">
          <ul>
          {jogos.map((jogo) => (
            <li><JogoDisplay jogo = {jogo}/></li>
          ))}
          </ul>
        </div>
        ) 
        : (
        <div className="empty">
            <h2>Não existem jogos!</h2>
        </div>
     )}

        </>
    )
}

