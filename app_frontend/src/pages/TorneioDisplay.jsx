import React from 'react'
import '../components/containerTorneios.css'

const TorneioDisplay = ({torneio}) => {
    return (
        <div className="torneioDisplay">
            <div className='nome'>
            <p>Nome: {torneio.nomeTorneio}</p>
            </div>

            <div className='data'>
                <p>Data: {torneio.dataTorneio}</p>
            </div>

            <div className='desporto'>
                <p>Desporto: {torneio.nomeDesporto}</p>
            </div>

            <div className='escalao'>
                <p>Escalão: {torneio.escalao}</p>
            </div>

            <div className='localidade'>
                <p>Localidade: {torneio.Nome}</p>
            </div>

            <div className='federado'>
            {torneio.isFederado ?
                (<p> Federado </p>)
            :   (<p> Amador </p>)
            }
            </div>

            <div className='tipoTorneio'>
                <p>Tipo do Torneio: {torneio.nometipoTorneio}</p>
            </div>

            <div className='elementos'>
                <p>Elementos por equipa: {torneio.tamEquipa}</p>
            </div>

        </div>
    );
}

export default TorneioDisplay;
