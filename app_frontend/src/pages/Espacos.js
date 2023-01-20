//Página que lista todo o tipo de Espacos com os filtros adequados.
import {useState,useEffect} from 'react';
import EspacoDisplay from "./EspacoDisplay.jsx";
import {Link,Route,Routes} from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import {NavbarDynamic} from '../components/NavbarDynamic.js';

const API_URL="http://localhost:3000"
export function Espacos() {

    const [localidade,setLocalidade] = useState("");
    const [desporto,setDesporto] = useState("");
    const [espacos,setEspacos] = useState([]);

    const [tipo,setTipo] = useState("disponiveis");
    const [localidades,setLocalidades] = useState([]);
    const [desportos,setDesportos] = useState([]);
    const navigate = useNavigate();

    // Vai buscar os Espacos que pretendemos mostrar
    const searchEspacos = async (tipo) => {
        let pedido =`${API_URL}/espacos/${tipo}`


        if (localidade !== "") {
          pedido += `?localidade=${localidade}`;
          if (desporto !== "") pedido += `&desporto=${desporto}`;
        }

        else if (desporto !== "") pedido += `?desporto=${desporto}`;
console.log(pedido);
        const response = await fetch(pedido);
        if (response.status === 200) {
            const data = await response.json();console.log(data);
            console.log(data);
            setEspacos(data);

        }
        else {
            setEspacos([]);
        }
      }

      // Vai à API buscar as localidades existentes para que possa escolher uma delas.
      const searchLocalidades = async () => {
        const response = await fetch (`${API_URL}/localidades`);
        if (response.status === 200) {
            const data = await response.json();
            setLocalidades(data);
        }
        else {
            setLocalidades([]);
        }
      }

      const searchDesportos = async () => {
        const response = await fetch (`${API_URL}/desportos`);
        if (response.status === 200) {
            const data = await response.json();
            setDesportos(data);
        }
        else {
            setDesportos([]);
        }
      }

      //Search inicial das localidades e desportos
      useEffect(() => {
        searchLocalidades();
        searchDesportos();
      },[])

      //Search dos Espacos inicialmente e depois do tipo ser alterado.
      useEffect(() => {
        console.log("entrei aqui");
        searchEspacos(tipo);
      },[tipo,localidade,desporto]);

      //Para mudar o tipo de torneio para o que ele selecionar no form.
      const handleTipo = async(event) => {
          setTipo(event.target.value);
      };

      //Para mudar a localidade na qual ele está a procurar
      const handleLocalidade = async(event) => {
        if (event.target.value === "Todas") setLocalidade("");
        else setLocalidade(event.target.value);
      };

      //Para mudar o desporto no qual ele está a procurar
      const handleDesporto = async(event) => {
        if (event.target.value === "Todos") setDesporto("");
        else setDesporto(event.target.value);
      };

      //Para redirecionar para a página de registo
      const handleRegisto = async (e) => {
        e.preventDefault()
        navigate("/espacos/registo")
    }

    return(
        <>
        <NavbarDynamic/>
       {/*Aqui seleciona o tipo de espaco que quer mostrar.*/}
        <h1>Espaços disponíveis </h1>

         <div onChange={handleTipo}>
             <input type="radio" value="disponiveis" name="espacos" checked={("disponiveis"===tipo) ? "checked" : ""} /> Todos
             <input type="radio" value="favoritos" name="espacos" checked={("favoritos"===tipo) ? "checked" : ""} /> Favoritos
         </div>
        <br/>
        <br/>

        <form>
        <label>Localidade: </label>
            <select onChange={handleLocalidade}>
                <option defaultValue="Todas">Todas</option>
                {localidades.map((localidade) => (
                    <option value ={localidade.idLocalidade}>{localidade.Nome}</option>
                ))}
            </select>
            <br/>
            <br/>
        <label>Desporto: </label>
            <select onChange={handleDesporto}>
                <option defaultValue="Todos">Todos</option>
                {desportos.map((desporto) => (
                    <option value ={desporto.idDesporto}>{desporto.nomeDesporto}</option>
                ))}
            </select>
            <br/>
            <br/>
        </form>


        {espacos?.length > 0
        ? (
        <div className="container">
          <ul>
          {espacos.map((espaco) => (
            <li><Link to ={"/espacos/" + espaco.idEspaco}><EspacoDisplay nome = {espaco.nome} localidade = {espaco.Nome} desporto = {espaco.nomeDesporto} rua = {espaco.rua} contacto = {espaco.contacto} numeroMesas={espaco.numeroMesas} /></Link></li>
          ))}
          </ul>
        </div>
        )
        : (
        <div className="empty">
            <h2>Não existem espaços!</h2>
        </div>
     )}

     <footer>
        <button onClick ={handleRegisto}>Registe aqui o seu espaço</button>
     </footer>

        </>
    )
}
