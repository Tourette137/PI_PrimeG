import React from 'react'

const CalendarioDisplay = ({calendario}) => {
    return (
        <>
        <div className='Calendario'>
            <div>
                {calendario.tipo === 1
                  ?
                    (<p>Grupo {calendario.numero}</p>)
                  :
                    (<p>{calendario.nome}</p>)
                }
            </div>
            <div>
                {calendario.jogos.map((jogo) => (
                  <div>
                    <p>{jogo.hora.split('T')[1].split('.')[0]}</p>
                    <div>
                    {calendario.tipo === 1
                      ?
                        (<p> Jornada {jogo.ronda}   Campo {jogo.campo}</p>)
                      :
                        (<p> Ronda {jogo.ronda}   Campo {jogo.campo}</p>)
                    }
                    </div>
                  </div>
                ))}
            </div>
        </div>
        </>
    )
}

export default CalendarioDisplay;
