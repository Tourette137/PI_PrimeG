import {useState, useEffect} from 'react';
import {JogoDisplayGest} from './JogoDisplayGest.js';
import axios from 'axios';

const API_URL="http://localhost:3000"

export function GestJogos(props) {

    let idTorneio = props.idTorneio;
    let tipoTorneio = props.tipoTorneio;
    let desporto = props.desporto;

    const [jogosGrupo,setJogosGrupo] = useState([]);
    const [jogosElim,setJogosElim] = useState([]);

    //Vemos a fase em que está e depois fazemos o pedido dos jogos correto.


    const searchJogosGrupo = async () => {
        
        console.log("procurei jogos grupo")

        const headers = {
            "authorization": "Bearer " +localStorage.getItem("token")
        }

        const  response = await axios.get(`${API_URL}/torneios/${idTorneio}/gestao/jogosFaseGrupos`,{headers: headers})
        if (response.status == 200) {
                setJogosGrupo(response.data);
        }
        else {
            setJogosGrupo([]);
        }
    }

    const searchJogosElim = async () => {
        console.log("procurei jogos elim")

        const headers = {
            "authorization": "Bearer " +localStorage.getItem("token")
        }

        const  response = await axios.get(`${API_URL}/torneios/${idTorneio}/gestao/jogosEliminatorias`,{headers: headers})
        if (response.status == 200) {
                setJogosElim(response.data);
        }
        else {
            setJogosElim([]);
        }
    }

    useEffect(() => {
        console.log("entrei no useEffect de jogos")
        searchJogosGrupo();
        searchJogosElim();
      },[])


      return (
        <>
        {
            (tipoTorneio == 2 || tipoTorneio == 5 || tipoTorneio == 6 || tipoTorneio == 7) ?
                (jogosGrupo?.length>0 && jogosElim?.length>0) ? 
                    (
                    <div className="flex flex-col lg:flex-row">
                        <div class="lg:w-1/2 w-full">
                        <div class="border border-gray-300 rounded-md mx-4 mt-10 p-4">
                                <div class="px-6 mb-4 text-lg text-coolGray-900 font-semibold">Jogos da Fase de Grupos:</div>
                                {jogosGrupo.map((jogo) => (
                                    <JogoDisplayGest idTorneio = {idTorneio} jogo={jogo} desporto = {desporto} isGrupo={true} />
                                ))}
                        </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                        <div class="border border-gray-300 rounded-md mx-4 mt-10 p-4">
                            {jogosElim?.length > 0 ? (
                                <>
                                <div class="px-6 mb-4 text-lg text-coolGray-900 font-semibold">Jogos da Fase Eliminatória:</div>
                                {jogosElim.map((jogo) => (
                                    <JogoDisplayGest idTorneio = {idTorneio} jogo={jogo} desporto = {desporto} isGrupo={false}/>
                                ))}
                                </>
                            ) : (
                                jogosGrupo.length > 0 ? (
                                    <h4>A fase eliminatória não se encontra sorteada!</h4>
                                )
                                : null
                            )}
                        </div>
                        </div>
                    </div>
                    )
                    :
                    (<section className="grupos">
                    {jogosGrupo?.length > 0 ? (
                        <>
                        {jogosGrupo.map((jogo) => (
                            <JogoDisplayGest idTorneio = {idTorneio} jogo={jogo} desporto = {desporto} isGrupo={true}/>
                        ))}
                        </>
                    ) : (
                        <h2 className="mb-4 text-4xl font-bold leading-none tracking-tight text-orange-600 md:text-4xl lg:text-5xl dark:text-white">A fase de grupos não se encontra sorteada!</h2>
                    )}
                </section>)
            : (
                (tipoTorneio == 0 || tipoTorneio == 3) ?
                    <section className="grupos">
                        {jogosGrupo?.length > 0 ? (
                            <>
                            {jogosGrupo.map((jogo) => (
                                <JogoDisplayGest idTorneio = {idTorneio} jogo={jogo} desporto = {desporto} isGrupo={true}/>
                            ))}
                            </>
                        ) : (
                            <h2 className="mb-4 text-4xl font-bold leading-none tracking-tight text-orange-600 md:text-4xl lg:text-5xl dark:text-white">A fase de grupos não se encontra sorteada!</h2>
                        )}
                    </section>
                : 
                    <section className="eliminatorias">
                        {jogosElim?.length > 0 ? (
                            <>
                            {jogosElim.map((jogo) => (
                                <JogoDisplayGest idTorneio = {idTorneio} jogo={jogo} desporto = {desporto} isGrupo={false}/>
                            ))}
                            </>
                        ) : (
                            <div className="mt-12">
                            <h2 className="mb-4 text-4xl font-bold leading-none tracking-tight text-orange-600 md:text-4xl lg:text-5xl dark:text-white">A Fase eliminatória não se encontra sorteada!</h2>
                            </div>
                        )}
                    </section>
            )
        }
        </>
    )
}