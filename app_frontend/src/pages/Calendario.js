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
        <>

          <CalendarioDisplay calendario = {calendarioGrupos} tipo = "1"/>
          <CalendarioDisplay calendario = {calendarioElim} tipo = "2"/>
        </>
    )
}
