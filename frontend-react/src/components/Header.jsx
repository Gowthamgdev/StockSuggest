import React from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
    <nav className='navbar container pt-3 pb-3 align-items-start'>
        <Link className='navbar-brand text-light' to="/">TeamSuggest</Link>

        <div>
            <Button text='Login' class="btn-outline-info" url="/Login"/>
            &nbsp;
            <Button text='Register' class="btn-info" url="/register"/>
        </div>
    </nav>
    </>
  )
}

export default Header