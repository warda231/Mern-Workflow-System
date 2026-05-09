import { useState } from 'react';
import { Route,Routes } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Requests from './Pages/Requests.jsx';
import Layout from './Components/Layout.jsx';
import ProtectedRoutes from './Components/ProtectedRoutes.jsx';





function App() {

  return (
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route element={<Layout/>}>
      <Route path='/dashboard' element={<ProtectedRoutes><Dashboard/></ProtectedRoutes>}/>
      <Route path='/requests' element={<ProtectedRoutes><Requests/></ProtectedRoutes>}/>
      

      </Route>
    </Routes>
     
  )
}

export default App
