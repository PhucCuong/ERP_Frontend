import './App.css';
import { useState } from 'react';
import Menu from './components/Menu/Menu';
import MainScreen from './components/MainScreen/MainScreen';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
  


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // biến lưu tên người dùng để đưa vào home
  const [userName, setUserName] = useState('')

  return (
    <div className="App" style={{ height: '100vh', overflow: 'hidden'}}>
      {isLoggedIn ? (
        <>
          <Menu setUserName={setUserName}/>
          <MainScreen userName={userName}/>
        </>
      ) : showRegister ? (
        <Register onBackToLogin={() => setShowRegister(false)} />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} onRegister={() => setShowRegister(true)} />
      )}
    </div>
  );
}

export default App;
