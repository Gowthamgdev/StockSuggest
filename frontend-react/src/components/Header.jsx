import React, {useContext} from 'react'
import Button from './Button'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'

const Header = () => {
    const {isLoggedIn, setIsLoggedIn} =useContext(AuthContext)
    const navigate= useNavigate();
    //you can use usenavigate directly so u need to intialize this 

    const handleLogout=()=>{
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setIsLoggedIn(false)
      console.log("logout")
      navigate('/login')

    }
  
  return (
    <>
    {/* <div className="mb3"> */}
    <nav className='navbar container pt-3 pb-3 align-items-start'>
        <Link className='navbar-brand text-light' to="/">SuggestStock</Link>

        <div>
          {isLoggedIn ? (
            <>
            <Button text='Dashboard1' class="btn-info" url="/dashboard1"/>
            &nbsp;
            <Button text='Dashboard' class="btn-info" url="/dashboard"/>
            &nbsp;
            <button className='btn btn-danger'onClick={handleLogout}>Logout</button>
            </>
          ) : (
          <>
            <Button text='Register' class="btn-info" url="/register"/>
            &nbsp;
            <Button text='Login' class="btn-outline-info" url="/Login"/>
          </>)}
        </div>
    </nav>
    {/* <hr class="border border-secondary-subtle" />
    </div> */}

    </>
  )
}

export default Header