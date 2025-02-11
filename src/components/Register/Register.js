import './Register.css'
const Register = () => {
    return (
        <div className='container'>
            <div className='title'>Register</div>
            <div className='model'>
                <div className='content'>
                    <form className='form'>
                        <label className='label'>Create a new account</label>

                        <input className='input email'placeholder='Enter your email'/>
                        <input className='input' placeholder='Enter your password'/>
                        <input className='input' placeholder='Retype your password'/>

                        <button className='button register-btn'>Login</button>
                        <button className='button login-btn'>Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register