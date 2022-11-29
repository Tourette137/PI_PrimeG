import {Link,Route,Routes} from 'react-router-dom';
import {Torneios} from './pages/Torneios.js';
import {Home} from './pages/Home.js';
import {Torneio} from './pages/Torneio.js';
import {NotFound} from './pages/NotFound.js';

function App() {
  return (
    <div className='App'>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/torneios">Torneios</Link></li>
        </ul>
      </nav>
      <Routes>
          <Route path="/" element= {<Home/>}/>
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
