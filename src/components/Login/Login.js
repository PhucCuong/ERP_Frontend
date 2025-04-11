import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ onLogin, onRegister }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const notify = (message) => toast.error(message);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post('https://localhost:7135/SignIn', {
                UserName: userName,
                Password: password
            });
            localStorage.setItem('userToken', response.data);
            onLogin(false);
            navigate('/bom');
        } catch (error) {
            if (error.response?.status === 401) {
                notify('Sai thông tin tên đăng nhập hoặc mật khẩu');
            } else {
                notify('Lỗi kết nối đến server: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=667131073291-hui1q0f9kk7vbdap6ffd6v0l2ojk6b3n.apps.googleusercontent.com&scope=openid%20profile%20email&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A7135%2Fsignin-google&code_challenge_method=S256&state=xyz`;
    };

    return (
        <div className='login-container'>
            <div className='title'>Login</div>
            <div className='model'>
                <div className='content'>
                    <div className='form'>
                        <label className='label'>Welcome Back</label>
                        <input className='input' placeholder='Enter your User name' onChange={(e) => setUserName(e.target.value)} />
                        <input type='password' className='input' placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
                        <div className='button-container'>
                            <button className='button register-btn' onClick={() => { onRegister(true); navigate('/register'); }}>Register</button>
                            <button className='button login-btn' onClick={handleLogin}>Login</button>
                        </div>
                    </div>
                    <button className='button login-google' onClick={handleGoogleLogin}>Log in with Google</button>
                </div>
            </div>
            {loading && <Loading />}
            <ToastContainer theme='colored' />
        </div>
    );
};

function Loading() {
    return (
        <div className='loading-overlay'>
            <Spinner animation='grow' variant='primary' />
        </div>
    );
}

export default Login;
