import React from 'react'
import Button from './Button'
import Header from './Header'
import Footer from './Footer'

const Main = () => {
  return (
    <>
        <div className='container'>
            <div className='p-5 text-center bg-light-dark'>
                <h1 className='text-light'>TeamSuggest</h1>
                <p className='text-light lead'>This one of the secure and advance team management system. Can be used for company, communities, etc</p>
                <Button text="Login now" class="btn-outline-info"/>
            </div>
        </div>
    </>
  )
}

export default Main