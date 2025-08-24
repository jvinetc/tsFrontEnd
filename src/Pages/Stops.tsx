import React, { useEffect } from 'react'
import { useUser } from '../context/UserContext';

const Stops = () => {
  const { token } = useUser();
  useEffect(() => {
    const loadStops = async () => {

    }
    loadStops();
  }, []);
  return (
    <div>Stops</div>
  )
}

export default Stops