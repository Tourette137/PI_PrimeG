import {Link,Route,Routes} from 'react-router-dom';
import PrivateRoutes from './utils/PrivateRoutes'

import {Torneios} from './pages/Torneios.js';
import {Home} from './pages/Home.js';
import {Login} from './pages/Login.js';
import {Registo} from './pages/Registo.js';
import {Torneio} from './pages/Torneio.js';
import {Jogos} from './pages/Jogos.js';
import {Classificacao } from './pages/Classificacao.js';
import {NotFound} from './pages/NotFound.js';
import {Perfil} from './pages/Perfil.js';
import {RegistoTorneio} from './pages/RegistoTorneio.js';
import {PerfilInscrito} from './pages/PerfilInscrito.js';
import {PerfilFavoritos} from './pages/PerfilFavoritos.js';
import {PerfilHistorico} from './pages/PerfilHistorico.js';
import {PerfilHistoricoJogos} from './pages/PerfilHistoricoJogos.js';
import {PerfilNotificacoes} from './pages/PerfilNotificacoes.js';

function App() {

  return (
    <div className='App'>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/registo">Registo</Link></li>
          <li><Link to="/torneios">Torneios</Link></li>
          <li><Link to="/perfil">Perfil Utilizador</Link></li>
        </ul>
      </nav>
      <Routes>
          <Route path="/" element= {<Home/>}/>
          <Route path="/login" element= {<Login/>}/>
          <Route path="/registo" element= {<Registo/>}/>
          <Route path="/torneios">
            <Route index element= {<Torneios/>}/>
            <Route path=":id" element = {<Torneio/>}/>
          </Route>
          <Route path = "/:id/jogos" element = {<Jogos/>}/> 
          <Route path = "/:id/classificacao" element = {<Classificacao/>}/>
          <Route path = "*" element= {<NotFound/>}/>

          {/*A partir daqui, dentro do PrivateRoutes ficam as rotas privadas*/}
          <Route element={<PrivateRoutes />}>
                <Route element = {<Perfil/>} path="/perfil" exact/>
                <Route element = {<PerfilInscrito/>} path="/perfil/inscrito" exact/>
                <Route element = {<PerfilFavoritos/>} path="/perfil/favoritos" exact/>
                <Route element = {<PerfilHistorico/>} path="/perfil/historico" exact/>
                <Route element = {<PerfilHistoricoJogos/>} path="/perfil/historicoJogos" exact/>
                <Route element = {<PerfilNotificacoes/>} path="/perfil/notificacoes" exact/>
                <Route element = {<RegistoTorneio/>} path="/torneios/registo" exact/>
          </Route>
      </Routes>
    </div>
  );
}

export default App;