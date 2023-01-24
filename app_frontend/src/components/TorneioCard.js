import React from 'react'

const TorneioCard = ({torneio}) => {
    return (
      <div className= "w-full m-2">
        <div className="flex-wrap p-4 md:flex mx-auto hover:bg-gray-200 shadow-2xl shadow-gray-300 rounded-2xl md:h-[200px] md:w-[700px] w-[350px] h-[400px] bg-white">
            <div className="mx-auto w-[170px] h-[170px] bg-black">
                <img
                  src={"../images/logotipo.png"}
                  className=""
                />
            </div>
            <div className="w-[320px] md:w-[450px] md:h-[175px] h-[190px]  mt-4 md:mt-1 mx-auto text-left">
                <h1 className="text-xl font-bold text-center">{torneio.nomeTorneio}</h1>
                <p>Desporto: {torneio.nomeDesporto}</p>
                <p>Localidade: {torneio.Nome}</p>
                <p>Elementos por equipa: {torneio.tamEquipa}</p>
                <p>Tipo do Torneio: {torneio.nometipoTorneio}</p>
                <p>Escalão: {torneio.escalao}</p>
                <p>Data: {torneio.dataTorneio}</p>
            </div>
        </div>
      </div>
    )
}

export default TorneioCard;
