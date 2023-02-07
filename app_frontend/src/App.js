import {Link,Route,Routes} from 'react-router-dom';
import PrivateRoutes from './utils/PrivateRoutes'
import {QueryClientProvider} from '@tanstack/react-query'
import queryClient from './requests'

import {Torneios} from './pages/Torneios.js';
import {Gestao} from './pages/Gestao.js';
import {Espacos} from './pages/Espacos.js';
import {Home} from './pages/Home.js';
import {Login} from './pages/Login.js';
import {Registo} from './pages/Registo.js';
import {Torneio} from './pages/Torneio.js';
import {Jogos} from './pages/Jogos.js';
import {Classificacao } from './pages/Classificacao.js';
import {CalendarioPage} from './pages/CalendarioPage.js';
import {NotFound} from './pages/NotFound.js';
import {Perfil} from './pages/Perfil.js';
import {RegistoTorneio} from './pages/RegistoTorneio.js';
import {RegistoEspaco} from './pages/RegistoEspaco.js';
import {PerfilInscrito} from './pages/PerfilInscrito.js';
import {PerfilFavoritos} from './pages/PerfilFavoritos.js';
import {PerfilHistorico} from './pages/PerfilHistorico.js';
import {PerfilHistoricoJogos} from './pages/PerfilHistoricoJogos.js';
import {PerfilNotificacoes} from './pages/PerfilNotificacoes.js';
import {LocalidadesFavoritas} from './pages/LocalidadesFavoritas.js';
import {DesportosFavoritos} from './pages/DesportosFavoritos.js';


import {NavbarDynamic} from './components/NavbarDynamic.js';
import {Footer} from './components/Footer.js';
import './App.css'

function App() {

  return (
    <QueryClientProvider client = {queryClient}>
      <div className="min-h-screen">
      <Routes>
          <Route path="/" element= {<Home/>}/>
          <Route path="/login" element= {<Login/>}/>
          <Route path="/registo" element= {<Registo/>}/>
          <Route path="/torneios">
            <Route index element= {<Torneios/>}/>
            <Route path=":id" element = {<Torneio/>}/>
          </Route>
          <Route path="/espacos">
            <Route index element= {<Espacos/>}/>
          </Route>
          <Route path = "/:id/jogos" element = {<Jogos/>}/>
          <Route path = "/:id/classificacao" element = {<Classificacao/>}/>
          <Route path = "/:id/calendario" element = {<CalendarioPage/>}/>
          <Route path = "/:id/gestao" element = {<Gestao/>}/>
          <Route path = "*" element= {<NotFound/>}/>

          {/*A partir daqui, dentro do PrivateRoutes ficam as rotas privadas*/}
          <Route element={<PrivateRoutes />}>
                <Route element = {<Perfil/>} path="/perfil" exact/>
                <Route element = {<PerfilInscrito/>} path="/perfil/inscrito" exact/>
                <Route element = {<PerfilFavoritos/>} path="/perfil/favoritos" exact/>
                <Route element = {<PerfilHistorico/>} path="/perfil/historico" exact/>
                <Route element = {<PerfilHistoricoJogos/>} path="/perfil/historicoJogos" exact/>
                <Route element = {<PerfilNotificacoes/>} path="/perfil/notificacoes" exact/>
                <Route element = {<LocalidadesFavoritas/>} path="/perfil/localidadesFavoritas" exact/>
                <Route element = {<DesportosFavoritos/>} path="/perfil/desportosFavoritos" exact/>
                <Route element = {<RegistoTorneio/>} path="/torneios/registo" exact/>
                <Route element = {<RegistoEspaco/>} path="/espacos/registo" exact/>
          </Route>
      </Routes>
      </div>
      <Footer/>
    </QueryClientProvider>


  );
}

export default App;
