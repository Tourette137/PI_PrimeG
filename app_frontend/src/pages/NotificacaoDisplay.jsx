import React from 'react'

const NotificacaoDisplay = ({notificacao}) => {
    return (
        <div className="notification">
            
            <div>
                <p>Titulo(Username): {notificacao.Titulo}</p>
            </div>

            <div>
                <p>ID Torneio: {notificacao.Torneio_idTorneio}</p>
            </div>

            <div>
                {notificacao.Lido ?
                    (<p>Lido</p>)
                :   (<p>Por ler</p>) 
                }
            </div>

        </div>
    )
}

export default NotificacaoDisplay;