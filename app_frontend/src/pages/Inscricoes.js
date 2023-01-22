import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';


const API_URL="http://localhost:3000"

export function Inscricoes(props) {

    const id = props.id;
    const inscricoesAbertas = props.inscricoesAbertas;

    const handleFecharInscricoes = async (e) => {
        e.preventDefault();
        const headers = {
            "authorization": "Bearer " +localStorage.getItem("token")
        }
        const tipo = (inscricoesAbertas == 1) ? 0 : 1
        const body = {
            "tipo" : tipo
        }

        axios.post(`${API_URL}/torneios/${id}/gestao/fecharInscricoes`, body,{headers: headers})
            .then(response => {
        }).catch(e => console.log(e))
    }

    return(
        <>{(inscricoesAbertas === 1 )
            ?
              (<button onClick={handleFecharInscricoes}>Fechar Inscriçoes</button>)
            :
              (<button onClick={handleFecharInscricoes}>Abrir Inscriçoes</button>)
          }
        </>
    )
}