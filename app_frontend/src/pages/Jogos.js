import {useParams} from 'react-router-dom'
import {useState,useEffect} from 'react';
import JogoDisplay from "./JogoDisplay.jsx";
//import {Link,Route,Routes} from 'react-router-dom';

const API_URL="http://localhost:3000/torneios"

export function Jogos() {
    const {id} = useParams()
    const [jogos,setJogos] = useState([]);

    const searchJogos = async () => {
        let pedido = API_URL + "/" + id + "/jogos";
        const response = await fetch (pedido);
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            setJogos(data);
        }
        else {
            setJogos([]);
        }
    }

    useEffect(() => {
        searchJogos();
    },[])
    
    return(
        <>
        <h1>Jogos a decorrer</h1>
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
