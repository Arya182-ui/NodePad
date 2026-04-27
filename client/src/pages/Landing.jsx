import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Zap, Check, Sun, Moon } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <div className="lp">

      {/* ── NAV ── */}
      <nav className="lp-nav">
        <div className="lp-nav__inner">
          <div className="lp-nav__logo">
            <div className="lp-nav__icon">✦</div>
            <span>NodePad</span>
          </div>
          <div className="lp-nav__links">
            <button className="lp-theme-btn" onClick={toggle} title="Toggle theme">
              {theme === 'dark' ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
            </button>
            {user ? (
              <Link to="/" className="lp-btn lp-btn--primary">
                Open App <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link to="/login"  className="lp-btn lp-btn--ghost">Sign in</Link>
                <Link to="/signup" className="lp-btn lp-btn--primary">
                  Get started <ArrowRight size={15} />
                </Link>
              </>
            )}}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero__glow lp-hero__glow--1" />
        <div className="lp-hero__glow lp-hero__glow--2" />

        <div className="lp-badge">
          <Zap size={12} /> Notion-level note taking
        </div>

        <h1 className="lp-hero__title">
          Write. Think.<br />
          <span className="lp-gradient">Organise everything.</span>
        </h1>

        <p className="lp-hero__sub">
          A powerful block-based workspace for your notes, ideas, and tasks.
          Built for speed. Designed for clarity.
        </p>

        <div className="lp-hero__cta">
          <Link to="/signup" className="lp-btn lp-btn--primary lp-btn--lg">
            Start for free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="lp-btn lp-btn--outline lp-btn--lg">
            Sign in
          </Link>
        </div>

        <p className="lp-hero__note">No credit card required · Free forever</p>

        {/* App preview */}
        <div className="lp-preview">
          <div className="lp-preview__bar">
            <span /><span /><span />
          </div>
          <div className="lp-preview__body">
            <div className="lp-preview__sidebar">
              <div className="lp-preview__logo">✦ NodePad</div>
              <div className="lp-preview__nav-item active">📄 My Notes</div>
              <div className="lp-preview__nav-item">📋 Projects</div>
              <div className="lp-preview__nav-item">✅ Tasks</div>
              <div className="lp-preview__nav-item">💡 Ideas</div>
            </div>
            <div className="lp-preview__editor">
              <div className="lp-preview__title">Product Roadmap 2025</div>
              <div className="lp-preview__tag">#product</div>
              <div className="lp-preview__h2">Q1 Goals</div>
              <div className="lp-preview__line w80" />
              <div className="lp-preview__line w60" />
              <div className="lp-preview__todo">
                <span className="checked" />
                <div className="lp-preview__line w50 strike" />
              </div>
              <div className="lp-preview__todo">
                <span />
                <div className="lp-preview__line w70" />
              </div>
              <div className="lp-preview__callout">
                <span>💡</span>
                <div className="lp-preview__line w90" />
              </div>
              <div className="lp-preview__h2">Q2 Goals</div>
              <div className="lp-preview__line w75" />
              <div className="lp-preview__line w55" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-features">
        <div className="lp-section-label">Features</div>
        <h2 className="lp-section-title">Everything you need to think clearly</h2>

        <div className="lp-features__grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="lp-feature-card">
              <div className="lp-feature-card__icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BLOCKS SHOWCASE ── */}
      <section className="lp-blocks">
        <div className="lp-blocks__left">
          <div className="lp-section-label">Block Editor</div>
          <h2 className="lp-section-title lp-section-title--left">
            Every type of content,<br />one place
          </h2>
          <p className="lp-blocks__desc">
            Type <kbd>/</kbd> to insert any block — headings, lists, todos,
            code, callouts, toggles and more. Drag to reorder. Select to format.
          </p>
          <ul className="lp-blocks__list">
            {BLOCKS.map(b => (
              <li key={b}><Check size={14} />{b}</li>
            ))}
          </ul>
        </div>
        <div className="lp-blocks__right">
          <div className="lp-slash-demo">
            <div className="lp-slash-demo__header">BLOCKS</div>
            {SLASH_ITEMS.map((item) => (
              <div key={item.label} className={`lp-slash-item ${item.active ? 'active' : ''}`}>
                <div className="lp-slash-item__icon">{item.icon}</div>
                <div>
                  <div className="lp-slash-item__label">{item.label}</div>
                  <div className="lp-slash-item__desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="lp-pricing">
        <div className="lp-section-label">Pricing</div>
        <h2 className="lp-section-title">Simple, honest pricing</h2>

        <div className="lp-pricing__grid">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`lp-plan ${plan.featured ? 'lp-plan--featured' : ''}`}>
              {plan.featured && <div className="lp-plan__badge">Most Popular</div>}
              <div className="lp-plan__name">{plan.name}</div>
              <div className="lp-plan__price">
                {plan.price === 0 ? 'Free' : `$${plan.price}`}
                {plan.price > 0 && <span>/mo</span>}
              </div>
              <div className="lp-plan__desc">{plan.desc}</div>
              <ul className="lp-plan__features">
                {plan.features.map(f => (
                  <li key={f}><Check size={13} />{f}</li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`lp-btn lp-btn--lg ${plan.featured ? 'lp-btn--primary' : 'lp-btn--outline'}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-hero__glow lp-hero__glow--1" style={{ opacity: 0.4 }} />
        <h2 className="lp-cta__title">Start writing today</h2>
        <p className="lp-cta__sub">Join thousands of people who think better with NodePad.</p>
        <Link to="/signup" className="lp-btn lp-btn--primary lp-btn--lg">
          Create free account <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-nav__logo">
          <div className="lp-nav__icon">✦</div>
          <span>NodePad</span>
        </div>
        <p>© 2025 NodePad. Built with ❤️</p>
      </footer>

    </div>
  );
}

// ── data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '⚡', title: 'Block Editor',    desc: 'Notion-style blocks with slash commands, drag & drop, and inline formatting.' },
  { icon: '🔒', title: 'Private & Secure', desc: 'Your notes are yours. Firebase Auth keeps every workspace isolated.' },
  { icon: '🔍', title: 'Instant Search',  desc: 'Find any note in milliseconds with full-text search across all your content.' },
  { icon: '🏷️', title: 'Tags & Filters',  desc: 'Organise notes with tags. Filter and find exactly what you need.' },
  { icon: '💾', title: 'Auto Save',       desc: 'Never lose a word. Notes save automatically as you type.' },
  { icon: '📱', title: 'Mobile Ready',    desc: 'Fully responsive. Write on any device, anywhere.' },
];

const BLOCKS = [
  'Headings (H1, H2, H3)',
  'Bullet & Numbered lists',
  'To-do checkboxes',
  'Callout blocks',
  'Toggle / collapsible',
  'Code blocks',
  'Quotes & Dividers',
];

const SLASH_ITEMS = [
  { icon: 'T',  label: 'Text',       desc: 'Plain paragraph',    active: false },
  { icon: 'H1', label: 'Heading 1',  desc: 'Large heading',      active: true  },
  { icon: '•',  label: 'Bullet list',desc: 'Unordered list',     active: false },
  { icon: '✓',  label: 'To-do',      desc: 'Checkbox task',      active: false },
  { icon: '💡', label: 'Callout',    desc: 'Highlighted note',   active: false },
  { icon: '▶',  label: 'Toggle',     desc: 'Collapsible block',  active: false },
];

const PLANS = [
  {
    name: 'Free',
    price: 0,
    desc: 'Perfect for personal use',
    cta: 'Get started',
    featured: false,
    features: ['Unlimited notes', 'All block types', 'Auto save', 'Mobile access'],
  },
  {
    name: 'Pro',
    price: 8,
    desc: 'For power users',
    cta: 'Start free trial',
    featured: true,
    features: ['Everything in Free', 'Image uploads', 'Priority support', 'Early access to features'],
  },
];
