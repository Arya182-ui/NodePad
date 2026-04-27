import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import './NotFound.css';

function NotFound() {
  return (
    <div className="container">
      <div className="not-found">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;