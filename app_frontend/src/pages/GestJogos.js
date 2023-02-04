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
    const [rerender,setRerender] = useState(0);

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
      },[rerender])

      const handlererender = () => {
        console.log("aqui")
        setRerender(rerender + 1);
      };

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
                                    <JogoDisplayGest idTorneio = {idTorneio} jogo={jogo} desporto = {desporto} isGrupo={true} funcao={handlererender}/>
                                ))}
                        </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                        <div class="border border-gray-300 rounded-md mx-4 mt-10 p-4">
                            {jogosElim?.length > 0 ? (
                                <>
                                <div class="px-6 mb-4 text-lg text-coolGray-900 font-semibold">Jogos da Fase Eliminatória:</div>
                                {jogosElim.map((jogo) => (
                                    <JogoDisplayGest idTorneio = {idTorneio} jogo={jogo} desporto = {desporto} isGrupo={false} funcao={handlererender}/>
                                ))}
                                </>
                            ) : (
                                jogosGrupo.length > 0 ? (
                                    <div class=" p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-200" role="alert">
                                <span class="font-medium">A fase eliminatória não se encontra sorteada!</span>
                                    </div>
                                    
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
                        <div class="border border-gray-300 rounded-md mx-4 mt-10 p-4">
                                <div class="px-6 mb-4 text-lg text-coolGray-900 font-semibold">Jogos da Fase de Grupos:</div>
                        {jogosGrupo.map((jogo) => (
                            <JogoDisplayGest idTorneio = {idTorneio} jogo={jogo} desporto = {desporto} isGrupo={true} funcao={handlererender}/>
                        ))}
                        </div>
                        </>
                    ) : (
                        <div class="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-200" role="alert">
                                <span class="font-medium">A fase de grupos não se encontra sorteada</span></div>

                    )}
                </section>)
            : (
                (tipoTorneio == 0 || tipoTorneio == 3) ?
                    <section className="grupos">
                        {jogosGrupo?.length > 0 ? (
                            <>
                            <div class="border border-gray-300 rounded-md mx-4 mt-10 p-4">
                                <div class="px-6 mb-4 text-lg text-coolGray-900 font-semibold">Jogos da Fase de Grupos:</div>
                            {jogosGrupo.map((jogo) => (
                                <JogoDisplayGest idTorneio = {idTorneio} jogo={jogo} desporto = {desporto} isGrupo={true} funcao={handlererender}/>
                            ))}
                            </div>
                            </>
                        ) : (
                            <div class="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-200" role="alert">
                                <span class="font-medium">A fase de grupos não se encontra sorteada</span></div>
                        )}
                    </section>
                : 
                    <section className="eliminatorias">
                        {jogosElim?.length > 0 ? (
                            <>
                            <div class="border border-gray-300 rounded-md mx-4 mt-10 p-4">
                                <div class="px-6 mb-4 text-lg text-coolGray-900 font-semibold">Jogos da Fase Eliminatória:</div>
                            {jogosElim.map((jogo) => (
                                <JogoDisplayGest idTorneio = {idTorneio} jogo={jogo} desporto = {desporto} isGrupo={false} funcao={handlererender}/>
                            ))}
                            </div>
                            </>
                        ) : (
                            <div class="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-200" role="alert">
                                <span class="font-medium">A fase eliminatória não se encontra sorteada!</span>
                                    </div>
                        )}
                    </section>
            )
        }
        </>
    )
}