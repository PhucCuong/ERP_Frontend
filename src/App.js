import './App.css';
import Menu from './components/Menu/Menu';
import MainScreen from './components/MainScreen/MainScreen'
import Login from './components/Login/Login';
import Register from './components/Register/Register'

function App() {
  return (
    <div className="App" style={{height: '100vh', overflow: 'hidden'}}>
      <Menu/>
      <MainScreen/>

      {/* <Login/> */}
    </div>
  );
}

export default App;
