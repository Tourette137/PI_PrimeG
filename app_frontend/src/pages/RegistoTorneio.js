import {useRef, useState,useEffect} from 'react';
import {useNavigate } from 'react-router-dom'
import axios from 'axios';
import EspacoCardAux from '../components/EspacoCardAux.js';
import EspacoCard from '../components/EspacoCard';
import {NavbarDynamic} from '../components/NavbarDynamic.js';

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
    const [espacoSelecionado,setEspacoSelecionado] = useState(0);
    const [localidade,setLocalidade] = useState("");
    const [genero,setGenero] = useState();

    //Estados auxiliares:
    const [aMostrar,setaMostrar] = useState(0)

    //Variáveis para depois criarmos o espaço se ele pretender

    const inputnomeEspacoRef = useRef(null);
    const inputruaEspacoRef = useRef(null);
    const inputContactoEspacoRef = useRef(null);
    const inputNMesasRef = useRef(null);
    const inputImageRef = useRef(null);

    //Variáveis auxiliares para guardar os espaços,localidades e torneios da BD e a espaçosFav para ver se mostramos
    // espaços sugeridos ou se ele quer introduzir ele mesmo o espaço

    const [espacos,setEspacos] = useState([]);
    const [desportos, setDesportos] = useState([]);
    const [espacosFav,setEspacosFav] = useState(true)
    const [localidades,setLocalidades] = useState([]);

    const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png']


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
            setEspaco(data[0].idEspaco);
        }
        else {
            setEspacos([]);
        }
    }

    //Procura inicial de desportos para ele registar um torneio por desporto, procura também as localidades para caso ele queira adicionar o espaço
    useEffect(() => {
        window.scrollTo(0, 0);
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
        e.preventDefault();
        if (e.target.value == "espacosFav") {
            setEspacosFav(true);
        }
        else{
            setEspacosFav(false);
        }
        console.log(e.target.value)
        console.log(espacosFav)
    }
    const handleProxEspaco = async(e) => {
        e.preventDefault();
        if (aMostrar < espacos.length-1) {
            console.log("aumentou")
            setaMostrar(aMostrar +1);
        }
    }

    const handlePrevEspaco = async(e) => {
        e.preventDefault();
        if (aMostrar > 0) {
            console.log("diminuiu")
            setaMostrar(aMostrar -1);
        }
    }


    const handleSelectEstado = async(e) => {
        e.preventDefault();
        setEspaco(espacos[aMostrar].idEspaco);
        setEspacoSelecionado(aMostrar)
    }

    const handleRegisto = async (e) => {
        e.preventDefault();
        const headers = {
            "authorization": "Bearer " +localStorage.getItem("token"),
            'Content-Type': 'multipart/form-data'
        }
        let file = null;

            if (inputImageRef.current.files.length > 0) {
                file = inputImageRef.current.files[0]
                if(!validFileTypes.find(type => type === file.type)) {
                    //setAlertMsg("Ficheiro deve possuir formatos JPG ou PNG!")
                    //setAlert(true)
                    return;
                }
            }

        if(espacosFav) {
            if (espacos.length>0){
                const formData = new FormData()
                formData.append("nomeTorneio", inputnomeTorneioRef.current.value)
                formData.append("idDesporto", desporto)
                formData.append("isFederado", federado)
                formData.append("dataTorneio", inputDataTorneioRef.current.value)
                formData.append("escalao", escalao)
                formData.append("tipoTorneio", tipoTorneio)
                formData.append("Espaco_idEspaco", espaco)
                formData.append("tamEquipa", inputtamEquipaRef.current.value)
                formData.append("genero", genero)
                formData.append("fotoTorneio" , file)
                
                axios.post(`${API_URL}/torneios/registo`, formData,{headers: headers})
                    .then(response => {
                        let idTorneio = response.data.idTorneio
                        navigate(`/torneios/${idTorneio}`)
                    })
                    .catch(e => console.log(e))
                }
        }
        else{
            const formData = new FormData()

                formData.append("nome", inputnomeEspacoRef.current.value)
                formData.append("rua", inputruaEspacoRef.current.value)
                formData.append("contacto", inputContactoEspacoRef.current.value)
                formData.append("localidade", localidade)
                formData.append("desporto", desporto)
                formData.append("nMesas", inputNMesasRef.current.value)
                formData.append("fotoEspaco",null)

            axios.post(`${API_URL}/espacos/registoNFavorito`, formData,{headers: headers})
                .then(response => {
                    const idEspaco = response.data.idEspaco
                    
                    const formData = new FormData()

            
                    formData.append("nomeTorneio", inputnomeTorneioRef.current.value)
                    formData.append("idDesporto", desporto)
                    formData.append("isFederado", federado)
                    formData.append("dataTorneio", inputDataTorneioRef.current.value)
                    formData.append("escalao", escalao)
                    formData.append("tipoTorneio", tipoTorneio)
                    formData.append("Espaco_idEspaco", idEspaco)
                    formData.append("tamEquipa", inputtamEquipaRef.current.value)
                    formData.append("genero", genero)
                    formData.append("fotoTorneio" , file)
                    axios.post(`${API_URL}/torneios/registo`,formData,{headers:headers})
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
        <NavbarDynamic/>
        <div class="bg-gray-100  min-h-screen">
        <div class="flex flex-col items-center justify-center px-6 pt-4 py-8 mx-auto">
        <div class="w-full bg-white rounded-lg shadow mt-8 sm:max-w-md xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-orange-500 md:text-2xl text-center">
                  Registe aqui o seu torneio
              </h1>
                <form class="space-y-4 md:space-y-6" onSubmit={handleRegisto}>
                    <div>
                    <label for="text" class="block mb-2 text-base font-bold text-gray-900 ">Nome: </label>
                        <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                        ref={inputnomeTorneioRef} id="nomeTorneio" type="nomeTorneio" placeholder="Nome do Torneio" required></input>
                    </div>


                    <div
                                x-data
                                x-init="flatpickr($refs.datetimewidget, {wrap: true, enableTime: true, dateFormat: 'M j, Y h:i K'});"
                                x-ref="datetimewidget"
                                class="flatpickr container mx-auto col-span-6 sm:col-span-6 mt-5"
                                >
                                <label for="datetime" class="flex-grow  block font-medium text-sm text-gray-700 mb-1">Data:</label>
                                <div class="flex align-middle align-content-center">
                                    <input
                                        ref={inputDataTorneioRef}
                                        x-ref="datetime"
                                        type="datetime-local"
                                        id="datetime"
                                        data-input
                                        placeholder="Data do Torneio"
                                        required
                                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        
                                        />
                                </div>

                            </div>

                                <script src="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.9/flatpickr.min.js"></script>
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.9/themes/airbnb.min.css"/>
                                <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.js" defer></script>

                    <div>
                        <label  class="block mb-2 text-base font-bold text-gray-900">Desporto: </label>
                        <select className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                         value={desporto} id="desporto" name="Desporto" onChange={e => setDesporto(e.target.value)} required>
                        <option value="">Indique o desporto pretendido</option>
                            {desportos.map((desporto) => (
                                <option value ={desporto.idDesporto}>{desporto.nomeDesporto}</option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label  class="block mb-2 text-base font-bold text-gray-900">Localidade: </label>
                        <select className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" id="localidade" name="Localidade" onChange={e => setLocalidade(e.target.value)} required>
                        <option value="">Indique a localidade pretendida</option>
                            {localidades.map((localidade) => (
                                <option value ={localidade.idLocalidade}>{localidade.Nome}</option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label  class="block mb-2 text-base font-bold text-gray-900">Tipo do torneio: </label>
                        <select className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" value={tipoTorneio} id="tipoTorneio" name="tipoTorneio" onChange={e => setTipoTorneio(e.target.value)} required>
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
                    </div>
                    <div>
                        <label  class="block mb-2 text-base font-bold text-gray-900">Federado: </label>
                        <select className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" value={federado} id="federado" name="Federado" onChange={e => setFederado(e.target.value)} required>
                            <option value="">Indique se pretende que o torneio seja federado</option>
                            <option value="1">Federado</option>
                            <option value="0">Amador</option>
                        </select>
                    </div>
                    <div>
                        <label  class="block mb-2 text-base font-bold text-gray-900">Escalão: </label>
                        <select className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" value={escalao} id="escalao" name="Escalao" onChange={e => setEscalao(e.target.value)} required>
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
                    </div>
                    <div>
                        <label  class="block mb-2 text-base font-bold text-gray-900">Género: </label>
                        <select className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" value={genero} id="genero" name="Genero" onChange={e => setGenero(e.target.value)} required>
                            <option value="">Indique o género pretendido</option>
                            <option value="0">Masculino</option>
                            <option value="1">Feminino</option>
                            <option value="2">Indiferente</option>
                        </select>
                    </div>
                    <div>
                        <label for="number" class="block mb-2 text-base font-bold text-gray-900">Número de Elementos por Equipa:</label>
                        <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                         ref={inputtamEquipaRef} id="tamEquipa" type="number" min="1" placeholder="1" required></input>
                    </div>

                    <div class="flex justify-center">
                        <div class="mb-3 w-96">
                        <label for="formfile" class="block mb-2 text-base font-bold text-gray-900">Imagem do torneio:</label>
                            <input class="form-control
                            block
                            w-full
                            px-3
                            py-1.5
                            text-base
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding
                            border border-solid border-gray-300
                            rounded
                            transition
                            ease-in-out
                            m-0
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" ref={inputImageRef} type="file" id="formFile"/>
                        </div>
                    </div>

                    <ul class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
                        <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                            <div class="flex items-center pl-3">
                            <input id="horizontal-list-radio-license" 
                                type="radio" 
                                value="espacosFav" 
                                name="espacosFav" 
                                class="form-check-input form-radio w-4 h-4 text-blue-600 bg-gray-100 border-gray-300" 
                                checked={espacosFav} 
                                onChange={handleEspaco} />
                            <label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900">Escolher um espaço</label>
                            </div>
                        </li>
                        <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                            <div class="flex items-center pl-3">
                            <input id="horizontal-list-radio-id" 
                                type="radio" 
                                value="espacosMan" 
                                name="espacosMan" 
                                class="form-check-input form-radio w-4 h-4 text-blue-600 bg-gray-100 border-gray-300" 
                                checked={!espacosFav} 
                                onChange={handleEspaco}/>
                            <label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900">Inserir manualmente</label>
                            </div>
                        </li>
                    </ul>

                        {espacosFav ?
                            (desporto !== "" && localidade !== "" ?
                            (espacos?.length > 0
                                ? (
                                    <div class="relative items-center">
                                        {(aMostrar == espacoSelecionado)?
                                        (
                                            <div className="grid mx-auto place-content-center" onClick={handleSelectEstado}>
                                            <EspacoCardAux url={espacos[aMostrar].imageUrl} nome = {espacos[aMostrar].nome} rua = {espacos[aMostrar].rua} contacto = {espacos[aMostrar].contacto}/>
                                            </div>
                                        )
                                        :
                                        (
                                            <div className="grid mx-auto place-content-center" onClick={handleSelectEstado}>
                                            <EspacoCard url={espacos[aMostrar].imageUrl} nome = {espacos[aMostrar].nome} rua = {espacos[aMostrar].rua} contacto = {espacos[aMostrar].contacto}/>
                                            </div>
                                        )
                                    }
                                        <button type="button" onClick={handlePrevEspaco} class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" >
                                            <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-300 group-hover:orange-500  group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                                                <svg aria-hidden="true" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                                                <span class="sr-only">Previous</span>
                                            </span>
                                        </button>
                                        <button type="button" onClick={handleProxEspaco} class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
                                            <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-300 group-hover:orange-500  group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                                                <svg aria-hidden="true" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                                                <span class="sr-only">Next</span>
                                            </span>
                                        </button>
                                    </div>
                                )
                                : (<div class="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-200" role="alert">
                                <span class="font-medium">Não existem espaços para esse desporto nessa localidade!</span>
                                    </div>)
                                )
                                :
                                (<div class="p-4 mb-4 w-full text-sm text-yellow-800 rounded-lg bg-yellow-200" role="alert">
                                <span class="font-medium">Selecione um desporto e uma localidade!</span>
                                    </div>)
                            )
                            
                            : ( <>
                            <div>
                            <label for="text" class="block mb-2 text-base font-bold text-gray-900 ">Nome do Espaço:</label>
                                <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                                ref={inputnomeEspacoRef} id="nomeEspaco" type="nomeEspaco" placeholder="Nome do Espaço" required></input>
                            </div>

                            <div>
                            <label for="text" class="block mb-2 text-base font-bold text-gray-900 ">Nome da Rua:</label>
                                <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                                 ref={inputruaEspacoRef} id="ruaEspaco" type="ruaEspaco" placeholder="Nome da Rua" required></input>
                            </div>

                            <div>
                            <label for="text" class="block mb-2 text-base font-bold text-gray-900 ">Contacto do Espaço:</label>
                                <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                                 ref={inputContactoEspacoRef} id="contactoEspaco" type="tel" pattern="9[0-9]{8}" placeholder="916912569" required></input>
                            </div>

                            <div>
                            <label for="text" class="block mb-2 text-base font-bold text-gray-900 ">Numéro de campos do Espaço:</label>
                                <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                                 ref={inputNMesasRef} id="nMesasEspaco" type="number" min="1" placeholder="1" required></input>
                            </div>
                            </>)
                        }
                    <button type="submit" class="w-full text-white bg-orange-500 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Registar</button>
                </form>
                </div>
            </div>
        </div>
        </div>
        </>
    )
}
