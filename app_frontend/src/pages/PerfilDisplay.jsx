import React from 'react'
//import profileIcon from '../images/profileIcon.png'
import profileIcon from '../images/aboutUs/fotografia_BrunoDias.jpg'
import '../components/Buttons.css'


const PerfilDisplay = ({user, handleTooglePopup}) => {
    return (
        <div className="container grid-container">  
            
            <img className="profilePic" src={profileIcon} alt="Profile Pic"></img>

            <div className="nomePerfil">
                <h2>Nome:&nbsp;</h2>
                <h3>{user.Nome}</h3>
            </div>

            <div className="emailPerfil">
                <h2>E-mail:&nbsp;</h2>
                <h3>{user.email}</h3>
            </div>

            <div className="dataNascimentoPerfil">
                <h2>Data de Nascimento:&nbsp;</h2>
                <h3>{user.dataNascimento}</h3>
            </div>
            
            <div className="generoPerfil">
                <h2>Género:&nbsp;</h2>
                {user.genero ?
                    (<h3>Feminino</h3>)
                :   (<h3>Masculino</h3>) 
                }
                {
                    <div className="butoesAcceptBack" style={{marginLeft:"auto", right:"0", zIndex:"0"}}>
                        <button className="buttonOrange" onClick={handleTooglePopup} style={{margin:"0 10px 0 0", background:"transparent"}}>Logout</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default PerfilDisplay;