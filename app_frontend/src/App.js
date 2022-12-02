import {Link,Route,Routes} from 'react-router-dom';
import {Torneios} from './pages/Torneios.js';
import {Home} from './pages/Home.js';
import {Login} from './pages/Login.js';
import {Registo} from './pages/Registo.js';
import {Torneio} from './pages/Torneio.js';
import {NotFound} from './pages/NotFound.js';

function App() {
  return (
    <div className='App'>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/registo">Registo</Link></li>
          <li><Link to="/torneios">Torneios</Link></li>
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
          <Route path="*" element= {<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
