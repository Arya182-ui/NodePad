import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Menu, X, LogOut, FileText, Keyboard, Trash2, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PageTree from './PageTree';
import SearchModal from '../Search/SearchModal';
import ShortcutsModal from '../Shortcuts/ShortcutsModal';
import './Sidebar.css';

export default function Sidebar({ notes = [], onRefresh, isOpen, onToggle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [showSearch, setShowSearch]     = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Cmd/Ctrl + K → search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      // Cmd/Ctrl + / → shortcuts panel
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(s => !s);
      }
      // Cmd/Ctrl + N → new note
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        navigate('/note/new');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  const closeSidebar = () => {
    if (window.innerWidth < 1024) onToggle();
  };

  return (
    <>
      {/* ── hamburger ── */}
      <button
        className={`sidebar-toggle ${isOpen ? 'hidden' : ''}`}
        onClick={onToggle}
        aria-label="Open menu"
      >
        <Menu size={18} strokeWidth={2} />
      </button>

      {/* ── sidebar ── */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>

        {/* header */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={closeSidebar}>
            <div className="sidebar-logo-icon">✦</div>
            <span className="sidebar-logo-text">NodePad</span>
          </Link>
          <button className="sidebar-close" onClick={onToggle} aria-label="Close">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* search trigger */}
        <div className="sidebar-search-btn" onClick={() => setShowSearch(true)}>
          <Search size={14} strokeWidth={2} />
          <span>Search…</span>
          <kbd>⌘K</kbd>
        </div>

        {/* nav */}
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item" onClick={closeSidebar}>
            <FileText size={15} strokeWidth={2} />
            <span>All Notes</span>
          </Link>
          <button
            className="nav-item new-note-btn"
            onClick={() => { navigate('/note/new'); closeSidebar(); }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>New Page</span>
            <kbd className="nav-kbd">⌘N</kbd>
          </button>
        </nav>

        {/* page tree */}
        <div className="sidebar-section">
          <div className="section-header">
            <div className="section-title">PAGES</div>
            <span className="note-count">{notes.length}</span>
          </div>
          <PageTree
            notes={notes}
            onRefresh={onRefresh}
            onClose={closeSidebar}
          />
        </div>

        {/* footer */}
        <div className="sidebar-footer">
          <button className="footer-btn" onClick={() => setShowShortcuts(true)}>
            <Keyboard size={14} strokeWidth={2} />
            <span>Shortcuts</span>
            <kbd className="footer-kbd">⌘/</kbd>
          </button>

          <Link to="/trash" className="footer-btn" onClick={closeSidebar}>
            <Trash2 size={14} strokeWidth={2} />
            <span>Trash</span>
          </Link>

          <button className="footer-btn" onClick={toggle}>
            {theme === 'dark'
              ? <Sun  size={14} strokeWidth={2} />
              : <Moon size={14} strokeWidth={2} />
            }
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>

          {user && (
            <div className="sidebar-user">
              <div className="sidebar-user__avatar">
                {user.photoURL
                  ? <img src={user.photoURL} alt="" />
                  : <span>{user.displayName?.[0] || user.email?.[0] || '?'}</span>
                }
              </div>
              <div className="sidebar-user__info">
                <div className="sidebar-user__name">{user.displayName || 'User'}</div>
                <div className="sidebar-user__email">{user.email}</div>
              </div>
              <button className="sidebar-user__logout" onClick={logout} title="Sign out">
                <LogOut size={14} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      {/* modals */}
      {showSearch    && <SearchModal    onClose={() => setShowSearch(false)} />}
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </>
  );
}
