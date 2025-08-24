import React, { useEffect } from 'react'
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate= useNavigate()
  const {setToken, setUser, setIsLoggedIn}= useUser();
  useEffect(() => {
  setToken('');
  setUser(undefined);
  setIsLoggedIn(false);
  sessionStorage.removeItem('token');
  navigate('/login');
}, []);
  return (
    <div>Logout</div>
  )
}

export default Logout