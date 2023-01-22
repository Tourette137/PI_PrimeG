import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import CalendarioDisplay from "./CalendarioDisplay.jsx";

const API_URL="http://localhost:3000"

export function Calendario(props) {

    const [calendarioGrupos,setCalendarioGrupos] = useState([]);
    const [calendarioElim,setCalendarioElim] = useState([]);
    const id = props.id;
    const tipoTorneio = props.tipoTorneio;

    const searchCalendarioGrupos = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/calendario/grupos`);
        if (response.status === 200) {
            const data = await response.json();
            setCalendarioGrupos(data);
        }
        else {
            setCalendarioGrupos([]);
        }
    }

    const searchCalendarioElim = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/calendario/eliminatorias`);
        if (response.status === 200) {
            const data = await response.json();
            setCalendarioElim(data);
        }
        else {
            setCalendarioElim([]);
        }
    }

    useEffect(() => {
        searchCalendarioGrupos();
        searchCalendarioElim();
      },[])

    return(
        <>
        {(tipoTorneio == 0 || tipoTorneio == 2 || tipoTorneio == 3 || tipoTorneio == 5 || tipoTorneio == 6 || tipoTorneio == 7)?
            ((calendarioGrupos.length>0)?
                <>
                <div className="calendarioGrupos">
                <h2> Calendário Grupos: </h2>
                <br/>
                <ul>
                {calendarioGrupos.map((calendario) => (
                <li><CalendarioDisplay calendario = {calendario}/></li>
                ))}
                </ul>
                </div>
                <br/>
                {(calendarioElim.length>0)?
                <div className="calendarioElim">
                <h2> Calendário Fase eliminatória: </h2>
                <br/>
                <ul>
                {calendarioElim.map((calendario) => (
                <li><CalendarioDisplay calendario = {calendario}/></li>
                ))}
                </ul>
                </div>
                :
                <h3>Ainda não foi sorteada a fase eliminatória!</h3>
                }
                </>
                :
                <h3>Ainda não foi sorteada a fase de grupos!</h3>
            )
            :((calendarioElim.length>0)?
                <div className="calendarioElim">
                <h2> Calendário Fase eliminatória: </h2>
                <br/>
                <ul>
                {calendarioElim.map((calendario) => (
                <li><CalendarioDisplay calendario = {calendario}/></li>
                ))}
                </ul>
                </div>
                :
                <h3>Ainda não foi sorteada a fase eliminatória!</h3>
            )
        } 
        </>
    )
}


