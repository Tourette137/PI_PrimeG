import {useState,useEffect} from 'react';
import {useParams} from 'react-router-dom'
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import { Calendario } from './Calendario.js';
const API_URL="http://localhost:3000"

export function CalendarioPage() {
    const {id} = useParams();
    const [tipoTorneio,settipoTorneio] = useState();

    const searchTorneio = async () => {
        let response = await fetch (`${API_URL}/torneios/${id}`);
        if (response.status === 200) {
          const data = await response.json();
          settipoTorneio(data.tipoTorneio);
        }
      }

      useEffect(() => {
        window.scrollTo(0, 0);
        searchTorneio();
      }, []);

    return (
        <>
        <NavbarDynamic/>
        <div className='titulo pt-8 pb-3'>
          <h1>Calendário</h1>
        </div>
        <Calendario id = {parseInt(id)}  tipoTorneio = {tipoTorneio}/>
        </>
    )
}