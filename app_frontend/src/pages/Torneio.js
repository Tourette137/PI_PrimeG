//Componente de um único Torneio

import {useParams} from 'react-router-dom'

export function Torneio() {
    const {id} = useParams()
    return(
        <h1>Página do torneio {id}</h1>
    )
}