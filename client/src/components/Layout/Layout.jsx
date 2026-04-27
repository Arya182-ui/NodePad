import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notesAPI } from '../../services/api';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

function Layout() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch notes from API
  const fetchNotes = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await notesAPI.getAll();
      setNotes(response.data || []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div className="layout-new">
      <Sidebar
        notes={notes}
        onRefresh={fetchNotes}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="main-content-new">
        <Outlet context={{ notes, refreshNotes: fetchNotes }} />
      </main>
    </div>
  );
}

export default Layout;
