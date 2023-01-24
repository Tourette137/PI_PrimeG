import {useState,useEffect} from 'react';
import {useParams,useNavigate,useLocation} from 'react-router-dom'
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import {Calendario} from './Calendario.js'
import {GestJogos} from './GestJogos.js'
import {GestTorneio} from './GestTorneio.js';
import {Inscricoes} from './Inscricoes.js';
import queries from '../requests/queries';
import { useQuery } from '@tanstack/react-query';

const API_URL="http://localhost:3000"

export function Gestao() {

    const navigate = useNavigate();

    //tipo para ver a que componente dá display.
    const [tipo,setTipo] = useState("inscricoes");
    const [torneio,setTorneio] = useState("");
    const {id} = useParams();
    const { isLoading, error, data } = useQuery(['gestao-torneio',id], queries['gestao-torneio']);
    const isOrganizador = data?.isOrganizador;


    useEffect(() => {
      if (!isLoading && !error) {
        if (!isOrganizador)
          navigate(`/torneios/${id}`);
      }
    }, [isLoading, error, isOrganizador, id]);

    if (isLoading)
      return "a dar loading";

    if (error)
      return "a dar error";

    return(
        <div className="text-center">
        <h1 className = "text-center p-4 text-6xl font-bold">Gestão</h1>
        <div onChange={e => setTipo(e.target.value)}>
            <input className="" type="radio" value="inscricoes" name="gestao" checked={("inscricoes"===tipo) ? "checked" : ""} /> Inscrições
            <input type="radio" value="torneio" name="gestao" checked={("torneio"===tipo) ? "checked" : ""}/> Torneio
            <input type="radio" value="calendario" name="gestao" checked={("calendario"===tipo) ? "checked" : ""}/> Calendário
            <input type="radio" value="jogos" name="gestao" checked={("jogos"===tipo) ? "checked" : ""}/> Jogos
        </div>
        {("inscricoes"===tipo)? (
          <Inscricoes id={parseInt(id)} inscricoesA = {data.inscricoesAbertas} terminado = {data.terminado}/>
        ):
          (("torneio"===tipo)?
            <GestTorneio id = {parseInt(id)}  tipoTorneio = {data.tipoTorneio} terminado = {data.terminado}/>
            :(("calendario"===tipo)?
              <Calendario id = {parseInt(id)}  tipoTorneio = {data.tipoTorneio}/>
              : <GestJogos/>
            )
          )
        }
        </div>
    )
}
