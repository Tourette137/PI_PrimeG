import {useState,useEffect,useRef} from 'react';
import axios from 'axios';

const API_URL="http://localhost:3000"


//Falta quando for eliminatória não deixar pôr empates
//Não deixar pôr empates para tenis

export function JogoDisplayGest (props) {
    const idTorneio = props.idTorneio;
    const jogo = props.jogo;
    const desporto = props.desporto;
    const isGrupo = props.isGrupo;

    const [sets, setsets] = useState([{equipa1: '0',equipa2: '0'}]);

    const [estado,setEstado] = useState(jogo.estado)

    const [alert, setAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")
    const [alertsucesso, setAlertsucesso] = useState(false)


    let aux1 = null;

    if (desporto != "Tenis" && desporto != "Tenis de mesa" && desporto != "Badminton" && desporto != "Volleyball" && desporto != "Padel" && jogo.resultado != null){
        aux1 = jogo.resultado.split("-");
    }

    let aux2 = 0
    let aux3 = 0
    if (aux1 != null) {
        aux2 = parseInt(aux1[0])
        aux3 = parseInt(aux1[1])
    }

    const [currentValue1, setCurrentValue1] = useState(aux2);
    const [currentValue2, setCurrentValue2] = useState(aux3);

    const inputequipa1 = useRef();
    const inputequipa2 = useRef();

    const iniciarJogo = async (e) => {
        e.preventDefault();
        if (alert) {
            setAlert(false);
        }
        if (alertsucesso) {
            setAlertsucesso(false);
        }
        if(jogo.hasOwnProperty('nomeEquipa1') && jogo.hasOwnProperty('nomeEquipa2')){
            const headers = {
                "authorization": "Bearer " +localStorage.getItem("token")
            }

            const  response = await axios.post(`${API_URL}/torneios/${idTorneio}/gestao/${jogo.idJogo}/comecarJogo`,[],{headers: headers})
            if (response.status == 200) {
                    setEstado(1);
            }
            else {
                setEstado(0);
            }
        }
        else{
            setAlertMsg("O jogo ainda não tem ambas as equipas!")
            setAlert(true)
        }
    }

    const atualizarResultado = async (e) =>  {
        e.preventDefault();
        if (alert) {
            setAlert(false);
        }
        if (alertsucesso) {
            setAlertsucesso(false);
        }
        const headers = {
            "authorization": "Bearer " +localStorage.getItem("token")
        }

        let bodyMessage = []
        if (desporto != "Tenis" && desporto != "Tenis de mesa" && desporto != "Badminton" && desporto != "Volleyball" && desporto != "Padel") {
            bodyMessage = {
                "resultado": inputequipa1.current.value+"-"+inputequipa2.current.value
            }
        }
        else {
            let str = ""
            let tam = sets.length;
            sets.map((s,index) => {
                let auxStr = ""
                if (s.equipa1 != null && s.equipa2 != null) {
                    if (index != tam-1) {
                        auxStr = s.equipa1 + "-" + s.equipa2 + "|"
                    } 
                    else {
                        auxStr = s.equipa1 + "-" + s.equipa2
                    }
                }
                str += auxStr;
            })
            bodyMessage = {
                "resultado": str
            }
        }

        axios.post(`${API_URL}/torneios/${idTorneio}/gestao/${jogo.idJogo}/atualizarResultado`,bodyMessage,{headers: headers})
        .then(response => {
            if (response.status == 200) {
                setAlertsucesso(true);
            }
        })

    }

    const fecharJogo = async (e) =>  {
        e.preventDefault();
        if (alert) {
            setAlert(false);
        }
        if (alertsucesso) {
            setAlertsucesso(false);
        }
        const headers = {
            "authorization": "Bearer " +localStorage.getItem("token")
        }

        let bodyMessage = []
        if (desporto != "Tenis" && desporto != "Tenis de mesa" && desporto != "Badminton" && desporto != "Volleyball" && desporto != "Padel") {
            bodyMessage = {
                "resultado": inputequipa1.current.value+"-"+inputequipa2.current.value,
                "idOponente1" : jogo.idOponente1,
                "idOponente2" : jogo.idOponente2
            }
            const  response = await axios.post(`${API_URL}/torneios/${idTorneio}/gestao/${jogo.idJogo}/fecharResultado`,bodyMessage,{headers: headers})
            if (response.status == 200) {
                    jogo.resultado= inputequipa1.current.value+"-"+inputequipa2.current.value
                    setEstado(2);
                    props.funcao();
            }
            else {
                setEstado(1);
            }
        }
        else {
            let str = ""
            let tam = sets.length;
            let aux = false;
            let setsaux1 = 0
            let setsaux2 = 0
            sets.map((s,index) => {
                let auxStr = ""
                if (s.equipa1 != null && s.equipa2 != null) {
                    if (s.equipa1 == s.equipa2) {
                        aux = true;
                    }
                    if (index != tam-1) {
                        auxStr = s.equipa1 + "-" + s.equipa2 + "|"
                    } 
                    else {
                        auxStr = s.equipa1 + "-" + s.equipa2
                    }
                    if (parseInt(s.equipa1) > parseInt(s.equipa2)) {
                        setsaux1++;
                    }
                    else {
                        if (parseInt(s.equipa1) < parseInt(s.equipa2)) {
                            setsaux2++;
                        }
                    }
                }
                str += auxStr;
            })
            if (!aux && (setsaux1 != setsaux2)) {
                bodyMessage = {
                    "resultado": str,
                    "idOponente1" : jogo.idOponente1,
                    "idOponente2" : jogo.idOponente2
                }
                const  response = await axios.post(`${API_URL}/torneios/${idTorneio}/gestao/${jogo.idJogo}/fecharResultado`,bodyMessage,{headers: headers})
                if (response.status == 200) {
                        jogo.resultado= str; 
                        setEstado(2);
                        props.funcao();
                        
                }
                else {
                    setEstado(1);
                }
            }
            else {
                if (aux) {
                setAlertMsg("O resultado de um set não pode ser um empate!")
                setAlert(true)
                }
                else {
                    setAlertMsg("O número de sets ganho por cada equipa é igual!")
                    setAlert(true)
                }
            }
        }
    }


    const handleChange1 = event => {
        event.preventDefault();
        if (alert) {
            setAlert(false);
        }
        if (alertsucesso) {
            setAlertsucesso(false);
        }
        setCurrentValue1(event.target.value);
    }

    const handleChange2 = event => {
        event.preventDefault();
        if (alert) {
            setAlert(false);
        }
        if (alertsucesso) {
            setAlertsucesso(false);
        }
        setCurrentValue2(event.target.value);
    }

    const handleAddInput = (e) => {
        e.preventDefault();
        if (alert) {
            setAlert(false);
        }
        if (alertsucesso) {
            setAlertsucesso(false);
        }
        let newInput = {equipa1: '0', equipa2: '0'};
        setsets([...sets, newInput]);
    };
    
    const handleRemoveInput = (e,index)=>{
        e.preventDefault();
        if (alert) {
            setAlert(false);
        }
        if (alertsucesso) {
            setAlertsucesso(false);
        }
        if (sets.length > 1) {
            let setsCopy = [...sets];
            setsCopy.splice(index, 1);
            setsets(setsCopy);
        }
    };

    const handleChange = (e,index) => {
        e.preventDefault();
        let setsCopy = [...sets];
        if (alert) {
            setAlert(false);
        }
        if (alertsucesso) {
            setAlertsucesso(false);
        }
        setsCopy[index][e.target.name] = e.target.value;
        setsets(setsCopy);
    };

    function formatarResultado(resultado){

        let list = [];
        let geral = [0,0];
            list = jogo.resultado.split('|');
            for (var i=0;i < list.length;i++){
            let sp = list[i].split('-');
            if(parseInt(sp[0]) > parseInt(sp[1]))
                geral[0] += 1;
            else {
                geral[1] += 1;
        }
        }
        return [geral,list];

    }

    useEffect(() => {
        if ((desporto == "Tenis de mesa" || desporto == "Badminton" || desporto == "Tenis" || desporto == "Volleyball" || desporto == "Padel") && jogo.resultado != null) {
            let aux = jogo.resultado.split("|");
            let novosSets = []
            for (let i = 0;i<aux.length;i++){
                let auxSet = aux[i].split("-")
                let resSet= {equipa1: auxSet[0],equipa2 : auxSet[1]}
                novosSets.push(resSet);
            }
            setsets(novosSets)
        }
      },[])


    return(
        <>
        <div className= "w-auto my-2 bg-white shadow-2xl shadow-gray-300 hover:bg-gray-200 rounded-xl p-2 text-black">
        <div class="flex flex-wrap">
        {isGrupo
          ?
            (<div className="text-center font-bold text-orange-500 w-full mt-4"> Grupo {jogo.numeroGrupo} </div>)
          :
            (<div className="text-center font-bold text-orange-500 w-full mt-4"> {jogo.nomeEtapa} </div>)
        }
        </div>
            {
                (desporto != "Tenis" && desporto != "Tenis de mesa" && desporto != "Badminton" && desporto != "Volleyball" && desporto != "Padel")?
                    (estado == 0)?
                    (<><div class="flex flex-wrap mx-auto">
                            <div class="flex flex-wrap w-full">
                            <div className="w-1/2 h-min">
                                <div className="font-bold text-2xl text-gray-700 text-center h-min"> {jogo.nomeEquipa1? jogo.nomeEquipa1 : "TBD"}</div>
                                <div className="font-bold text-2xl text-gray-700 h-min text-center"> {jogo.nomeEquipa2? jogo.nomeEquipa2 : "TBD"} </div>
                            </div>
                            <div className="w-1/2 h-min">
                                <button className="py-2 px-4 bg-gray-400 text-white font-bold rounded-full border-black hover:bg-gray-600" onClick={iniciarJogo}>Iniciar Jogo</button>
                            </div>
                            </div>
                            <div class="w-full mx-auto mt-4">
                                <div class="flex flex-wrap place-content-center">
                                <div class="w-auto mr-1 ">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.33333 1.33333C6.01478 1.33333 4.72585 1.72432 3.62952 2.45686C2.5332 3.18941 1.67871 4.2306 1.17413 5.44877C0.669545 6.66695 0.537523 8.00739 0.794758 9.3006C1.05199 10.5938 1.68693 11.7817 2.61928 12.714C3.55163 13.6464 4.73952 14.2813 6.03272 14.5386C7.32593 14.7958 8.66638 14.6638 9.88455 14.1592C11.1027 13.6546 12.1439 12.8001 12.8765 11.7038C13.609 10.6075 14 9.31854 14 8C14 7.12452 13.8276 6.25761 13.4925 5.44877C13.1575 4.63993 12.6664 3.90501 12.0474 3.28595C11.4283 2.66689 10.6934 2.17583 9.88455 1.8408C9.07571 1.50577 8.20881 1.33333 7.33333 1.33333ZM7.33333 13.3333C6.27849 13.3333 5.24735 13.0205 4.37028 12.4345C3.49322 11.8485 2.80964 11.0155 2.40597 10.041C2.0023 9.06643 1.89668 7.99408 2.10247 6.95951C2.30826 5.92495 2.81621 4.97464 3.56209 4.22876C4.30797 3.48288 5.25828 2.97493 6.29284 2.76914C7.32741 2.56335 8.39977 2.66897 9.3743 3.07264C10.3488 3.47631 11.1818 4.15989 11.7678 5.03695C12.3539 5.91402 12.6667 6.94516 12.6667 8C12.6667 9.41448 12.1048 10.771 11.1046 11.7712C10.1044 12.7714 8.74781 13.3333 7.33333 13.3333ZM7.33333 3.99999C7.15652 3.99999 6.98695 4.07023 6.86192 4.19526C6.7369 4.32028 6.66666 4.48985 6.66666 4.66666V7.61333L5.26666 8.42C5.13823 8.49277 5.03759 8.60611 4.98051 8.74225C4.92344 8.87838 4.91316 9.02961 4.95129 9.17222C4.98942 9.31482 5.0738 9.44074 5.1912 9.53022C5.3086 9.61971 5.45238 9.66769 5.59999 9.66666C5.71678 9.66747 5.83172 9.63758 5.93333 9.58L7.66666 8.58L7.72666 8.51999L7.83333 8.43333C7.85939 8.40033 7.88175 8.36455 7.89999 8.32666C7.92172 8.29087 7.9396 8.25288 7.95333 8.21333C7.97146 8.17094 7.98271 8.12593 7.98666 8.08L7.99999 8V4.66666C7.99999 4.48985 7.92976 4.32028 7.80473 4.19526C7.67971 4.07023 7.51014 3.99999 7.33333 3.99999Z" fill="#D5DAE1"></path>
                                    </svg>
                                </div>
                                <div class="w-auto">
                                    <p class="text-xs font-medium text-coolGray-500">{jogo.hora.split(' ')[1]+ ":00"}</p>
                                </div>
                                </div>
                            </div>
                        </div>

                        <div class="pt-2 mt-2 border-t border-gray-300">
                            <div class="flex flex-wrap items-center">
                                <div class="w-auto p-2">
                                    <div class="flex items-center p-2 bg-gray-400 rounded-md">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.0001 2.33337H3.00008C2.2637 2.33337 1.66675 2.93033 1.66675 3.66671V11.6667C1.66675 12.4031 2.2637 13 3.00008 13H11.0001C11.7365 13 12.3334 12.4031 12.3334 11.6667V3.66671C12.3334 2.93033 11.7365 2.33337 11.0001 2.33337Z" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M9.66675 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M4.3335 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M1.66675 6.33337H12.3334" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M6.3335 9H7.00016" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M7 9V11" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        <span class="ml-2 text-xs font-medium text-white">{jogo.hora.split(' ')[0]}</span>
                                    </div>
                                </div>
                                <div class="m-2 p-1 px-2 text-center h-min bg-orange-300 text-white text-xs font-bold w-auto  rounded-full uppercase">Por começar</div>
                                {isGrupo
                                    ?
                                        (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                                            {`Jornada ${jogo.ronda}`}
                                        </div>)
                                    : (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                                        {`Jogo ${jogo.ronda}`}
                                        </div>)
                                    }
                            </div>
                            {(alert)?
                                        (<div class="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                                            <span class="font-medium">{alertMsg}</span>
                                        </div>)
                                        : null
                                }
                        </div>
                    </>
                    )
                    :
                    ( (estado == 1)?
                        (
                            <><div class="flex flex-wrap mx-auto">
                                    <div class="flex flex-wrap w-full">
                                    <div className="w-1/2 h-min">
                                        <div className="font-bold text-2xl text-gray-700 text-center h-min"> {jogo.nomeEquipa1? jogo.nomeEquipa1 : "TBD"}</div>
                                        <div className="font-bold text-2xl text-gray-700 h-min text-center"> {jogo.nomeEquipa2? jogo.nomeEquipa2 : "TBD"} </div>
                                    </div>
                                    <div className="w-1/2 h-min">
                                        <div>
                                            <input className="w-1/6 m-0.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1.5"
                                            ref={inputequipa1} id="equipa1res" type="number" min="0" value= {currentValue1} onChange={handleChange1}  required></input>
                                        </div>
                                        <div>
                                        <input className='w-1/6 m-0.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1.5'
                                         ref={inputequipa2} id="equipa2res" type="number" min="0" value= {currentValue2} onChange ={handleChange2} required></input>
                                        </div>
                                    </div>
                                    </div>
                                    <div class="w-full mx-auto mt-4">
                                        <div class="flex flex-wrap place-content-center">
                                        <div class="w-auto mr-1 ">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.33333 1.33333C6.01478 1.33333 4.72585 1.72432 3.62952 2.45686C2.5332 3.18941 1.67871 4.2306 1.17413 5.44877C0.669545 6.66695 0.537523 8.00739 0.794758 9.3006C1.05199 10.5938 1.68693 11.7817 2.61928 12.714C3.55163 13.6464 4.73952 14.2813 6.03272 14.5386C7.32593 14.7958 8.66638 14.6638 9.88455 14.1592C11.1027 13.6546 12.1439 12.8001 12.8765 11.7038C13.609 10.6075 14 9.31854 14 8C14 7.12452 13.8276 6.25761 13.4925 5.44877C13.1575 4.63993 12.6664 3.90501 12.0474 3.28595C11.4283 2.66689 10.6934 2.17583 9.88455 1.8408C9.07571 1.50577 8.20881 1.33333 7.33333 1.33333ZM7.33333 13.3333C6.27849 13.3333 5.24735 13.0205 4.37028 12.4345C3.49322 11.8485 2.80964 11.0155 2.40597 10.041C2.0023 9.06643 1.89668 7.99408 2.10247 6.95951C2.30826 5.92495 2.81621 4.97464 3.56209 4.22876C4.30797 3.48288 5.25828 2.97493 6.29284 2.76914C7.32741 2.56335 8.39977 2.66897 9.3743 3.07264C10.3488 3.47631 11.1818 4.15989 11.7678 5.03695C12.3539 5.91402 12.6667 6.94516 12.6667 8C12.6667 9.41448 12.1048 10.771 11.1046 11.7712C10.1044 12.7714 8.74781 13.3333 7.33333 13.3333ZM7.33333 3.99999C7.15652 3.99999 6.98695 4.07023 6.86192 4.19526C6.7369 4.32028 6.66666 4.48985 6.66666 4.66666V7.61333L5.26666 8.42C5.13823 8.49277 5.03759 8.60611 4.98051 8.74225C4.92344 8.87838 4.91316 9.02961 4.95129 9.17222C4.98942 9.31482 5.0738 9.44074 5.1912 9.53022C5.3086 9.61971 5.45238 9.66769 5.59999 9.66666C5.71678 9.66747 5.83172 9.63758 5.93333 9.58L7.66666 8.58L7.72666 8.51999L7.83333 8.43333C7.85939 8.40033 7.88175 8.36455 7.89999 8.32666C7.92172 8.29087 7.9396 8.25288 7.95333 8.21333C7.97146 8.17094 7.98271 8.12593 7.98666 8.08L7.99999 8V4.66666C7.99999 4.48985 7.92976 4.32028 7.80473 4.19526C7.67971 4.07023 7.51014 3.99999 7.33333 3.99999Z" fill="#D5DAE1"></path>
                                            </svg>
                                        </div>
                                        <div class="w-auto">
                                            <p class="text-xs font-medium text-coolGray-500">{jogo.hora.split(' ')[1]+ ":00"}</p>
                                        </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="pt-2 mt-2 border-t border-gray-300">
                                    <div class="flex flex-wrap items-center">
                                        <div class = 'w-1/2'>
                                        <div class="flex flex-wrap items-center">
                                        <div class="w-auto p-2">
                                            <div class="flex items-center p-2 bg-gray-400 rounded-md">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.0001 2.33337H3.00008C2.2637 2.33337 1.66675 2.93033 1.66675 3.66671V11.6667C1.66675 12.4031 2.2637 13 3.00008 13H11.0001C11.7365 13 12.3334 12.4031 12.3334 11.6667V3.66671C12.3334 2.93033 11.7365 2.33337 11.0001 2.33337Z" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M9.66675 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M4.3335 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M1.66675 6.33337H12.3334" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M6.3335 9H7.00016" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M7 9V11" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                </svg>
                                                <span class="ml-2 text-xs font-medium text-white">{jogo.hora.split(' ')[0]}</span>
                                            </div>
                                        </div>
                                        <div class="m-2 p-1 px-2 text-center h-min bg-orange-500 text-white text-xs font-bold w-auto  rounded-full uppercase">A decorrer</div>
                                        {isGrupo
                                            ?
                                                (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                                                    {`Jornada ${jogo.ronda}`}
                                                </div>)
                                            : (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                                                {`Jogo ${jogo.ronda}`}
                                                </div>)
                                            }
                                        </div>
                                        </div>
                                        <div class = 'w-1/2'>
                                        <div class="flex flex-wrap items-center">
                                        <div class= 'w-1/2'>
                                        <div className = "m-2">
                                        <button className="py-2 px-4 bg-orange-400 text-white text-sm font-bold rounded-full border-black hover:bg-orange-600" onClick={atualizarResultado}>Atualizar</button>
                                        </div>
                                        </div>
                                        
                                        <div class= 'w-1/2'>
                                        <div className = "m-2">
                                        <button className="py-2 px-4 bg-orange-700 text-white text-sm font-bold rounded-full border-black hover:bg-orange-800" onClick={fecharJogo}>Terminar</button>
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                    </div>
                                    {(alert)?
                                        (<div class="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                                            <span class="font-medium">{alertMsg}</span>
                                        </div>)
                                        : null
                                        }
                                        {(alertsucesso)?
                                        (<div class="p-4 mb-4 w-full text-sm text-green-800 rounded-lg bg-green-100" role="alert">
                                            <span class="font-medium">Resultado alterado com sucesso!</span>
                                        </div>)
                                        : null
                                        }
                                </div>
                            </>
                        )
                        :(<><div class="flex flex-wrap mx-auto">
                                <div class="flex flex-wrap w-full">
                                <div className="font-bold text-2xl text-gray-700 text-center w-1/2 h-min"> {jogo.nomeEquipa1}</div>
                                <div className="font-bold text-2xl w-1/2 h-min text-center"> {jogo.resultado.split("-")[0]} </div>
                                <div className="font-bold text-2xl text-gray-700 w-1/2 h-min text-center"> {jogo.nomeEquipa2} </div>
                                <div className="font-bold text-2xl w-1/2 h-min text-center"> {jogo.resultado.split("-")[1]} </div>
                                </div>
                                <div class="w-full mx-auto mt-4">
                                    <div class="flex flex-wrap place-content-center">
                                    <div class="w-auto mr-1 ">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.33333 1.33333C6.01478 1.33333 4.72585 1.72432 3.62952 2.45686C2.5332 3.18941 1.67871 4.2306 1.17413 5.44877C0.669545 6.66695 0.537523 8.00739 0.794758 9.3006C1.05199 10.5938 1.68693 11.7817 2.61928 12.714C3.55163 13.6464 4.73952 14.2813 6.03272 14.5386C7.32593 14.7958 8.66638 14.6638 9.88455 14.1592C11.1027 13.6546 12.1439 12.8001 12.8765 11.7038C13.609 10.6075 14 9.31854 14 8C14 7.12452 13.8276 6.25761 13.4925 5.44877C13.1575 4.63993 12.6664 3.90501 12.0474 3.28595C11.4283 2.66689 10.6934 2.17583 9.88455 1.8408C9.07571 1.50577 8.20881 1.33333 7.33333 1.33333ZM7.33333 13.3333C6.27849 13.3333 5.24735 13.0205 4.37028 12.4345C3.49322 11.8485 2.80964 11.0155 2.40597 10.041C2.0023 9.06643 1.89668 7.99408 2.10247 6.95951C2.30826 5.92495 2.81621 4.97464 3.56209 4.22876C4.30797 3.48288 5.25828 2.97493 6.29284 2.76914C7.32741 2.56335 8.39977 2.66897 9.3743 3.07264C10.3488 3.47631 11.1818 4.15989 11.7678 5.03695C12.3539 5.91402 12.6667 6.94516 12.6667 8C12.6667 9.41448 12.1048 10.771 11.1046 11.7712C10.1044 12.7714 8.74781 13.3333 7.33333 13.3333ZM7.33333 3.99999C7.15652 3.99999 6.98695 4.07023 6.86192 4.19526C6.7369 4.32028 6.66666 4.48985 6.66666 4.66666V7.61333L5.26666 8.42C5.13823 8.49277 5.03759 8.60611 4.98051 8.74225C4.92344 8.87838 4.91316 9.02961 4.95129 9.17222C4.98942 9.31482 5.0738 9.44074 5.1912 9.53022C5.3086 9.61971 5.45238 9.66769 5.59999 9.66666C5.71678 9.66747 5.83172 9.63758 5.93333 9.58L7.66666 8.58L7.72666 8.51999L7.83333 8.43333C7.85939 8.40033 7.88175 8.36455 7.89999 8.32666C7.92172 8.29087 7.9396 8.25288 7.95333 8.21333C7.97146 8.17094 7.98271 8.12593 7.98666 8.08L7.99999 8V4.66666C7.99999 4.48985 7.92976 4.32028 7.80473 4.19526C7.67971 4.07023 7.51014 3.99999 7.33333 3.99999Z" fill="#D5DAE1"></path>
                                        </svg>
                                    </div>
                                    <div class="w-auto">
                                        <p class="text-xs font-medium text-coolGray-500">{jogo.hora.split(' ')[1]+ ":00"}</p>
                                    </div>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-2 mt-2 border-t border-gray-300">
                                <div class="flex flex-wrap items-center">
                                    <div class="w-auto p-2">
                                        <div class="flex items-center p-2 bg-gray-400 rounded-md">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.0001 2.33337H3.00008C2.2637 2.33337 1.66675 2.93033 1.66675 3.66671V11.6667C1.66675 12.4031 2.2637 13 3.00008 13H11.0001C11.7365 13 12.3334 12.4031 12.3334 11.6667V3.66671C12.3334 2.93033 11.7365 2.33337 11.0001 2.33337Z" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M9.66675 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M4.3335 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M1.66675 6.33337H12.3334" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M6.3335 9H7.00016" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M7 9V11" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                            <span class="ml-2 text-xs font-medium text-white">{jogo.hora.split(' ')[0]}</span>
                                        </div>
                                    </div>
                                    <div class="m-2 p-1 px-2 text-center h-min bg-orange-700 text-white text-xs font-bold w-auto  rounded-full uppercase">Encerrado</div>
                                    {isGrupo
                                        ?
                                            (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                                                {`Jornada ${jogo.ronda}`}
                                            </div>)
                                        : (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                                            {`Jogo ${jogo.ronda}`}
                                            </div>)
                                        }

                                </div>
                            </div>
                            </>
                            )
                    )
                :
                (
                    (estado == 0)?
                    (<><div class="flex flex-wrap mx-auto">
                            <div class="flex flex-wrap w-full">
                            <div className="w-1/2 h-min">
                                <div className="font-bold text-2xl text-gray-700 text-center h-min"> {jogo.nomeEquipa1? jogo.nomeEquipa1 : "TBD"}</div>
                                <div className="font-bold text-2xl text-gray-700 h-min text-center"> {jogo.nomeEquipa2? jogo.nomeEquipa2 : "TBD"} </div>
                            </div>
                            <div className="w-1/2 h-min">
                                <button className="py-2 px-4 bg-gray-400 text-white font-bold rounded-full border-black hover:bg-gray-600" onClick={iniciarJogo}>Iniciar Jogo</button>
                            </div>
                            </div>
                            <div class="w-full mx-auto mt-4">
                                <div class="flex flex-wrap place-content-center">
                                <div class="w-auto mr-1 ">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.33333 1.33333C6.01478 1.33333 4.72585 1.72432 3.62952 2.45686C2.5332 3.18941 1.67871 4.2306 1.17413 5.44877C0.669545 6.66695 0.537523 8.00739 0.794758 9.3006C1.05199 10.5938 1.68693 11.7817 2.61928 12.714C3.55163 13.6464 4.73952 14.2813 6.03272 14.5386C7.32593 14.7958 8.66638 14.6638 9.88455 14.1592C11.1027 13.6546 12.1439 12.8001 12.8765 11.7038C13.609 10.6075 14 9.31854 14 8C14 7.12452 13.8276 6.25761 13.4925 5.44877C13.1575 4.63993 12.6664 3.90501 12.0474 3.28595C11.4283 2.66689 10.6934 2.17583 9.88455 1.8408C9.07571 1.50577 8.20881 1.33333 7.33333 1.33333ZM7.33333 13.3333C6.27849 13.3333 5.24735 13.0205 4.37028 12.4345C3.49322 11.8485 2.80964 11.0155 2.40597 10.041C2.0023 9.06643 1.89668 7.99408 2.10247 6.95951C2.30826 5.92495 2.81621 4.97464 3.56209 4.22876C4.30797 3.48288 5.25828 2.97493 6.29284 2.76914C7.32741 2.56335 8.39977 2.66897 9.3743 3.07264C10.3488 3.47631 11.1818 4.15989 11.7678 5.03695C12.3539 5.91402 12.6667 6.94516 12.6667 8C12.6667 9.41448 12.1048 10.771 11.1046 11.7712C10.1044 12.7714 8.74781 13.3333 7.33333 13.3333ZM7.33333 3.99999C7.15652 3.99999 6.98695 4.07023 6.86192 4.19526C6.7369 4.32028 6.66666 4.48985 6.66666 4.66666V7.61333L5.26666 8.42C5.13823 8.49277 5.03759 8.60611 4.98051 8.74225C4.92344 8.87838 4.91316 9.02961 4.95129 9.17222C4.98942 9.31482 5.0738 9.44074 5.1912 9.53022C5.3086 9.61971 5.45238 9.66769 5.59999 9.66666C5.71678 9.66747 5.83172 9.63758 5.93333 9.58L7.66666 8.58L7.72666 8.51999L7.83333 8.43333C7.85939 8.40033 7.88175 8.36455 7.89999 8.32666C7.92172 8.29087 7.9396 8.25288 7.95333 8.21333C7.97146 8.17094 7.98271 8.12593 7.98666 8.08L7.99999 8V4.66666C7.99999 4.48985 7.92976 4.32028 7.80473 4.19526C7.67971 4.07023 7.51014 3.99999 7.33333 3.99999Z" fill="#D5DAE1"></path>
                                    </svg>
                                </div>
                                <div class="w-auto">
                                    <p class="text-xs font-medium text-coolGray-500">{jogo.hora.split(' ')[1]+ ":00"}</p>
                                </div>
                                </div>
                            </div>
                        </div>

                        <div class="pt-2 mt-2 border-t border-gray-300">
                            <div class="flex flex-wrap items-center">
                                <div class="w-auto p-2">
                                    <div class="flex items-center p-2 bg-gray-400 rounded-md">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.0001 2.33337H3.00008C2.2637 2.33337 1.66675 2.93033 1.66675 3.66671V11.6667C1.66675 12.4031 2.2637 13 3.00008 13H11.0001C11.7365 13 12.3334 12.4031 12.3334 11.6667V3.66671C12.3334 2.93033 11.7365 2.33337 11.0001 2.33337Z" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M9.66675 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M4.3335 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M1.66675 6.33337H12.3334" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M6.3335 9H7.00016" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M7 9V11" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        <span class="ml-2 text-xs font-medium text-white">{jogo.hora.split(' ')[0]}</span>
                                    </div>
                                </div>
                                <div class="m-2 p-1 px-2 text-center h-min bg-orange-300 text-white text-xs font-bold w-auto  rounded-full uppercase">Por começar</div>
                                {isGrupo
                                    ?
                                        (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                                            {`Jornada ${jogo.ronda}`}
                                        </div>)
                                    : (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                                        {`Jogo ${jogo.ronda}`}
                                        </div>)
                                    }
                            </div>
                            {(alert)?
                                        (<div class="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                                            <span class="font-medium">{alertMsg}</span>
                                        </div>)
                                        : null
                            }
                        </div>
                    </>
                    )
                    :
                    ( (estado == 1)?
                        (
                            <><div class="flex flex-wrap mx-auto">
                                    <div class="flex flex-wrap w-full">
                                    <div className="w-1/2 h-min mt-2.5">
                                        <div className="font-bold text-2xl text-gray-700 text-center h-min"> {jogo.nomeEquipa1? jogo.nomeEquipa1 : "TBD"}</div>
                                        <div className="font-bold text-2xl text-gray-700 h-min text-center"> {jogo.nomeEquipa2? jogo.nomeEquipa2 : "TBD"} </div>
                                    </div>
                                    <div className="w-1/2 h-min">
                                        <div class="flex flex-wrap mx-auto">
                                            {sets.map((inputValue, index) => (
                                                <div className="w-1/6" key={index}>
                                                <input
                                                className="m-0.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5"
                                                name = "equipa1"
                                                type="number"
                                                min = "0"
                                                value={inputValue.equipa1}
                                                onChange={(e) => handleChange(e,index)}
                                                />
                                                <input
                                                className="m-0.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5"
                                                name = "equipa2"
                                                type="number"
                                                min = "0"
                                                value={inputValue.equipa2}
                                                onChange={(e) =>handleChange(e,index)}
                                                />
                                                <div className="mt-0.5">
                                                <button className="py-1 px-3 bg-gray-400 text-white font-bold rounded-full border-black hover:bg-gray-600" onClick={(e)=>handleRemoveInput(e,index)}>-</button>
                                                </div>
                                                </div>
                                            ))}
                                            <div className='mt-5 w-1/6'>
                                                <button className="py-2 px-4 bg-gray-400 text-white font-bold rounded-full border-black hover:bg-gray-600" onClick={handleAddInput}>+</button>
                                            </div> 
                                        </div>
                                    </div>
                                    </div>
                                    <div class="w-full mx-auto mt-4">
                                        <div class="flex flex-wrap place-content-center">
                                        <div class="w-auto mr-1 ">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.33333 1.33333C6.01478 1.33333 4.72585 1.72432 3.62952 2.45686C2.5332 3.18941 1.67871 4.2306 1.17413 5.44877C0.669545 6.66695 0.537523 8.00739 0.794758 9.3006C1.05199 10.5938 1.68693 11.7817 2.61928 12.714C3.55163 13.6464 4.73952 14.2813 6.03272 14.5386C7.32593 14.7958 8.66638 14.6638 9.88455 14.1592C11.1027 13.6546 12.1439 12.8001 12.8765 11.7038C13.609 10.6075 14 9.31854 14 8C14 7.12452 13.8276 6.25761 13.4925 5.44877C13.1575 4.63993 12.6664 3.90501 12.0474 3.28595C11.4283 2.66689 10.6934 2.17583 9.88455 1.8408C9.07571 1.50577 8.20881 1.33333 7.33333 1.33333ZM7.33333 13.3333C6.27849 13.3333 5.24735 13.0205 4.37028 12.4345C3.49322 11.8485 2.80964 11.0155 2.40597 10.041C2.0023 9.06643 1.89668 7.99408 2.10247 6.95951C2.30826 5.92495 2.81621 4.97464 3.56209 4.22876C4.30797 3.48288 5.25828 2.97493 6.29284 2.76914C7.32741 2.56335 8.39977 2.66897 9.3743 3.07264C10.3488 3.47631 11.1818 4.15989 11.7678 5.03695C12.3539 5.91402 12.6667 6.94516 12.6667 8C12.6667 9.41448 12.1048 10.771 11.1046 11.7712C10.1044 12.7714 8.74781 13.3333 7.33333 13.3333ZM7.33333 3.99999C7.15652 3.99999 6.98695 4.07023 6.86192 4.19526C6.7369 4.32028 6.66666 4.48985 6.66666 4.66666V7.61333L5.26666 8.42C5.13823 8.49277 5.03759 8.60611 4.98051 8.74225C4.92344 8.87838 4.91316 9.02961 4.95129 9.17222C4.98942 9.31482 5.0738 9.44074 5.1912 9.53022C5.3086 9.61971 5.45238 9.66769 5.59999 9.66666C5.71678 9.66747 5.83172 9.63758 5.93333 9.58L7.66666 8.58L7.72666 8.51999L7.83333 8.43333C7.85939 8.40033 7.88175 8.36455 7.89999 8.32666C7.92172 8.29087 7.9396 8.25288 7.95333 8.21333C7.97146 8.17094 7.98271 8.12593 7.98666 8.08L7.99999 8V4.66666C7.99999 4.48985 7.92976 4.32028 7.80473 4.19526C7.67971 4.07023 7.51014 3.99999 7.33333 3.99999Z" fill="#D5DAE1"></path>
                                            </svg>
                                        </div>
                                        <div class="w-auto">
                                            <p class="text-xs font-medium text-coolGray-500">{jogo.hora.split(' ')[1]+ ":00"}</p>
                                        </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="pt-2 mt-2 border-t border-gray-300">
                                    <div class="flex flex-wrap items-center">
                                        <div class = 'w-1/2'>
                                        <div class="flex flex-wrap items-center">
                                        <div class="w-auto p-2">
                                            <div class="flex items-center p-2 bg-gray-400 rounded-md">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.0001 2.33337H3.00008C2.2637 2.33337 1.66675 2.93033 1.66675 3.66671V11.6667C1.66675 12.4031 2.2637 13 3.00008 13H11.0001C11.7365 13 12.3334 12.4031 12.3334 11.6667V3.66671C12.3334 2.93033 11.7365 2.33337 11.0001 2.33337Z" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M9.66675 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M4.3335 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M1.66675 6.33337H12.3334" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M6.3335 9H7.00016" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M7 9V11" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                </svg>
                                                <span class="ml-2 text-xs font-medium text-white">{jogo.hora.split(' ')[0]}</span>
                                            </div>
                                        </div>
                                        <div class="m-2 p-1 px-2 text-center h-min bg-orange-500 text-white text-xs font-bold w-auto  rounded-full uppercase">A decorrer</div>
                                        {isGrupo
                                            ?
                                                (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                                                    {`Jornada ${jogo.ronda}`}
                                                </div>)
                                            : (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                                                {`Jogo ${jogo.ronda}`}
                                                </div>)
                                            }
                                        </div>
                                        </div>
                                        <div class = 'w-1/2'>
                                        <div class="flex flex-wrap items-center">
                                        <div class= 'w-1/2'>
                                        <div className = "m-2">
                                        <button className="py-2 px-4 bg-orange-400 text-white text-sm font-bold rounded-full border-black hover:bg-orange-600" onClick={atualizarResultado}>Atualizar</button>
                                        </div>
                                        </div>
                                        
                                        <div class= 'w-1/2'>
                                        <div className = "m-2">
                                        <button className="py-2 px-4 bg-orange-700 text-white text-sm font-bold rounded-full border-black hover:bg-orange-800" onClick={fecharJogo}>Terminar</button>
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        
                                    </div>
                                    {(alert)?
                                        (<div class="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                                            <span class="font-medium">{alertMsg}</span>
                                        </div>)
                                        : null
                                        }
                                        {(alertsucesso)?
                                        (<div class="p-4 mb-4 w-full text-sm text-green-800 rounded-lg bg-green-100" role="alert">
                                            <span class="font-medium">Resultado alterado com sucesso!</span>
                                        </div>)
                                        : null
                                        }
                                </div>
                            </>
                        )
                        :(<><div class="flex flex-wrap mx-auto">
                                <div class="flex flex-wrap w-full">
                                <div className="font-bold text-2xl text-gray-700 text-center w-1/2 h-min"> {jogo.nomeEquipa1}</div>
                                <div className="font-bold text-2xl w-1/2 place-content-center flex flex-wrap h-min text-center">
                                    <div className={`w-4 mx-1 h-full font text-center pr-6 border-r-2 border-orange-200`}>
                                        {formatarResultado(jogo.resultado)[0][0]}
                                    </div>
                                    {formatarResultado(jogo.resultado)[1].map((r) => (
                                        <div className="w-4 mx-1 h-full font-light text-center">
                                        {r.split('-')[0]}
                                        </div>
                                    ))}
                                    </div>
                                <div className="font-bold text-2xl text-gray-700 w-1/2 h-min text-center"> {jogo.nomeEquipa2} </div>
                                <div className="font-bold text-2xl w-1/2 place-content-center flex flex-wrap h-min text-center">
                                    <div className={`w-4 mx-1 h-full font text-center pr-6 border-r-2 border-orange-200`}>
                                        {formatarResultado(jogo.resultado)[0][1]}
                                    </div>
                                    {formatarResultado(jogo.resultado)[1].map((r) => (
                                        <div className="w-4 mx-1 h-full font-light text-center">
                                        {r.split('-')[1]}
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                <div class="w-full mx-auto mt-4">
                                    <div class="flex flex-wrap place-content-center">
                                    <div class="w-auto mr-1 ">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.33333 1.33333C6.01478 1.33333 4.72585 1.72432 3.62952 2.45686C2.5332 3.18941 1.67871 4.2306 1.17413 5.44877C0.669545 6.66695 0.537523 8.00739 0.794758 9.3006C1.05199 10.5938 1.68693 11.7817 2.61928 12.714C3.55163 13.6464 4.73952 14.2813 6.03272 14.5386C7.32593 14.7958 8.66638 14.6638 9.88455 14.1592C11.1027 13.6546 12.1439 12.8001 12.8765 11.7038C13.609 10.6075 14 9.31854 14 8C14 7.12452 13.8276 6.25761 13.4925 5.44877C13.1575 4.63993 12.6664 3.90501 12.0474 3.28595C11.4283 2.66689 10.6934 2.17583 9.88455 1.8408C9.07571 1.50577 8.20881 1.33333 7.33333 1.33333ZM7.33333 13.3333C6.27849 13.3333 5.24735 13.0205 4.37028 12.4345C3.49322 11.8485 2.80964 11.0155 2.40597 10.041C2.0023 9.06643 1.89668 7.99408 2.10247 6.95951C2.30826 5.92495 2.81621 4.97464 3.56209 4.22876C4.30797 3.48288 5.25828 2.97493 6.29284 2.76914C7.32741 2.56335 8.39977 2.66897 9.3743 3.07264C10.3488 3.47631 11.1818 4.15989 11.7678 5.03695C12.3539 5.91402 12.6667 6.94516 12.6667 8C12.6667 9.41448 12.1048 10.771 11.1046 11.7712C10.1044 12.7714 8.74781 13.3333 7.33333 13.3333ZM7.33333 3.99999C7.15652 3.99999 6.98695 4.07023 6.86192 4.19526C6.7369 4.32028 6.66666 4.48985 6.66666 4.66666V7.61333L5.26666 8.42C5.13823 8.49277 5.03759 8.60611 4.98051 8.74225C4.92344 8.87838 4.91316 9.02961 4.95129 9.17222C4.98942 9.31482 5.0738 9.44074 5.1912 9.53022C5.3086 9.61971 5.45238 9.66769 5.59999 9.66666C5.71678 9.66747 5.83172 9.63758 5.93333 9.58L7.66666 8.58L7.72666 8.51999L7.83333 8.43333C7.85939 8.40033 7.88175 8.36455 7.89999 8.32666C7.92172 8.29087 7.9396 8.25288 7.95333 8.21333C7.97146 8.17094 7.98271 8.12593 7.98666 8.08L7.99999 8V4.66666C7.99999 4.48985 7.92976 4.32028 7.80473 4.19526C7.67971 4.07023 7.51014 3.99999 7.33333 3.99999Z" fill="#D5DAE1"></path>
                                        </svg>
                                    </div>
                                    <div class="w-auto">
                                        <p class="text-xs font-medium text-coolGray-500">{jogo.hora.split(' ')[1]+ ":00"}</p>
                                    </div>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-2 mt-2 border-t border-gray-300">
                                <div class="flex flex-wrap items-center">
                                    <div class="w-auto p-2">
                                        <div class="flex items-center p-2 bg-gray-400 rounded-md">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.0001 2.33337H3.00008C2.2637 2.33337 1.66675 2.93033 1.66675 3.66671V11.6667C1.66675 12.4031 2.2637 13 3.00008 13H11.0001C11.7365 13 12.3334 12.4031 12.3334 11.6667V3.66671C12.3334 2.93033 11.7365 2.33337 11.0001 2.33337Z" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M9.66675 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M4.3335 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M1.66675 6.33337H12.3334" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M6.3335 9H7.00016" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M7 9V11" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                            <span class="ml-2 text-xs font-medium text-white">{jogo.hora.split(' ')[0]}</span>
                                        </div>
                                    </div>
                                    <div class="m-2 p-1 px-2 text-center h-min bg-orange-700 text-white text-xs font-bold w-auto  rounded-full uppercase">Encerrado</div>
                                    {isGrupo
                                        ?
                                            (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                                                {`Jornada ${jogo.ronda}`}
                                            </div>)
                                        : (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                                            {`Jogo ${jogo.ronda}`}
                                            </div>)
                                        }

                                </div>
                            </div>
                            </>
                            )
                    )
                )
            }
        </div>
        </>
    )
}