import { useState } from 'react';
import { Image, X, Shuffle } from 'lucide-react';
import './CoverImage.css';

// Gradient covers (no external images needed)
const GRADIENTS = [
  'linear-gradient(135deg, #1e3a5f 0%, #0f2027 100%)',
  'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
  'linear-gradient(135deg, #200122 0%, #6f0000 100%)',
  'linear-gradient(135deg, #0a3d62 0%, #1e3799 100%)',
  'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
  'linear-gradient(135deg, #1b2838 0%, #2a475e 100%)',
  'linear-gradient(135deg, #2c003e 0%, #1a0533 100%)',
];

export default function CoverImage({ cover, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const randomGradient = () => {
    const g = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
    onChange(g);
  };

  if (!cover) {
    return (
      <div className="cover-empty">
        <button className="cover-add-btn" onClick={randomGradient}>
          <Image size={14} strokeWidth={2} />
          Add cover
        </button>
      </div>
    );
  }

  return (
    <div className="cover-wrap">
      <div
        className="cover-img"
        style={
          cover.startsWith('linear-gradient') || cover.startsWith('radial-gradient')
            ? { background: cover }
            : { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        }
      />
      <div className="cover-actions">
        <button className="cover-action-btn" onClick={randomGradient}>
          <Shuffle size={13} strokeWidth={2} /> Change
        </button>
        <button className="cover-action-btn cover-action-btn--remove" onClick={() => onChange('')}>
          <X size={13} strokeWidth={2} /> Remove
        </button>
      </div>
    </div>
  );
}
