import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, ChevronDown, Clock3, Crown, Flower2, Heart, MapPin, Menu, Navigation, Sparkles, UtensilsCrossed, X } from 'lucide-react';
import coupleImage from '@assets/generated_images/arjun-dharshini-wedding-couple.png';

type Ceremony = {
  number: string;
  name: string;
  time: string;
  note: string;
  icon: typeof Flower2;
};

const ceremonies: Ceremony[] = [
  { number: '01', name: 'Vratham & Nalangu', time: 'Friday · 06 February · 5:00 PM', note: 'Turmeric, laughter and the first blessings of the wedding days.', icon: Sparkles },
  { number: '02', name: 'Nichayathartham', time: 'Saturday · 07 February · 10:30 AM', note: 'Our families formally celebrate the promise we have made to each other.', icon: Crown },
  { number: '03', name: 'Muhurtham', time: 'Sunday · 08 February · 8:47 AM', note: 'Join us beneath the flowers as Arjun and Dharshini begin their life together.', icon: Flower2 },
  { number: '04', name: 'Reception & Virundhu', time: 'Sunday · 08 February · 6:30 PM', note: 'A generous Tamil feast, music and a room full of the people we love.', icon: UtensilsCrossed },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Thoranam() {
  return <div className="thoranam" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i className="leaf" key={index} />)}</div>;
}

function Garland({ className = '' }: { className?: string }) {
  return <div className={`jasmine-strand ${className}`} aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <span key={index} />)}</div>;
}

function Kolam() {
  return <div className="kolam-mark" aria-hidden="true"><span className="kolam-dot" /></div>;
}

function WelcomeIllustration() {
  return (
    <div className="welcome-art" aria-label="Arjun and Dharshini in their Tamil wedding attire">
      <Garland />
      <Garland />
      <div className="welcome-couple-frame">
        <img className="welcome-couple-image" src={coupleImage} alt="Arjun and Dharshini smiling together in traditional Tamil wedding attire" />
      </div>
    </div>
  );
}

function OpeningGate({ onOpen, reduced }: { onOpen: () => void; reduced: boolean }) {
  const openButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    openButtonRef.current?.focus();
  }, []);

  return (
    <motion.section
      className="opening-gate"
      initial={reduced ? false : { opacity: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: '-100%' }}
      transition={{ duration: reduced ? 0.01 : 0.8, ease: [0.76, 0, 0.24, 1] }}
      aria-label="Open Arjun and Dharshini's wedding invitation"
    >
      <div className="opening-gate-inner">
        <span className="gate-ornament one" aria-hidden="true" />
        <span className="gate-ornament two" aria-hidden="true" />
        <div className="gate-copy">
          <p className="gate-tamil font-tamil">ஸ்ரீ · சுபம் · மங்களம்</p>
          <p className="gate-kicker">A Tamil wedding invitation</p>
          <h1 className="gate-title">Arjun <span>&amp;</span><br />Dharshini</h1>
          <p className="gate-date">Sunday · 08 February 2026 · Madurai</p>
          <button ref={openButtonRef} className="gate-button" type="button" onClick={onOpen} data-testid="button-open-invitation">
            Open invitation
          </button>
        </div>
        <div className="gate-couple-frame">
          <img className="gate-couple-image" src={coupleImage} alt="Arjun and Dharshini in traditional Tamil wedding attire" />
        </div>
      </div>
    </motion.section>
  );
}

function CelebrationReveal({ reduced }: { reduced: boolean }) {
  if (reduced) return null;

  return (
    <motion.div
      className="reveal-celebration"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 2.7, ease: 'easeOut' }}
      aria-hidden="true"
    >
      {Array.from({ length: 18 }, (_, index) => (
        <i
          className="celebration-heart"
          key={`heart-${index}`}
          style={{
            left: `${(index * 17) % 103}%`,
            animationDelay: `${(index % 7) * 0.08}s`,
            ['--drift' as string]: `${(index % 2 ? 1 : -1) * (8 + (index % 5) * 4)}vw`,
          } as CSSProperties}
        />
      ))}
      {Array.from({ length: 20 }, (_, index) => (
        <i
          className="celebration-petal"
          key={`petal-${index}`}
          style={{ left: `${(index * 23) % 107}%`, animationDelay: `${(index % 8) * 0.06}s` }}
        />
      ))}
      {Array.from({ length: 26 }, (_, index) => (
        <i
          className="celebration-dust"
          key={`dust-${index}`}
          style={{ left: `${(index * 31) % 101}%`, top: `${18 + ((index * 13) % 63)}%`, animationDelay: `${(index % 9) * 0.05}s` }}
        />
      ))}
    </motion.div>
  );
}

function SectionReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: .7, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function RsvpModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (name: string) => void }) {
  const [name, setName] = useState('');
  const [guests, setGuests] = useState('2');
  const [attendance, setAttendance] = useState('Muhurtham and reception');
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSubmitted(true);
    onConfirm(name.trim());
  };

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} data-testid="dialog-rsvp">
      <motion.div className="rsvp-modal" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close RSVP form" data-testid="button-close-rsvp"><X size={16} /></button>
        <span className="section-kicker">Let us plan for you</span>
        <h2>Will you join us?</h2>
        <p>Tell us how many places to keep at the mandapam and virundhu. We cannot wait to welcome you.</p>
        {submitted ? (
          <div className="form-success" data-testid="status-rsvp-success">Thank you, {name}. Your place is lovingly kept for {guests === '1' ? 'you' : `${guests} guests`} at the {attendance.toLowerCase()}.</div>
        ) : (
          <form className="rsvp-form" onSubmit={submit}>
            <label htmlFor="guest-name">Your name<input id="guest-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="For example, Lakshmi Raman" required data-testid="input-rsvp-name" /></label>
            <label htmlFor="guest-count">Number attending<select id="guest-count" value={guests} onChange={(event) => setGuests(event.target.value)} data-testid="select-rsvp-guests"><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option></select></label>
            <label htmlFor="guest-event">Joining us for<select id="guest-event" value={attendance} onChange={(event) => setAttendance(event.target.value)} data-testid="select-rsvp-event"><option>Muhurtham and reception</option><option>Reception only</option><option>All functions</option></select></label>
            <button className="primary-button" type="submit" data-testid="button-submit-rsvp">Send my RSVP <Heart size={15} /></button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

function App() {
  const prefersReducedMotion = useReducedMotion();
  const [invitationOpened, setInvitationOpened] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [motionOn, setMotionOn] = useState(true);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (!invitationOpened) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [invitationOpened]);

  const openInvitation = () => {
    setInvitationOpened(true);
    if (!prefersReducedMotion) {
      setCelebrating(true);
      window.setTimeout(() => setCelebrating(false), 2850);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  };

  const addToCalendar = () => {
    const calendar = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Arjun and Dharshini//Wedding//EN',
      'BEGIN:VEVENT', 'UID:arjun-dharshini-2026@example.com', 'DTSTAMP:20250101T000000Z',
      'DTSTART:20260208T084700', 'DTEND:20260208T120000', 'SUMMARY:Arjun and Dharshini - Muhurtham',
      'LOCATION:Thirumalai Mahal, Melur Road, Madurai, Tamil Nadu', 'DESCRIPTION:Join us for the muhurtham of Arjun and Dharshini.',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([calendar], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'arjun-dharshini-wedding.ics';
    link.click();
    URL.revokeObjectURL(url);
    showToast('The wedding date has been added to your calendar.');
  };

  return (
    <main className={`wedding-page ${motionOn ? '' : 'motion-paused'}`}>
      <AnimatePresence mode="wait">
        {!invitationOpened && <OpeningGate onOpen={openInvitation} reduced={Boolean(prefersReducedMotion)} />}
      </AnimatePresence>
      <AnimatePresence>{celebrating && <CelebrationReveal reduced={Boolean(prefersReducedMotion)} />}</AnimatePresence>
      <div className="invitation-underlay" aria-hidden={!invitationOpened} inert={!invitationOpened}>
      <header className="wedding-nav">
        <button className="nav-mark" onClick={() => scrollToId('welcome')} aria-label="Back to the beginning" data-testid="button-home">
          <span className="nav-monogram">A<span>&amp;</span>D</span>
          <span className="nav-copy">Arjun &amp; Dharshini<small>Madurai · 08 February 2026</small></span>
        </button>
        <nav className="nav-links" aria-label="Wedding invitation navigation">
          <button onClick={() => scrollToId('functions')} data-testid="link-functions">Functions</button>
          <button onClick={() => scrollToId('details')} data-testid="link-details">Details</button>
          <button onClick={() => scrollToId('blessings')} data-testid="link-blessings">Families</button>
        </nav>
        <button className="nav-cta" onClick={() => setRsvpOpen(true)} data-testid="button-nav-rsvp">RSVP <Heart size={13} /></button>
        <button className="nav-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-toggle-menu">{menuOpen ? <X size={17} /> : <Menu size={17} />}</button>
        <AnimatePresence>
          {menuOpen && <motion.nav className="nav-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} aria-label="Mobile navigation">
            <button onClick={() => { scrollToId('functions'); setMenuOpen(false); }} data-testid="menu-functions">Functions</button>
            <button onClick={() => { scrollToId('details'); setMenuOpen(false); }} data-testid="menu-details">Venue &amp; timing</button>
            <button onClick={() => { scrollToId('gallery'); setMenuOpen(false); }} data-testid="menu-gallery">Memories</button>
            <button onClick={() => { setRsvpOpen(true); setMenuOpen(false); }} data-testid="menu-rsvp">RSVP</button>
          </motion.nav>}
        </AnimatePresence>
      </header>

      <section className="hero" id="home">
        <Thoranam />
        <div className="petal-field" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="hero-content">
          <p className="hero-tamil font-tamil">ஸ்ரீ · சுபம் · மங்களம்</p>
          <p className="hero-kicker">With the blessings of our parents</p>
          <h1 className="hero-title">Arjun <span className="hero-amp">&amp;</span><br /><span>Dharshini</span></h1>
          <p className="hero-subtitle">invite you to celebrate their wedding<br />in the warmth of family, flowers and music.</p>
          <div className="hero-date"><span>Sunday, 08 February 2026</span><i /><span>Madurai</span></div>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => scrollToId('welcome')} data-testid="button-view-invitation">View Invitation <ChevronDown size={15} /></button>
            <button className="outline-button" onClick={() => scrollToId('functions')} data-testid="button-explore-functions">Explore the Functions</button>
          </div>
        </div>
        <img className="hero-couple" src={coupleImage} alt="Arjun and Dharshini in their wedding-getup" />
      </section>

      <section className="welcome" id="welcome">
        <div className="section-wrap welcome-grid">
          <SectionReveal><WelcomeIllustration /></SectionReveal>
          <SectionReveal>
            <article className="welcome-note ornament-border">
              <span className="section-kicker">A joyful invitation</span>
              <h2 className="section-heading">Two hearts, <em>one home.</em></h2>
              <p className="section-copy">With folded hands and full hearts, we invite you to witness the sacred union of Arjun, son of <strong>Meenakshi &amp; Raghavan</strong>, and Dharshini, daughter of <strong>Vasanthi &amp; S. Kumar</strong>.</p>
              <p className="section-copy">Come for the nadaswaram, stay for the virundhu, and bless the beginning of a beautiful new home for our families.</p>
              <div className="parents-line"><div><strong>Arjun</strong> son of Meenakshi &amp; Raghavan</div><div><strong>Dharshini</strong> daughter of Vasanthi &amp; S. Kumar</div></div>
            </article>
          </SectionReveal>
        </div>
      </section>

      <section className="functions" id="functions">
        <div className="section-wrap">
          <SectionReveal className="function-intro">
            <div><span className="section-kicker">The wedding days</span><h2 className="section-heading">Every ritual has<br /><em>its own joy.</em></h2></div>
            <p className="section-copy">Our celebrations begin with turmeric and end with a feast. We would be honoured to have you with us for the moments that make a marriage.</p>
          </SectionReveal>
          <div className="function-list">
            {ceremonies.map(({ number, name, time, note, icon: Icon }, index) => (
              <SectionReveal key={name}>
                <button className="function-row" onClick={() => showToast(`${name} is at ${time}. We hope to see you there.`)} data-testid={`button-function-${index + 1}`}>
                  <span className="function-num">{number}</span><span className="function-name">{name}</span><span className="function-time">{time}</span><span className="function-note">{note}</span><span className="function-icon"><Icon size={16} /></span>
                </button>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="details-section" id="details">
        <div className="section-wrap details-layout">
          <SectionReveal>
            <span className="section-kicker">Keep this close</span>
            <h2 className="section-heading">The <em>muhurtham</em><br />and the place.</h2>
            <div className="details-panel">
              <div className="detail-item"><CalendarDays size={20} /><div><small>Wedding day</small><strong>Sunday, 08 February 2026</strong><p>Come early, settle in and share the morning coffee with us.</p></div></div>
              <div className="detail-item"><Clock3 size={20} /><div><small>Auspicious time</small><strong>8:47 AM · Thai Poosam</strong><p>Muhurtham beneath the jasmine mandapam, followed by lunch.</p></div></div>
              <div className="detail-item"><MapPin size={20} /><div><small>Wedding venue</small><strong>Thirumalai Mahal</strong><p>Melur Road, near Anna Nagar, Madurai, Tamil Nadu 625020.</p></div></div>
            </div>
            <button className="primary-button" onClick={addToCalendar} data-testid="button-add-calendar">Add to Calendar <CalendarDays size={15} /></button>
          </SectionReveal>
          <SectionReveal>
            <article className="venue-card ornament-border">
              <div className="venue-top"><span>Madurai</span><span>08 · 02 · 26</span></div>
              <h3>Thirumalai<br />Mahal</h3>
              <p>A bright mandapam, tall brass lamps and enough room for every auntie, cousin and friend who made us who we are.</p>
              <button className="outline-button map-button" onClick={() => showToast('Directions: Melur Road, near Anna Nagar, Madurai.')} data-testid="button-view-directions"><Navigation size={15} /> View directions</button>
              <div className="mandapam-columns" aria-hidden="true" />
            </article>
          </SectionReveal>
        </div>
      </section>

      <section className="blessings" id="blessings">
        <div className="section-wrap blessing-layout">
          <SectionReveal>
            <span className="section-kicker">With family blessings</span>
            <h2 className="section-heading">A marriage is<br /><em>many hands.</em></h2>
            <p className="section-copy">We arrive at this day carrying the love, patience and prayers of the families who have held us close.</p>
            <div className="family-list">
              <div className="family-block"><span>Arjun's family</span><strong>Meenakshi &amp; Raghavan</strong><p>Madurai · Tirunelveli</p></div>
              <div className="family-block"><span>Dharshini's family</span><strong>Vasanthi &amp; S. Kumar</strong><p>Madurai · Dindigul</p></div>
            </div>
          </SectionReveal>
          <SectionReveal>
            <div className="blessing-quote"><Kolam /><p>“May your home always have the light of a lamp, the fragrance of jasmine and the sound of people you love.”</p><cite>— A blessing from both our families</cite></div>
          </SectionReveal>
        </div>
      </section>

      <section className="gallery" id="gallery">
        <div className="section-wrap">
          <div className="gallery-top"><div><span className="section-kicker">Little wedding memories</span><h2 className="section-heading">Bring your <em>favourite</em> memories.</h2></div><p className="section-copy">Wear your best silk, bring your loudest blessings and leave a little space for payasam.</p></div>
          <div className="gallery-grid">
            <div className="memory-tile tall"><div className="tile-flower" /><div><h3>Jasmine mornings</h3><p>For flowers in the hair and on the doorway.</p></div></div>
            <div className="memory-tile gold"><div className="tile-lamp" /><div><h3>Brass &amp; gold</h3><p>For a day made auspicious.</p></div></div>
            <div className="memory-tile cream"><div><h3>Silk &amp; veshti</h3><p>Traditional, joyful, entirely us.</p></div></div>
            <div className="memory-tile"><div><h3>Nadaswaram at the gate</h3><p>Follow the music to the mandapam.</p></div></div>
            <div className="memory-tile gold"><div><h3>Banana-leaf virundhu</h3><p>Please come hungry.</p></div></div>
          </div>
        </div>
      </section>

      <section className="rsvp-section" id="rsvp">
        <div className="section-wrap">
          <SectionReveal><span className="section-kicker">Your presence is our present</span><h2 className="section-heading">Will you come<br /><em>bless us?</em></h2><p className="section-copy">Please let us know before 15 January so we can keep your place at the mandapam and the dining leaf.</p><div className="rsvp-actions"><button className="primary-button" onClick={() => setRsvpOpen(true)} data-testid="button-open-rsvp">RSVP for the wedding <Heart size={15} /></button><button className="outline-button" onClick={addToCalendar} data-testid="button-calendar-rsvp">Save the date <CalendarDays size={15} /></button></div></SectionReveal>
        </div>
      </section>

      <section className="closing">
        <Thoranam />
        <span className="font-script">நல்வரவு · Nalvaravu</span>
        <h2>See you under<br />the jasmine canopy.</h2>
        <p>With all our love and gratitude,<br /><strong>Arjun &amp; Dharshini</strong></p>
        <div className="closing-footer"><span>Madurai · Tamil Nadu</span><span>Our wedding invitation</span><button onClick={() => setMotionOn((value) => !value)} data-testid="button-toggle-motion">{motionOn ? 'Pause floral motion' : 'Play floral motion'}</button></div>
      </section>

      <AnimatePresence>{rsvpOpen && <RsvpModal onClose={() => setRsvpOpen(false)} onConfirm={(name) => showToast(`Thank you, ${name}. We have received your RSVP.`)} />}</AnimatePresence>
      <AnimatePresence>{toast && <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} role="status" data-testid="status-toast">{toast}</motion.div>}</AnimatePresence>
      </div>
    </main>
  );
}

export default App;