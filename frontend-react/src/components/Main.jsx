import React from 'react'
import Button from './Button'
import Header from './Header'
import Footer from './Footer'
import { useContext } from 'react'
import { AuthContext } from '../AuthProvider'
const Main = () => {
  const {isLoggedIn, setIsLoggedIn} =useContext(AuthContext)
  return (
    <>
        <div className='container'>
            <div className='p-5 text-center bg-light-dark'>
                <h1 className='text-light'>SuggestStock</h1>
                <p className='text-light lead'>This website built by Gowtham</p>
                
                {isLoggedIn ? (
                <Button text="Explore Now" class="btn-outline-info" url="/dashboard"/>
                ) : (
                <Button text="Explore Now" class="btn-outline-info" url="/login"/>)}
                
            </div>
        </div>
    </>
  )
}

export default Main