import {useState,useEffect} from 'react';
import {useParams} from 'react-router-dom'
import GrupoDisplay from "./GrupoDisplay.jsx";
import ElimDisplay from "./ElimDisplay.jsx";


const API_URL="http://localhost:3000"

export function Classificacao() {
    const {id} = useParams()    
    const [classificacaoGrupo,setClassificacaoGrupo] = useState([]);
    const [classificacaoElim,setClassificacaoElim] = useState([]);

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
            setClassificacaoElim(data);
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
        <h1>Classificação:</h1>

        <br/>

        {classificacaoGrupo?.length > 0 
        ? (
        <div className="grupos">
          <h1> Fase de Grupos: </h1>
          <br/>
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

        {classificacaoElim?.length > 0 
        ? (
        <div className="eliminatorias">
          <h1> Fase Eliminatória: </h1>
          <ul>
          {classificacaoElim.map((elim) => (
            <li><ElimDisplay elim = {elim}/></li>
          ))}
          </ul>
        </div>
        ) 
        : (
        <div className="empty_eliminatorias">
            <h2>Este torneio não contém fase eliminatória!</h2>
        </div>
        )}
        </>
    )
}