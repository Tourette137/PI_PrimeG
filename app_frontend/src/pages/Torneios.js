//Página que lista todo o tipo de torneios com os filtros adequados.
import {useState,useEffect} from 'react';
//import TorneioDisplay from "./TorneioDisplay.jsx";
import TorneioCard from "../components/TorneioCard.js";
import {Link,Route,Routes} from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import '../components/RadioForm.css';
import '../components/selectForm.css';
import '../components/containerTorneios.css';
import '../components/titulo.css';

const API_URL="http://localhost:3000"
export function Torneios() {

    const [federado,setFederado] = useState("");
    const [localidade,setLocalidade] = useState("");
    const [desporto,setDesporto] = useState("");
    const [torneios,setTorneios] = useState([]);

    const [tipo,setTipo] = useState("disponiveis");
    const [localidades,setLocalidades] = useState([]);
    const [desportos,setDesportos] = useState([]);
    const navigate = useNavigate();

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
            setTorneios(data);
        }
        else {
            setTorneios([]);
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
        window.scrollTo(0, 0);
        searchLocalidades();
        searchDesportos();
      },[])

      //Search dos torneios inicialmente e depois do tipo ser alterado.
      useEffect(() => {
        searchTorneios(tipo);
      },[tipo,localidade,desporto,federado]);

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

      //Para mudar o filtro de federado
      const handleFederado = async(event) => {
        if (event.target.value === "indiferente") setFederado("");
        else setFederado(event.target.value);
      };

      //Para redirecionar para a página de registo

      const handleRegisto = async (e) => {
        e.preventDefault()
        navigate("/torneios/registo")
    }


    return(
        <>
        <NavbarDynamic/>
       {/*Aqui seleciona o tipo de torneio que quer mostrar.*/}
        <div className='titulo pt-8 pb-3'>
          <h1>Torneios</h1>
        </div>
        
        <div>
          <div className="viagem-form w3-mobile" onChange={handleTipo}>
              <form>
                <div className="w3-row-padding w3-mobile">
                  <div className = "w3-quarter w3-center w3-mobile radio-item">
                    <input type="radio" id="disponiveis" value="disponiveis" name="torneios" checked={("disponiveis"===tipo) ? "checked" : ""}/>
                    <label for="disponiveis" style={{justifyContent:"center"}}>Disponiveis</label><br/>
                  </div>

                  <div className = "w3-quarter w3-center w3-mobile radio-item">
                    <input type="radio" id="emBreve" value="emBreve" name="torneios" checked={("emBreve"===tipo) ? "checked" : ""}/>
                    <label for="emBreve" style={{justifyContent:"center"}}>Em Breve</label><br/>
                  </div>

                  <div className = "w3-quarter w3-center w3-mobile radio-item">
                    <input type="radio" id="aDecorrer" value="aDecorrer" name="torneios" checked={("aDecorrer"===tipo) ? "checked" : ""}/>
                    <label for="aDecorrer" style={{justifyContent:"center"}}>Decorrer</label><br/>
                  </div>

                  <div className = "w3-quarter w3-center w3-mobile radio-item">
                    <input type="radio" id="encerrados" value="encerrados" name="torneios" checked={("encerrados"===tipo) ? "checked" : ""}/>
                    <label for="encerrados" style={{justifyContent:"center"}}>Encerrados</label><br/>
                  </div>
                </div>
              </form>
          </div>
        </div>

        <div className="flex flex-wrap containerDiv">
          <div className='filtros lg:w-1/3'>
            <form>
              <label className='label'>Localidade: </label>
                <div className = "select">
                  <select className="pl-4 text-black" onChange={handleLocalidade}>
                      <option defaultValue="Todas">Indiferente</option>
                      {localidades.map((localidade) => (
                          <option value ={localidade.idLocalidade}>{localidade.Nome}</option>
                      ))}
                  </select>
                </div>
              <label className='label'>Desporto: </label>
                <div className = "select">
                  <select className="pl-4 text-black" onChange={handleDesporto}>
                      <option defaultValue="Todos">Indiferente</option>
                      {desportos.map((desporto) => (
                          <option value ={desporto.idDesporto}>{desporto.nomeDesporto}</option>
                      ))}
                  </select>
                </div>
              <label className='label'>Federado: </label>
                <div className = "select">
                  <select className="pl-4 text-black" onChange={handleFederado}>
                      <option defaultValue="Indiferente">Indiferente</option>
                      <option value="1">Sim</option>
                      <option value="0">Não</option>
                  </select>
                </div>
            </form>
            <div className="butoesRegistoEspacoTorneio" style={{marginBottom: "20px"}}>
              <button onClick={handleRegisto}>Registe aqui o seu torneio</button>
            </div>
          </div>


          <div className="flex flex-wrap place-content-center w-full lg:w-2/3">
            {torneios.length > 0
            ? torneios.map((torneio) => (
                <Link to={"/torneios/" + torneio.idTorneio}><TorneioCard torneio = {torneio}/></Link>
              ))
            : <h2 className="text-4xl text-center">Não existem torneios!</h2>}
          </div>
        </div>

        </>
    )
}
