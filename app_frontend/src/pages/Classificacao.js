import {useState,useEffect} from 'react';
import {useParams} from 'react-router-dom'
import GrupoDisplay from "../components/GrupoDisplay.js";
import ElimDisplay from "./ElimDisplay.jsx";

const API_URL="http://localhost:3000"

export function Classificacao() {
    const {id} = useParams()
    const [classificacaoGrupo,setClassificacaoGrupo] = useState([]);
    const [classificacaoElim,setClassificacaoElim] = useState([]);
    const [elimSize,setElimSize] = useState(0);

    // Função que vai buscar a classificação dos grupos.
    const searchGrupos = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/classificacao/grupos`);
        if (response.status === 200) {
            const data = await response.json();
            setClassificacaoGrupo(data);
        }
        else {
            setClassificacaoGrupo([]);
        }
      }


    // Função que vai buscar a classificação das eliminatórias.
    const searchElim = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/classificacao/eliminatorias`);
        if (response.status === 200) {
            const data = await response.json();
            console.log(data)
            setClassificacaoElim(data);
            setElimSize(data.length)
        }
        else {
            setClassificacaoElim([]);
        }
      }

    // Vai buscar os grupos e as eliminatórias.
    useEffect(() => {
        searchGrupos();
        searchElim();
      },[])



    return(
        <>
        <div className='titulo'>
          <h1>Classificacao</h1>
        </div>

        {classificacaoGrupo?.length > 0
        ? (
        <div className="grupos">
          <ul>
          {classificacaoGrupo.map((grupo) => (
            <li><GrupoDisplay grupo = {grupo}/></li>
          ))}
          </ul>
        </div>
        )
        : (
        <div className="empty_grupos">
            <h2>Este torneio não contém fase de grupos!</h2>
        </div>
        )}

        <br/>

        {elimSize > 0
        ? (
        <ElimDisplay elim = {classificacaoElim} elimSize = {elimSize}/>
        )
        : (
        <div className="empty_eliminatorias">
            <h2>Este torneio não contém fase eliminatória!</h2>
        </div>
        )}
        </>
    )
}
