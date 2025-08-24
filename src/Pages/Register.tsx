import { useUser } from '../context/UserContext';

const Register = () => {
   const {token} = useUser();
    
    console.log("token:", !token?'':token);
  return (
    <div>Register</div>
  )
}

export default Register