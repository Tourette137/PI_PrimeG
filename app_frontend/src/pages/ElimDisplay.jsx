import React from 'react'

const ElimDisplay = ({elim}) => {
    return (
        <>
          <div>
            <p>Etapa: {elim.nomeEtapa} </p>
            <p>Data: {elim.hora} Campo: {elim.numeroCampo}</p>
            {(elim.nomeEquipa1 != null && elim.nomeEquipa2 != null)
            ?
              (<p>{elim.nomeEquipa1} - {elim.nomeEquipa2}</p>)

            : (elim.nomeEquipa1 != null
              ?
                (<p>{elim.nomeEquipa1} - Empty</p>)
              : (elim.nomeEquipa2 != null
                ?
                  (<p>Empty - {elim.nomeEquipa2}</p>)
                :
                  (<p>Empty - Empty</p>)
                )
              )
            }
            <br/>
          </div>
        </>
    )
}

export default ElimDisplay;
