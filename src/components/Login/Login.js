import './Login.css'
const Login = () => {
    return(
        <div className='container'>
            <div className='title'>Login</div>
            <div className='model'>
                <div className='content'>
                    <form className='form'>
                        <label className='label'>Welcome Back</label>

                        <input className='input email'placeholder='Enter your email'/>
                        <input className='input' placeholder='Enter your password'/>

                        <button className='button register-btn'>Register</button>
                        <button className='button login-btn'>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login