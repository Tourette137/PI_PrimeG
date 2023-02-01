import {useState,useEffect} from 'react';
import {useParams,useNavigate,useLocation} from 'react-router-dom'
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import {Calendario} from './Calendario.js'
import {GestJogos} from './GestJogos.js'
import {GestTorneio} from './GestTorneio.js';
import {Inscricoes} from './Inscricoes.js';
import queries from '../requests/queries';
import { useQuery } from '@tanstack/react-query';
import '../components/RadioForm.css';

const API_URL="http://localhost:3000"

export function Gestao() {

    const navigate = useNavigate();

    //tipo para ver a que componente dá display.
    const [tipo,setTipo] = useState("inscricoes");
    const [torneio,setTorneio] = useState("");
    const {id} = useParams();
    const { isLoading, error, data } = useQuery(['gestao-torneio',id], queries['gestao-torneio']);
    const isOrganizador = data?.isOrganizador;


    const searchTorneio = async () => {
      let response = await fetch (`${API_URL}/torneios/${id}`);
      if (response.status === 200) {
        const data = await response.json();
        setTorneio(data);
      }
    }


    useEffect(() => {
      if (!isLoading && !error) {
        if (!isOrganizador){
          navigate(`/torneios/${id}`);
        }
        else {
          searchTorneio();
        }
      }
    }, [isLoading, error, isOrganizador, id]);

    if (isLoading)
      return "a dar loading";

    if (error)
      return "a dar error";

    return(
        <div className="text-center">
          <h1 className = "text-center p-4 text-6xl font-bold">Gestão</h1>
          <div className="viagem-form w3-mobile radio-list" onChange={e => setTipo(e.target.value)}>
              <form>
                <div className="w3-row-padding w3-mobile">
                  <div className = "w3-quarter w3-center w3-mobile radio-item">
                    <input type="radio" id="inscricoes" value="inscricoes" name="gestao" checked={("inscricoes"===tipo) ? "checked" : ""}/>
                    <label for="inscricoes" style={{justifyContent:"center"}}>Inscrições</label><br/>
                  </div>

                  <div className = "w3-quarter w3-center w3-mobile radio-item">
                    <input type="radio" id="torneio" value="torneio" name="gestao" checked={("torneio"===tipo) ? "checked" : ""}/>
                    <label for="torneio" style={{justifyContent:"center"}}>Torneio</label><br/>
                  </div>

                  <div className = "w3-quarter w3-center w3-mobile radio-item">
                    <input type="radio" id="calendario" value="calendario" name="gestao" checked={("calendario"===tipo) ? "checked" : ""}/>
                    <label for="calendario" style={{justifyContent:"center"}}>Calendário</label><br/>
                  </div>

                  <div className = "w3-quarter w3-center w3-mobile radio-item">
                    <input type="radio" id="jogos" value="jogos" name="gestao" checked={("jogos"===tipo) ? "checked" : ""}/>
                    <label for="jogos" style={{justifyContent:"center"}}>Jogos</label><br/>
                  </div>
                </div>
              </form>
          </div>
          {("inscricoes"===tipo)? (
            <Inscricoes id={parseInt(id)} inscricoesA = {data.inscricoesAbertas} terminado = {data.terminado}/>
          ):
            (("torneio"===tipo)?
              <GestTorneio id = {parseInt(id)}  tipoTorneio = {data.tipoTorneio} terminado = {data.terminado}/>
              :(("calendario"===tipo)?
                <Calendario id = {parseInt(id)}  tipoTorneio = {data.tipoTorneio}/>
                : <GestJogos idTorneio={parseInt(id)} tipoTorneio={torneio.tipoTorneio} desporto={torneio.nomeDesporto} />
              )
            )
          }
        </div>
    )

          
}
