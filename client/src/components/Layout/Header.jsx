import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📝</span>
          <span className="logo-text">NodePad</span>
        </Link>

        <form className="search-bar" onSubmit={handleSearch}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <Link to="/note/new" className="btn btn-primary">
          <Plus size={18} />
          New Note
        </Link>
      </div>
    </header>
  );
}

export default Header;