import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

const PAGE_SIZE = 50;

function Layout() {
  const { user }                      = useAuth();
  const [notes, setNotes]             = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unsubRef                      = useRef(null);

  // Real-time Firestore listener — replaces polling fetchNotes
  const subscribeToNotes = useCallback(() => {
    if (!user) return;

    // Unsubscribe from any previous listener
    if (unsubRef.current) unsubRef.current();

    const notesRef = collection(db, 'users', user.uid, 'notes');
    const q = query(
      notesRef,
      where('deleted', '!=', true),
      orderBy('deleted'),
      orderBy('updatedAt', 'desc'),
      limit(PAGE_SIZE),
    );

    unsubRef.current = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(docs);
    }, (err) => {
      console.error('Notes listener error:', err);
    });
  }, [user]);

  useEffect(() => {
    subscribeToNotes();
    return () => { if (unsubRef.current) unsubRef.current(); };
  }, [subscribeToNotes]);

  return (
    <div className="layout-new">
      <Sidebar
        notes={notes}
        onRefresh={subscribeToNotes}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="main-content-new">
        <Outlet context={{ notes, refreshNotes: subscribeToNotes }} />
      </main>
    </div>
  );
}

export default Layout;
