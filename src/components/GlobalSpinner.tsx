import '../styles/GlobalSpinner.css';
import { useLoading } from '../context/LoadingContext';

const GlobalSpinner = () => {
 const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="spinner-overlay">
      <div className="spinner" />
    </div>
  );
}

export default GlobalSpinner