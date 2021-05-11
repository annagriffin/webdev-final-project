import 'bootstrap/dist/css/bootstrap.min.css'
import MainView from './MainView'
import Login from './Login'

const code = new URLSearchParams(window.location.search).get('code')

function App() {
  return code ? <MainView code={code} /> : <Login />
}

export default App;
