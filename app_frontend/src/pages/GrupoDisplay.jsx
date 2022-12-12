import React from 'react'

const GrupoDisplay = ({grupo}) => {
    return (
        <>
        <div className='Grupo'>
            <div>
                <h1>Grupo {grupo.numeroGrupo}</h1>                
            </div>
            <div>
                {grupo.classificacaoGrupo.map((classificacao) => (
                    <div>{"Equipa:" + `${classificacao.split('-')[0]}`+ " | Pontos: "+`${classificacao.split('-')[1]}` }</div>
                ))}
            </div>
        </div>
        </>
    )
}

export default GrupoDisplay;