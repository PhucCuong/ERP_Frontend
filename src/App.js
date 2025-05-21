import './App.css';
import { useEffect, useState } from 'react';

import Menu from './components/Menu/Menu';
import MainScreen from './components/MainScreen/MainScreen';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [route, setRoute] = useState(window.location.pathname);

  // Danh sách các đường dẫn hợp lệ
  const validRoutes = ['/login', '/register', '/home'];

  // Khi app load, kiểm tra nếu URL không hợp lệ thì chuyển về /login
  useEffect(() => {
    if (!validRoutes.includes(window.location.pathname)) {
      window.history.replaceState({}, '', '/login');
      setRoute('/login');
    }

    const handlePopState = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setRoute(path);
  };

  return (
    <div className="App" style={{ height: '100vh', overflow: 'hidden' }}>
      {isLoggedIn && route === '/home' ? (
        <>
          <Menu setUserName={setUserName} />
          <MainScreen userName={userName} />
        </>
      ) : route === '/register' ? (
        <Register onBackToLogin={() => navigate('/login')} />
      ) : (
        <Login
          onLogin={() => {
            setIsLoggedIn(true);
            navigate('/home');
          }}
          onRegister={() => navigate('/register')}
        />
      )}
    </div>
  );
}

export default App;
