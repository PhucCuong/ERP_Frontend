import './Login.css'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import "bootstrap/dist/css/bootstrap.min.css";
const Login = ({ onLogin, onRegister }) => {
    const navigate = useNavigate()

    const [UserName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true)
        setInterval(() => {
            setLoading(false)
        }, 1000);
        try {
            const response = await axios.post('https://localhost:7135/SignIn', {
                UserName: UserName,
                Password: password
            });

            localStorage.setItem('userToken', response.data);
            onLogin(false)
            navigate('/bom')
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('Sai thông tin tên đăng nhập hoặc mật khẩu');
                notify('Sai thông tin tên đăng nhập hoặc mật khẩu')
            } else {
                console.log('Lỗi kết nối đến server:', error.message);
                notify('Lỗi kết nối đến server:', error.message)
            }
        }
        // onLogin(false)
        // navigate('/bom')
    }

    const notify = (message) => toast.info(message, {
        type: "error"
    });

    return (
        <div className='login-container'>
            
            <div className='title'>Login</div>
            <div className='model'>
                <div className='content'>
                    <div className='form'>
                        <label className='label'>Welcome Back</label>

                        <input className='input' placeholder='Enter your User name' onChange={(e) => setUserName(e.target.value)} />
                        <input type='password' className='input' placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />

                        <button className='button register-btn' onClick={() => {
                            onRegister(true)
                            navigate('/register')
                        }}>Register</button>
                        <button className='button login-btn' onClick={() => handleLogin()}>Login</button>
                    </div>
                </div>
            </div>

            {loading && <Loading />} {/* Hiển thị Loading khi đang xử lý */}
            <ToastContainer theme="colored" />
        </div>
    )
}

function Loading() {
    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                backgroundColor: "rgba(0, 0, 0, 0.2)", // Màu nền mờ
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999, // Đảm bảo hiển thị trên tất cả
                position: 'fixed',
                top: 0,
                right: 0,
            }}
        >
            <Spinner animation="grow" variant="primary" />
        </div>
    );
}

export default Login