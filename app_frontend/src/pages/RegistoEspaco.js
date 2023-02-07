import {useRef, useState,useEffect} from 'react';
import {useNavigate } from 'react-router-dom'
import axios from 'axios';
import {Link} from 'react-router-dom';
import {NavbarDynamic} from '../components/NavbarDynamic.js';

const API_URL="http://localhost:3000"



export function RegistoEspaco() {

    const [desporto,setDesporto] = useState("");
    const [localidade,setLocalidade] = useState("");

    //Variáveis para depois criarmos o espaço se ele pretender

    const inputnomeEspacoRef = useRef(null);
    const inputruaEspacoRef = useRef(null);
    const inputContactoEspacoRef = useRef(null);
    const inputNMesasRef = useRef(null);
    const inputImageRef = useRef(null);

    //Variáveis auxiliares para guardar os espaços,localidades e torneios da BD e a espaçosFav para ver se mostramos
    // espaços sugeridos ou se ele quer introduzir ele mesmo o espaço

    const [desportos, setDesportos] = useState([]);
    const [localidades,setLocalidades] = useState([]);


    const navigate = useNavigate();

    const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png']

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

    //Procura inicial de desportos para ele registar um torneio por desporto, procura também as localidades para caso ele queira adicionar o espaço
    useEffect(() => {
        window.scrollTo(0, 0);
        searchLocalidades();
        searchDesportos();
    },[])

    const handleRegisto = async (e) => {
        e.preventDefault();

        let file = null;

        if (inputImageRef.current.files.length > 0) {
            file = inputImageRef.current.files[0]
            if(!validFileTypes.find(type => type === file.type)) {
                //setAlertMsg("Ficheiro deve possuir formatos JPG ou PNG!")
                //setAlert(true)
                return;
            }
        }

        const headers = {
            "authorization": "Bearer " +localStorage.getItem("token"),
            'Content-Type': 'multipart/form-data'
        }
        const formData = new FormData()

            formData.append("nome",inputnomeEspacoRef.current.value)
            formData.append("rua",inputruaEspacoRef.current.value)
            formData.append("contacto",inputContactoEspacoRef.current.value)
            formData.append("localidade",localidade)
            formData.append("desporto",desporto)
            formData.append("nMesas",inputNMesasRef.current.value)
            formData.append("fotoEspaco" , file)
        

        axios.post(`${API_URL}/espacos/registarEspaco`, formData,{headers: headers})
            .then(response => {
            const idEspaco = response.data.idEspaco
            navigate(`/espacos`)
        }).catch(e => console.log(e))
    }


    return (
        <>
        <NavbarDynamic/>
        <div class="bg-gray-100  min-h-screen">
        <div class="flex flex-col items-center justify-center px-6 pt-4 py-8 mx-auto">
        <div class="w-full bg-white rounded-lg shadow mt-8 sm:max-w-md xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-orange-500 md:text-2xl text-center">
                  Registe aqui o seu espaço
              </h1>
                <form class="space-y-4 md:space-y-6" onSubmit={handleRegisto}>
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
                                 ref={inputContactoEspacoRef} id="contactoEspaco" type="tel" pattern="^9[0-9]{8}$" placeholder="916912569" required></input>
                            </div>

                            <div>
                            <label for="text" class="block mb-2 text-base font-bold text-gray-900 ">Numéro de campos do Espaço:</label>
                                <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                                 ref={inputNMesasRef} id="nMesasEspaco" type="number" min="1" placeholder="1" required></input>
                            </div>
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
                    
                    <button type="submit" class="w-full text-white bg-orange-500 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Registar</button>
                </form>
                </div>
            </div>
        </div>
        </div>
        </>
    )
}
