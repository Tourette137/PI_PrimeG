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
                    (grupo.tipoClassificacao == 1) 
                        ? 
                        <div>{"Equipa:" + `${classificacao.split('-')[0]}`+ " | Pontos: "+`${classificacao.split('-')[2]}` }</div>
                    :
                    <div>{"Equipa:" + `${classificacao.split('-')[0]}`+ " | Pontos: "+`${classificacao.split('-')[2]}` }</div>
                ))}
            </div>
        </div>
        </>
    )
}

export default GrupoDisplay;