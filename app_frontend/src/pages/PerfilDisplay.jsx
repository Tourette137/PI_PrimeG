import React from 'react'
import profileIcon from '../images/profileIcon.png'
import '../components/Buttons.css'


const PerfilDisplay = ({user, handleTooglePopup, handleTooglePopupNewImage}) => {
    return (
        <div className="containerDiv grid-container">  
            
            <div className="profilePic">
                {(user.imageUrl === null) ?
                    (<img src={profileIcon} alt="Profile Picture"></img>)
                :   (<img src={user.imageUrl} alt="Profile Picture2"></img>)
                }
                <a className="editButton" onClick={handleTooglePopupNewImage} style={{cursor: "pointer"}}>
                    <i className="uil uil-image-edit"></i>
                </a>
            </div>
            

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