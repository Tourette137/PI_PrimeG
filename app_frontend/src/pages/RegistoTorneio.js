import {useRef, useState,useEffect} from 'react';
import {useNavigate } from 'react-router-dom'
import axios from 'axios';

const API_URL="http://localhost:3000"

export function RegistoTorneio() {

    //Variáveis para depois criarmos o torneio

    const inputnomeTorneioRef = useRef(null);
    const inputDataTorneioRef = useRef(null);
    const inputtamEquipaRef = useRef(null);

    const [desporto,setDesporto] = useState("");
    const [federado,setFederado] = useState();
    const [escalao,setEscalao] = useState();
    const [tipoTorneio,setTipoTorneio] = useState();
    const [espaco,setEspaco] = useState();
    const [localidade,setLocalidade] = useState("");
    const [genero,setGenero] = useState();

    //Variáveis para depois criarmos o espaço se ele pretender

    const inputnomeEspacoRef = useRef(null);
    const inputruaEspacoRef = useRef(null);
    const inputContactoEspacoRef = useRef(null);
    const inputNMesasRef = useRef(null);

    //Variáveis auxiliares para guardar os espaços,localidades e torneios da BD e a espaçosFav para ver se mostramos
    // espaços sugeridos ou se ele quer introduzir ele mesmo o espaço

    const [espacos,setEspacos] = useState([]);
    const [desportos, setDesportos] = useState([]);
    const [espacosFav,setEspacosFav] = useState(true)
    const [localidades,setLocalidades] = useState([]);


    const navigate = useNavigate();

    //Função que vai buscar os desportos da Base de Dados
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

    //Função que vai buscar os espaços do desporto da Base de Dados
    const searchEspacosDesporto = async () => {
        const response = await fetch (`${API_URL}/espacos/desporto/${desporto}?localidade=${localidade}`);
        if (response.status === 200) {
            const data = await response.json();
            setEspacos(data);
        }
        else {
            setEspacos([]);
        }
    }

    //Procura inicial de desportos para ele registar um torneio por desporto, procura também as localidades para caso ele queira adicionar o espaço
    useEffect(() => {
        searchLocalidades();
        searchDesportos();
    },[])

    //Procura dos espaços para o desporto sempre que ele muda o desporto
    useEffect(() => {
        if (desporto !== "" && localidade !== "") {
            searchEspacosDesporto();
        }
    },[desporto,localidade]);

    const handleEspaco = async(e) => {
        if (e.target.value === "espacosFav") {
            setEspacosFav(true);
        }
        else{
            setEspacosFav(false);
        }
    }

    const handleRegisto = async (e) => {
        e.preventDefault();

        const headers = {
            "authorization": "Bearer " +localStorage.getItem("token")
        }

        if(espacosFav) {
            const bodyMessage = {
                "nomeTorneio": inputnomeTorneioRef.current.value,
                "idDesporto": desporto,
                "isFederado": federado,
                "dataTorneio": inputDataTorneioRef.current.value,
                "escalao": escalao,
                "tipoTorneio": tipoTorneio,
                "Espaco_idEspaco": espaco,
                "tamEquipa": inputtamEquipaRef.current.value,
                "genero": genero
            }
            axios.post(`${API_URL}/torneios/registo`, bodyMessage,{headers: headers})
                .then(response => {
                    let idTorneio = response.data.idTorneio
                    navigate(`/torneios/${idTorneio}`)
                })
                .catch(e => console.log(e))
        }
        else{
            const bodyEspaco = {
                "nome" : inputnomeEspacoRef.current.value,
                "rua" : inputruaEspacoRef.current.value,
                "contacto" : inputContactoEspacoRef.current.value,
                "localidade" : localidade,
                "desporto" : desporto,
                "nMesas" : inputNMesasRef.current.value
            }

            axios.post(`${API_URL}/espacos/registoNFavorito`, bodyEspaco,{headers: headers})
                .then(response => {
                    const idEspaco = response.data.idEspaco
                    const bodyMessage = {
                        "nomeTorneio": inputnomeTorneioRef.current.value,
                        "idDesporto": desporto,
                        "isFederado": federado,
                        "dataTorneio": inputDataTorneioRef.current.value,
                        "escalao": escalao,
                        "tipoTorneio": tipoTorneio,
                        "Espaco_idEspaco": idEspaco,
                        "tamEquipa": inputtamEquipaRef.current.value,
                        "genero": genero
                    }
                    axios.post(`${API_URL}/torneios/registo`,bodyMessage,{headers:headers})
                    .then(response => {
                        let idTorneio = response.data.idTorneio
                        console.log(idTorneio)
                        navigate(`/torneios/${idTorneio}`)
                    })
                    .catch(e => console.log(e))
                })
                .catch(e => console.log(e))

        }

    }


    return (
        <>
        <h1>Registo de Torneio</h1>
        <form onSubmit={handleRegisto}>
            <div>
                <label>Nome: </label>
                <input ref={inputnomeTorneioRef} id="nomeTorneio" type="nomeTorneio" placeholder="Nome do Torneio" required></input>

                <br/>

                <label>Data: </label>
                <input ref={inputDataTorneioRef} id="date" type="datetime-local" placeholder="Data do Torneio" required></input>

                <br/>

                <label>Desporto: </label>
                <select value={desporto} id="desporto" name="Desporto" onChange={e => setDesporto(e.target.value)} required>
                <option value="">Indique o desporto pretendido</option>
                    {desportos.map((desporto) => (
                        <option value ={desporto.idDesporto}>{desporto.nomeDesporto}</option>
                    ))}
                </select>

                <br/>

                <label>Localidade: </label>
                <select value={localidade} id="localidade" name="Localidade" onChange={e => setLocalidade(e.target.value)} required>
                <option value="">Indique a localidade pretendida</option>
                    {localidades.map((localidade) => (
                        <option value ={localidade.idLocalidade}>{localidade.Nome}</option>
                    ))}
                </select>

                <br/>


                <label>Tipo do torneio: </label>
                <select value={tipoTorneio} id="tipoTorneio" name="tipoTorneio" onChange={e => setTipoTorneio(e.target.value)} required>
                    <option value="">Indique o tipo de torneio pretendido</option>
                    <option value="0">Liga</option>
                    <option value="1">Torneio de Eliminatórias</option>
                    <option value="2">Torneio com fase de grupos e eliminatórias</option>
                    <option value="3">Liga com duas mãos</option>
                    <option value="4">Torneio de Eliminatórias com duas mãos</option>
                    <option value="5">Torneio com fase de grupos com duas mãos e eliminatórias</option>
                    <option value="6">Torneio com fase de grupos e eliminatórias com duas mãos</option>
                    <option value="7">Torneio com fase de grupos e eliminatórias, ambos com duas mãos</option>
                </select>


                <br/>


                <label>Federado: </label>
                <select value={federado} id="federado" name="Federado" onChange={e => setFederado(e.target.value)} required>
                    <option value="">Indique se pretende que o torneio seja federado</option>
                    <option value="1">Federado</option>
                    <option value="0">Não Federado</option>
                </select>


                <br/>

                <label>Escalão: </label>
                <select value={escalao} id="escalao" name="Escalao" onChange={e => setEscalao(e.target.value)} required>
                    <option value="">Indique o escalão pretendido</option>
                    <option value="0">Seniores</option>
                    <option value="1">Sub-21</option>
                    <option value="2">Sub-20</option>
                    <option value="3">Sub-19</option>
                    <option value="4">Sub-18</option>
                    <option value="5">Sub-17</option>
                    <option value="6">Sub-16</option>
                    <option value="7">Sub-15</option>
                    <option value="8">Sub-14</option>
                    <option value="9">Sub-13</option>
                    <option value="10">Sub-12</option>
                    <option value="11">Sub-11</option>
                    <option value="12">Sub-10</option>
                    <option value="13">Sub-9</option>
                    <option value="14">Sub-8</option>
                    <option value="15">Sub-7</option>
                    <option value="16">Sub-6</option>
                    <option value="17">Sub-5</option>
                </select>

                <br/>

                <label>Género: </label>
                <select value={genero} id="genero" name="Genero" onChange={e => setGenero(e.target.value)} required>
                    <option value="">Indique o género pretendido</option>
                    <option value="0">Masculino</option>
                    <option value="1">Feminino</option>
                    <option value="2">Indiferente</option>
                </select>

                <br/>


                <br/>

                <label>Número de Elementos por Equipa: </label>
                    <input ref={inputtamEquipaRef} id="tamEquipa" type="tamEquipa" placeholder="Tamanho da Equipa" required></input>

                    <br/>

                <br/>

                <div onChange={handleEspaco}>
                <input type="radio" value="espacosFav" name="espacosFav" checked={(true===espacosFav) ? "checked" : ""} />Escolher um espaço sugerido
                <input type="radio" value="espacosMan" name="espacosMan" checked={(false===espacosFav) ? "checked" : ""} />Inserir Espaço manualmente
                </div>

                {espacosFav ?
                    (desporto !== "" && localidade !== "" ?
                        (espacos?.length > 0
                        ? (
                        <select value={espaco} id="espaco" name="Espaco" onChange={e => setEspaco(e.target.value)} required>
                            <option value="">Indique o espaço pretendido</option>
                                {espacos.map((espaco) => (
                                    <option value ={espaco.idEspaco}>Nome : {espaco.nome}, Rua: {espaco.rua}, Contacto: {espaco.contacto} </option>
                                ))}
                            </select>
                        )
                        : (<h3>Não existem espaços para esse desporto nessa localidade!</h3>)
                        )
                        :
                        (<h3>Selecione um desporto e uma localidade!</h3>)
                    )
                : ( <>
                    <label>Nome do Espaço: </label>
                    <input ref={inputnomeEspacoRef} id="nomeEspaco" type="nomeEspaco" placeholder="Nome do Espaço" required></input>

                    <br/>

                    <label>Nome da Rua: </label>
                    <input ref={inputruaEspacoRef} id="ruaEspaco" type="ruaEspaco" placeholder="Nome da Rua" required></input>

                    <br/>

                    <label>Contacto do Espaço: </label>
                    <input ref={inputContactoEspacoRef} id="contactoEspaco" type="contactoEspaco" placeholder="Contacto do Espaço" required></input>

                    <br/>

                    <label>Numéro de campos do Espaço: </label>
                    <input ref={inputNMesasRef} id="nMesasEspaco" type="nMesasEspaco" placeholder="Número de campos" required></input>

                    </>)
                }
            </div>
            <button>Registar</button>
        </form>
        </>
    )
}
