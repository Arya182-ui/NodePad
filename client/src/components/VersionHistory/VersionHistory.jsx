import { useState, useEffect } from 'react';
import { notesAPI } from '../../services/api';
import { History, RotateCcw, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './VersionHistory.css';

export default function VersionHistory({ noteId, onRestore, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [restoring, setRestoring] = useState(null);

  useEffect(() => {
    notesAPI.getVersions(noteId)
      .then(res => setVersions(res.data || []))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false));
  }, [noteId]);

  const handleRestore = async (versionId) => {
    if (!window.confirm('Restore this version? Current content will be saved as a new version.')) return;
    try {
      setRestoring(versionId);
      const res = await notesAPI.restoreVersion(noteId, versionId);
      toast.success('Version restored');
      onRestore(res.data);
      onClose();
    } catch {
      toast.error('Failed to restore version');
    } finally {
      setRestoring(null);
    }
  };

  const fmt = (d) => new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });

  return (
    <div className="vh-overlay" onClick={onClose}>
      <div className="vh-panel" onClick={e => e.stopPropagation()}>
        <div className="vh-header">
          <div className="vh-title">
            <History size={16} strokeWidth={2} />
            Version History
          </div>
          <button className="vh-close" onClick={onClose}>
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="vh-body">
          {loading ? (
            <div className="vh-loading"><Loader2 size={20} className="ne-spinner" /></div>
          ) : versions.length === 0 ? (
            <div className="vh-empty">No versions saved yet. Versions are created automatically when you edit a note.</div>
          ) : (
            <ul className="vh-list">
              {versions.map((v, i) => (
                <li key={v.id} className="vh-item">
                  <div className="vh-item__info">
                    <span className="vh-item__title">{v.title || 'Untitled'}</span>
                    <span className="vh-item__date">{fmt(v.savedAt)}</span>
                    {i === 0 && <span className="vh-badge">Latest</span>}
                  </div>
                  <button
                    className="vh-restore-btn"
                    onClick={() => handleRestore(v.id)}
                    disabled={!!restoring}
                    title="Restore this version"
                  >
                    {restoring === v.id
                      ? <Loader2 size={13} className="ne-spinner" />
                      : <RotateCcw size={13} strokeWidth={2} />}
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
