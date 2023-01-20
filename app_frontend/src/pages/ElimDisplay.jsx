import React from 'react'

const ElimDisplay = ({elim}) => {
    return (
        <>
          <div>
            <p>Etapa: {elim.nomeEtapa} </p>
            <p>{elim.nomeEquipa1} x {elim.nomeEquipa2}  Data: {elim.hora} Campo: {elim.numeroCampo}</p>
            <br/>
          </div>
        </>
    )
}

export default ElimDisplay;
