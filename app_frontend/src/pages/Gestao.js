import {useState,useEffect} from 'react';
import {useParams,useNavigate,useLocation} from 'react-router-dom'
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import {Calendario} from './Calendario.js'
import {GestJogos} from './GestJogos.js'
import {GestTorneio} from './GestTorneio.js';
import {Inscricoes} from './Inscricoes.js';

const API_URL="http://localhost:3000"

export function Gestao() {

    const navigate = useNavigate();
    
    //tipo para ver a que componente dá display.
    const [tipo,setTipo] = useState("inscricoes");
    const [torneio,setTorneio] = useState("");
    
    
    const {id} = useParams()


    //Vai buscar o torneio para ver se a pessoa que entrou na página é o organizador
    const searchTorneio = async () => {
      let requestOptions = {}
      let aux = localStorage.getItem("token");
      let response = null

      if(aux !== "null"){
        requestOptions = {
          headers: {'Authorization': "Bearer " + localStorage.getItem("token")}
        }
        response = await fetch (`${API_URL}/torneios/${id}`,requestOptions);
      }
      else {
        response = await fetch (`${API_URL}/torneios/${id}`);
      }
      if (response.status === 200) {
          const data = await response.json();
          if(!data.isOrganizador) {
            navigate(`/torneios/${id}`)
          }
          setTorneio(data);
      }
      else {
          setTorneio("");
      }
    }



    useEffect(() => {
      searchTorneio();
    },[])

    return(
        <>
        <NavbarDynamic/>
        <h1>Gestão:</h1>
        <div onChange={e => setTipo(e.target.value)}>
            <input type="radio" value="inscricoes" name="gestao" checked={("inscricoes"===tipo) ? "checked" : ""} /> Inscrições
            <input type="radio" value="torneio" name="gestao" checked={("torneio"===tipo) ? "checked" : ""}/> Torneio
            <input type="radio" value="calendario" name="gestao" checked={("calendario"===tipo) ? "checked" : ""}/> Calendário
            <input type="radio" value="jogos" name="gestao" checked={("jogos"===tipo) ? "checked" : ""}/> Jogos
        </div>
        {("inscricoes"===tipo)? (
          <Inscricoes id = {parseInt(id)} inscricoesAbertas = {torneio.inscricoesAbertas}/>
        ):
          (("torneio"===tipo)?
            <GestTorneio id = {parseInt(id)}  tipoTorneio = {torneio.tipoTorneio}/>
            :(("calendario"===tipo)?
              <Calendario id = {parseInt(id)}  tipoTorneio = {torneio.tipoTorneio}/>
              : <GestJogos/>
            )
          )
      }
        </>
    )
}
