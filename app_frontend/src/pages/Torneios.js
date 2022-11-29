//Página que lista todo o tipo de torneios com os filtros adequados.
import {useState,useEffect} from 'react';
import TorneioDisplay from "./TorneioDisplay.jsx";

const API_URL="http://localhost:3000"
export function Torneios() {

    const [federado,setFederado] = useState("");
    const [localidade,setLocalidade] = useState("");
    const [desporto,setDesporto] = useState("");
    const [torneios,setTorneios] = useState([]);
    
    const [tipo,setTipo] = useState("disponiveis");
    const [localidades,setLocalidades] = useState([]);
    const [desportos,setDesportos] = useState([]);


    // Vai buscar os torneios que pretendemos mostrar
    const searchTorneios = async (tipo) => {
        let pedido =`${API_URL}/torneios/${tipo}`
        if (federado !== "" || localidade !== "" || desporto !== "") {
          if(federado !== "") {
            pedido += `?federado=${federado}`;
            if (localidade !== "") pedido += `&localidade=${localidade}`;
            if (desporto !== "") pedido += `&desporto=${desporto}`;
          }
          else {
            if (localidade !== "") {
              pedido +=`?localidade=${localidade}`;
              if (desporto !== "") pedido += `&desporto=${desporto}`;
            }
            else{
              pedido += `?desporto=${desporto}`;
            }
          }
        } 
        const response = await fetch(pedido);
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            setTorneios(data);
        }
        else {
            setTorneios([]);
        }
      }

      // Vai à API buscar as localidades existentes para que possa escolher sobre essa.
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

      //Search inicial dos torneios disponíveis antes de ele selecionar alguma coisa
      //Faz também um search inicial das localidades
      useEffect(() => {
        searchTorneios(tipo);
        searchLocalidades();
        searchDesportos();
      },[])

      //Search quando ele depois seleciona os encerrados ou os a decorrer
      useEffect(() => {
        searchTorneios(tipo);
      },[tipo,localidade,desporto,federado]);

      //Para mudar o tipo de torneio para o que ele selecionar no form.
      const handleTipo = event => {
        setTipo(event.target.value);
      };

      //Para mudar a localidade na qual ele está a procurar
      const handleLocalidade = event => {
        if (event.target.value === "Todas") setLocalidade("");
        else setLocalidade(event.target.value);
      };

      //Para mudar o desporto no qual ele está a procurar
      const handleDesporto = event => {
        if (event.target.value === "Todos") setDesporto("");
        else setDesporto(event.target.value);
      };

      //Para mudar o filtro de federado
      const handleFederado = event => {
        if (event.target.value === "indiferente") setFederado("");
        else setFederado(event.target.value);
      };

    return(
        <>
       {/*Aqui seleciona o tipo de torneio que quer mostrar.*/}
        <h1>Torneios disponíveis </h1>

        <div onChange={handleTipo}>
            <input type="radio" value="disponiveis" name="torneios" checked={("disponiveis"==tipo) ? "checked" : ""} /> Disponíves
            <input type="radio" value="encerrados" name="torneios" checked={("encerrados"==tipo) ? "checked" : ""}/> Encerrados
            <input type="radio" value="aDecorrer" name="torneios" checked={("aDecorrer"==tipo) ? "checked" : ""}/> A Decorrer
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
            <label>Federado: </label>
            <select onChange={handleFederado}>
                <option defaultValue="Indiferente">Indiferente</option>
                <option value="1">Sim</option>
                <option value="0">Não</option>
            </select>
        </form>

        
        {torneios?.length > 0 
        ? (
        <div className="container">
          <ul>
          {torneios.map((torneio) => (
            <li><TorneioDisplay torneio = {torneio}/></li>
          ))}
          </ul>
        </div>
        ) 
        : (
        <div className="empty">
            <h2>Não existem torneios!</h2>
        </div>
     )}

        </>
    )
}