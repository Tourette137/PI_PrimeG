//Componente de um único Espaco

import {useParams} from 'react-router-dom'
import {useState,useEffect} from 'react';
import EspacoDisplay from "./EspacoDisplay.jsx";
import {Link} from 'react-router-dom';
import {NavbarDynamic} from '../components/NavbarDynamic.js';

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
        <NavbarDynamic/>
            <h1>Página do espaco {id}</h1>
        {espaco !== ""
        ? (<div className = "Espaco">
          <EspacoDisplay nome = {espaco.nome} rua = {espaco.rua} contacto = {espaco.contacto} desporto = {espaco.nomeDesporto} localidade = {espaco.localidade} numeroMesas = {espaco.numeroMesas}/>
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
