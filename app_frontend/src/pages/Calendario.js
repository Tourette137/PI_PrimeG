import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import CalendarioDisplay from "../components/CalendarioDisplay.js";
import {useParams} from 'react-router-dom'

const API_URL="http://localhost:3000"

export function Calendario(props) {

    const [calendarioGrupos,setCalendarioGrupos] = useState([]);
    const [calendarioElim,setCalendarioElim] = useState([]);

    const {id} = useParams()
    const tipoTorneio = props.tipoTorneio;

    const searchCalendarioGrupos = async () => {
        const response = await fetch (`${API_URL}/torneios/${id}/calendario/grupos`);
        if (response.status === 200) {
            const data = await response.json();
            setCalendarioGrupos(data);
            console.log(data);
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
            console.log(data);
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
        <div>
            {calendarioGrupos.length > 0 
            ? <CalendarioDisplay calendario = {calendarioGrupos} tipo = "1"/>
            : (tipoTorneio != 1 && tipoTorneio != 4) 
                ? <div class="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-200" role="alert">
                        <span class="font-medium">Os jogos da fase de grupos ainda não foram sorteados!</span>
                    </div>
                : null
            }

            {calendarioElim.length > 0
            ? <CalendarioDisplay calendario = {calendarioElim} tipo = "2"/>
            : (tipoTorneio != 0 && tipoTorneio != 3)
                ? <div class="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-200" role="alert">
                    <span class="font-medium">Os jogos da fase de eliminatórias ainda não foram sorteados!</span>
                </div>
                : null
            }
        </div>
    )
}
