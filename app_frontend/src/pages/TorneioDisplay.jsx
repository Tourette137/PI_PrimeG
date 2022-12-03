import React from 'react'

const TorneioDisplay = ({torneio}) => {
    return (
        <div className="torneio">
            <div>
            <p>Nome: {torneio.nomeTorneio}</p>
            </div>

            <div>
            {torneio.isFederado ?
                (<p>Tipo: Federado</p>)
            :   (<p>Tipo: Amador</p>) 
            }
            </div>

            <div>
                <p>Data: {torneio.dataTorneio}</p>
            </div>

            <div>
                <p>Escalão: {torneio.escalao}</p>
            </div>

            <div>
                <p>Tipo do Torneio: {torneio.tipoTorneio}</p>
            </div>

            <div>
                <p>Desporto: {torneio.nomeDesporto}</p>
            </div>

            <div>
                <p>Localidade: {torneio.Nome}</p>
            </div>

        </div>
    )
}

export default TorneioDisplay;