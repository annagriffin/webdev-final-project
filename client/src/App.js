import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Login'
import Dashboard from './Dashboard'
import MainView from './MainView'

const code = new URLSearchParams(window.location.search).get('code')

function App() {
  return code ? <MainView code={code} /> : <Login />
}

export default App;
