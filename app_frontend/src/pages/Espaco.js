//Componente de um único Espaco
import EspacoCard from '../components/EspacoCard.js';
import {useParams} from 'react-router-dom'
import {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';

const API_URL="http://localhost:3000"

export function Espaco() {
    const {id} = useParams()
    const [espaco,setEspaco] = useState("");

    // Vai à API buscar a informação do Espaco para dar display na página principal
    const searchEspaco = async () => {
        const response = await fetch (`${API_URL}/espacos/${id}`);
        if (response.status === 200) {
            const data = await response.json();
            setEspaco(data[0]);console.log(data);
        }
        else {
            setEspaco([]);
        }
      }

    //Search inicial do Espaco
    useEffect(() => {
        searchEspaco();
    },[])

    return(
        <>
        <h1>Página do espaco {id}</h1>
        {espaco !== ""
        ? (<div className = "Espaco">
          <EspacoCard nome = {espaco.nome} rua = {espaco.rua} contacto = {espaco.contacto}/>
          </div>
        )
        : (<div className="empty">
            <h2>Não existe esse Espaco!</h2>
            </div>
        )
        }
        <footer>
            <Link to ={"/espacos"}>
              <button>Voltar</button>
            </Link>
        </footer>
        </>
    )
}
