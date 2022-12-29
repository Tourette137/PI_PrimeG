import React from 'react'

const PerfilDisplay = ({user}) => {
    return (
        <div className="user">
            
            <div>
                <p>Nome(Username): {user.Nome}</p>
            </div>

            <div>
                <p>E-mail: {user.email}</p>
            </div>

            <div>
                <p>Data de Nascimento: {user.dataNascimento}</p>
            </div>

            <div>
                {user.genero ?
                    (<p>Género: Feminino</p>)
                :   (<p>Género: Masculino</p>) 
                }
            </div>

        </div>
    )
}

export default PerfilDisplay;