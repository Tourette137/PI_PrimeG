import React from 'react'

const EspacoDisplay = ({nome,rua,contacto,desporto,localidade,numeroMesas}) => {
    return (
        <div className="Espaco">
            <div>
             <p>Nome: {nome}</p>
             </div>
            <div>
                <p>Rua: {rua}</p>
            </div>
            <div>
                <p>Contacto: {contacto}</p>
            </div>
            <div>
                <p>Localidade: {localidade}</p>
            </div>
            <div>
                <p>Desporto: {desporto}</p>
            </div>
            <div>
                <p>Número de campos: {numeroMesas}</p>
            </div>
        </div>
    )
}

export default EspacoDisplay;
