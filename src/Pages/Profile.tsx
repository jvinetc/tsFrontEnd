import { useUser } from '../context/UserContext';

const Profile = () => {
   const {token} = useUser();
    
    console.log("token:", !token?'':token);
  return (
    <div>Profile</div>
  )
}

export default Profile