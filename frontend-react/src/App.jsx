import { useState } from 'react'
import './assets/css/style.css'
import Main from './components/Main'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Register from './components/Register'
import Login from './components/Login'
import AuthProvider from './AuthProvider'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import Dashboard1 from './components/dashboard/Dashboard1'

function App() {

  return (
    <>
    <AuthProvider>
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Main/>}/>
      <Route path='/register' element={<PublicRoute><Register/></PublicRoute>}/>
      <Route path='/login' element={<PublicRoute><Login/></PublicRoute>}/>
      <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
      <Route path='/dashboard1' element={<PrivateRoute><Dashboard1/></PrivateRoute>}/>

    </Routes>
    <Footer/>
    </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App
