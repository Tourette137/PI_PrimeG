//Página que lista todo o tipo de Espacos com os filtros adequados.
import {useState,useEffect} from 'react';
import EspacoCard from '../components/EspacoCard.js';
import {Link,Route,Routes} from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import {NavbarDynamic} from '../components/NavbarDynamic.js';
import '../components/RadioForm.css';
import '../components/selectForm.css';
import '../components/containerTorneios.css';
import '../components/titulo.css';

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
        window.scrollTo(0, 0);
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
        <div className='titulo pt-8 pb-3'>
          <h1>Espaços</h1>
        </div>

        <div className="viagem-form w3-mobile" onChange={handleTipo}>
            <form>
              <div className="w3-row-padding w3-mobile">
                <div className = "w3-half w3-center w3-mobile radio-item">
                  <input type="radio" id="disponiveis" value="disponiveis" name="espacos" checked={("disponiveis"===tipo) ? "checked" : ""}/>
                  <label for="disponiveis" style={{justifyContent:"center"}}>Todos</label><br/>
                </div>

                <div className = "w3-half w3-center w3-mobile radio-item">
                  <input type="radio" id="favoritos" value="favoritos" name="espacos" checked={("favoritos"===tipo) ? "checked" : ""}/>
                  <label for="favoritos" style={{justifyContent:"center"}}>Favoritos</label><br/>
                </div>
              </div>
            </form>
        </div>

        <div className="flex flex-wrap containerDiv">
          <div className='filtros lg:w-1/3'>
            <form>
              <label className='label'>Localidade:</label>
                <div className = "select">
                  <select className="pl-4 text-black" onChange={handleLocalidade}>
                      <option defaultValue="Todas">Indiferente</option>
                      {localidades.map((localidade) => (
                        <option value ={localidade.idLocalidade}>{localidade.Nome}</option>
                      ))}
                  </select>
                </div>
              <label className='label'>Desporto:</label>
                <div className = "select">
                  <select className="pl-4 text-black" onChange={handleDesporto}>
                      <option defaultValue="Todos">Indiferente</option>
                      {desportos.map((desporto) => (
                        <option value ={desporto.idDesporto}>{desporto.nomeDesporto}</option>
                      ))}
                  </select>
                </div>
              </form>
            
            <div className="butoesRegistoEspacoTorneio" style={{marginBottom: "40px", float:"left"}}>
              <button onClick={handleRegisto}>Registe aqui o seu espaço</button>
            </div>
          </div>

          <div className="espacos flex flex-col place-content-center w-full lg:w-2/3 flex-grow-0">
            <div className="espaco-cards-container" style={{marginBottom: "30px"}}>
              {espacos.length > 0
              ? espacos.map((espaco) => (
                <EspacoCard url={espaco.imageUrl} nome={espaco.nome} rua={espaco.rua} contacto={espaco.contacto} />
                ))
                : <h2 className="text-4xl text-center">Não existem espaços!</h2>}
            </div>
          </div>

        </div>
    </>
    )
}
