import React from 'react'

const EspacoDisplay = ({nome,rua,contacto,desporto,localidade,nMesas}) => {
    return (
        <div className="Espaco">
            <div>
             <p>Nome: {nome}</p>
             </div>
            <div>
                <p>Rua: {rua}</p>
            </div>
            <div>
                <p>contacto: {contacto}</p>
            </div>
            <div>
                <p>localidade: {localidade}</p>
            </div>
            <div>
                <p>desporto: {desporto}</p>
            </div>
            <div>
                <p>numero de mesas: {nMesas}</p>
            </div>
        </div>
    )
}

export default EspacoDisplay;
