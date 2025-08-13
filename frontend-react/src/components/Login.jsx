import React, {useContext, useState } from "react"
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { AuthContext } from "../AuthProvider";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState('');
  const {isLoggedIn, setIsLoggedIn} =useContext(AuthContext)

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userData = { username, password };
    console.log('Login data:', userData);

    try{
      const response = await axios.post("http://127.0.0.1:8000/api/v1/token/", userData);
      localStorage.setItem('accessToken',response.data.access);
      localStorage.setItem('refreshToken',response.data.refresh);
      // console.log('Login successful:', response.data);
      setIsLoggedIn(true)
      navigate('/dashboard');

    }catch (error) {
      setErrors('Invalid username or password');
    }finally {
      setLoading(false);
    }

  }
  return (
     <>
    <div className='container'>
        <div className="row justify-content-center">
            <div className="col-md-6 bg-light-dark p-5 rounded">
                <h2 className='text-light text-center mb-4'>Login to Your Account</h2>
                <form onSubmit={handleLogin}>
                  <div className='mb-3'>
                    <input type="text" className='form-control' placeholder='Enter the username' value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
                  </div>
                  <div className=' mb-3 '>
                    <input type="password" className="form-control" placeholder='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                  </div>
                  {errors && <div className='text-danger'>{errors}</div>}

                  {loading?(
                    <button type="submit" className='btn btn-info d-block mx-auto' disabled>Loging..</button>
                  ):(
                    <button type="submit" className='btn btn-info d-block mx-auto'>Login</button>
                  )}
                    
                </form>
            </div>
        </div>

    </div>
    
    </>
  )
}

export default Login