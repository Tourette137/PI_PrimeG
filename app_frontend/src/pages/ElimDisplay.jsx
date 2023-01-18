import React from 'react'

const ElimDisplay = ({elim}) => {
    return (
        <>
          <div>
            <p>Ronda {elim.numeroRonda} </p>
            <p>{elim.nomeEquipa1}</p>
            <p>{elim.nomeEquipa2}</p>
            <br/>
          </div>
        </>
    )
}

export default ElimDisplay;
