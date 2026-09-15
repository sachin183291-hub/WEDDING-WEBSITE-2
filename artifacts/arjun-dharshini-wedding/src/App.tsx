import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion, useInView } from 'framer-motion';
import { CalendarDays, ChevronDown, Clock3, Crown, Flower2, Heart, MapPin, Menu, Music2, Navigation, Sparkles, UtensilsCrossed, X, Pause, Play } from 'lucide-react';
import coupleImage from '@assets/generated_images/arjun-dharshini-wedding-couple.png';
import mandapamImage from '/mandapam.jpg';
import coupleMemoryImage1 from '/couple-memory.jpg';
import coupleMemoryImage2 from '/couple_memory_2_1789484416592.jpg';
import coupleMemoryImage3 from '/couple_memory_3_1789484434469.jpg';
import coupleMemoryImage4 from '/couple_memory_4_1789484492285.jpg';

type Ceremony = {
  number: string;
  name: string;
  time: string;
  note: string;
  icon: typeof Flower2;
};

const ceremonies: Ceremony[] = [
  { number: '01', name: 'Vratham & Nalangu', time: 'Monday · 16 November · 5:00 PM', note: 'Turmeric, laughter and the first blessings of the wedding days.', icon: Sparkles },
  { number: '02', name: 'Nichayathartham', time: 'Tuesday · 17 November · 10:30 AM', note: 'Our families formally celebrate the promise we have made to each other.', icon: Crown },
  { number: '03', name: 'Muhurtham', time: 'Wednesday · 18 November · 8:00 AM', note: 'Join us beneath the flowers as Arjun and Dharshini begin their life together.', icon: Flower2 },
  { number: '04', name: 'Reception & Virundhu', time: 'Wednesday · 18 November · 6:30 PM', note: 'A generous Tamil feast, music and a room full of the people we love.', icon: UtensilsCrossed },
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
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    openButtonRef.current?.focus();
  }, []);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(onOpen, 1000);
  };

  return (
    <motion.section
      className="opening-gate"
      initial={reduced ? false : { opacity: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      aria-label="Open Arjun and Dharshini's wedding invitation"
    >
      <div className={`gate-door left ${isOpening ? 'open' : ''}`} aria-hidden="true" />
      <div className={`gate-door right ${isOpening ? 'open' : ''}`} aria-hidden="true" />
      <motion.div
        className="opening-gate-inner"
        animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? -20 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="gate-ornament one" aria-hidden="true" />
        <span className="gate-ornament two" aria-hidden="true" />
        <div className="gate-copy">
          <p className="gate-tamil font-tamil">ஸ்ரீ · சுபம் · மங்களம்</p>
          <p className="gate-kicker">A Tamil wedding invitation</p>
          <h1 className="gate-title">Arjun <span>&amp;</span><br />Dharshini</h1>
          <p className="gate-date">Wednesday · 18 November 2026 · Madurai</p>
          <button ref={openButtonRef} className="gate-button" type="button" onClick={handleOpen} data-testid="button-open-invitation">
            Open invitation
          </button>
        </div>
        <div className="gate-couple-frame">
          <img className="gate-couple-image" src={coupleImage} alt="Arjun and Dharshini in traditional Tamil wedding attire" />
        </div>
      </motion.div>
    </motion.section>
  );
}
// Tamil Romantic Melody — Shankarabharanam Raga (Web Audio API)
function AmbientMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  // Shankarabharanam raga melody (Sa=C4): Pa-Da-Ni-Sa-Ni-Da-Pa-Ma-Ga-Ma-Pa style
  // [frequency_hz, duration_beats]
  const MELODY: [number, number][] = [
    [392.00, 1.0], [440.00, 0.5], [493.88, 0.5], [523.25, 1.5],
    [493.88, 0.5], [440.00, 0.5], [392.00, 1.0], [349.23, 0.5],
    [329.63, 1.0], [349.23, 0.5], [392.00, 0.5], [440.00, 1.0],
    [392.00, 1.5], [349.23, 0.5], [329.63, 1.0],
    [293.66, 0.5], [261.63, 2.0], [0, 0.5],
    [329.63, 0.5], [349.23, 0.5], [392.00, 0.5], [440.00, 0.5],
    [493.88, 0.5], [523.25, 1.0], [493.88, 0.5], [440.00, 0.5],
    [392.00, 0.5], [349.23, 0.5], [329.63, 0.5], [293.66, 0.5],
    [261.63, 3.0], [0, 1.0],
  ];

  const BPM = 72;
  const BEAT = 60 / BPM;

  const scheduleNote = (ctx: AudioContext, freq: number, startTime: number, dur: number) => {
    if (freq === 0) return; // rest
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, startTime);
    master.gain.linearRampToValueAtTime(0.12, startTime + 0.04);
    master.gain.setTargetAtTime(0.08, startTime + 0.1, 0.2);
    master.gain.setTargetAtTime(0.001, startTime + dur * 0.75, 0.08);
    master.connect(ctx.destination);

    // Primary tone - sitar/nadaswaram style (sawtooth + filter)
    const osc1 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    osc1.type = 'sawtooth';
    osc1.frequency.value = freq;
    osc1.frequency.setTargetAtTime(freq * 1.004, startTime + 0.05, 0.08); // slight pitch bend
    filter.type = 'bandpass';
    filter.frequency.value = freq * 2.5;
    filter.Q.value = 4;
    osc1.connect(filter);
    filter.connect(master);

    // Harmonics - adds warmth
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    gain2.gain.value = 0.3;
    osc2.connect(gain2);
    gain2.connect(master);

    // Drone - constant Sa (tonic) pad
    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    drone.type = 'sine';
    drone.frequency.value = 130.81; // Sa (C3)
    droneGain.gain.value = 0.025;
    drone.connect(droneGain);
    droneGain.connect(master);

    osc1.start(startTime);
    osc2.start(startTime);
    drone.start(startTime);
    osc1.stop(startTime + dur + 0.2);
    osc2.stop(startTime + dur + 0.2);
    drone.stop(startTime + dur + 0.2);
  };

  const startMelody = (ctx: AudioContext) => {
    let t = ctx.currentTime + 0.1;
    let loopHandle: ReturnType<typeof setTimeout>;

    const playLoop = () => {
      const loopStart = t;
      MELODY.forEach(([freq, beats]) => {
        scheduleNote(ctx, freq, t, beats * BEAT * 0.92);
        t += beats * BEAT;
      });
      const loopDuration = (t - loopStart) * 1000;
      loopHandle = setTimeout(() => playLoop(), loopDuration - 500);
    };

    playLoop();
    return () => clearTimeout(loopHandle);
  };

  const toggle = () => {
    if (isPlaying) {
      stopRef.current?.();
      ctxRef.current?.close();
      ctxRef.current = null;
      stopRef.current = null;
      setIsPlaying(false);
    } else {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      stopRef.current = startMelody(ctx);
      setIsPlaying(true);
    }
  };

  useEffect(() => () => { stopRef.current?.(); ctxRef.current?.close(); }, []);

  return (
    <button
      className="music-fab"
      onClick={toggle}
      title={isPlaying ? 'Pause music' : 'Play Tamil romantic music'}
      aria-label="Toggle background music"
    >
      {isPlaying ? <Pause size={18} /> : <Music2 size={18} />}
      <span className="music-fab-label">{isPlaying ? 'Pause' : 'Music'}</span>
      {isPlaying && <span className="music-fab-eq"><i /><i /><i /><i /></span>}
    </button>
  );
}


function MemoriesSection() {
  const bookImages = [
    { src: coupleMemoryImage1, caption: 'Our Story' },
    { src: coupleMemoryImage2, caption: 'Together' },
    { src: coupleMemoryImage3, caption: 'Always' },
    { src: coupleMemoryImage4, caption: 'Forever' },
  ];

  return (
    <section className="memories-section" id="memories">
      <div className="section-wrap">
        <SectionReveal className="memories-intro">
          <span className="section-kicker">Just the two of us</span>
          <h2 className="section-heading">Before the<br /><em>celebrations.</em></h2>
        </SectionReveal>
        <SectionReveal>
          <div className="photo-book">
            <div className="book-spine"></div>
            <div className="book-page left-page">
              <div className="book-polaroid tilt-left">
                <div className="memory-tape book-tape-1"></div>
                <div className="memory-image-wrap">
                  <img src={bookImages[0].src} alt="Pre-wedding" className="memory-image" />
                </div>
                <div className="memory-caption">{bookImages[0].caption}</div>
              </div>
              <div className="book-polaroid tilt-right mt-lg">
                <div className="memory-tape book-tape-2"></div>
                <div className="memory-image-wrap">
                  <img src={bookImages[1].src} alt="Pre-wedding" className="memory-image" />
                </div>
                <div className="memory-caption">{bookImages[1].caption}</div>
              </div>
            </div>
            <div className="book-page right-page">
              <div className="book-polaroid tilt-right mt-sm">
                <div className="memory-tape book-tape-3"></div>
                <div className="memory-image-wrap">
                  <img src={bookImages[2].src} alt="Pre-wedding" className="memory-image" />
                </div>
                <div className="memory-caption">{bookImages[2].caption}</div>
              </div>
              <div className="book-polaroid tilt-left mt-xl">
                <div className="memory-tape book-tape-4"></div>
                <div className="memory-image-wrap">
                  <img src={bookImages[3].src} alt="Pre-wedding" className="memory-image" />
                </div>
                <div className="memory-caption">{bookImages[3].caption}</div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}


type ScratchCardData = {
  title: string;
  label: string;
  message: string;
  hint: string;
  icon: typeof Flower2;
};

const scratchCards: ScratchCardData[] = [
  {
    title: 'An auspicious blessing',
    label: 'For the new home',
    message: 'May every morning begin with light, every doorway welcome laughter, and every season bring you closer.',
    hint: 'A blessing from our elders',
    icon: Flower2,
  },
  {
    title: 'A virundhu note',
    label: 'Please come hungry',
    message: 'Save a little room for sakkarai pongal, payasam and one more helping on a banana leaf shared with friends.',
    hint: 'From our kitchen to yours',
    icon: UtensilsCrossed,
  },
  {
    title: 'When the music rises',
    label: 'A little celebration',
    message: 'Listen for the nadaswaram at the gate. That is your cue to join the dancing, the clapping and the happiest noise.',
    hint: 'Follow the sound of joy',
    icon: Music2,
  },
  {
    title: 'A note from us',
    label: 'With folded hands',
    message: 'Your presence turns a wedding day into a family memory. Thank you for bringing your love to our mandapam.',
    hint: 'Arjun & Dharshini',
    icon: Heart,
  },
];

function ScratchCard({ card, index }: { card: ScratchCardData; index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const checkingRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const Icon = card.icon;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const paintSurface = () => {
      if (revealed) return;
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(bounds.width * dpr));
      const height = Math.max(1, Math.floor(bounds.height * dpr));
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = index % 2 === 0 ? '#b33b32' : '#9a2935';
      context.fillRect(0, 0, bounds.width, bounds.height);
      context.strokeStyle = 'rgba(247, 215, 137, .22)';
      context.lineWidth = 1;
      for (let line = -bounds.height; line < bounds.width + bounds.height; line += 22) {
        context.beginPath();
        context.moveTo(line, 0);
        context.lineTo(line + bounds.height, bounds.height);
        context.stroke();
      }
      context.strokeStyle = 'rgba(255, 244, 211, .22)';
      for (let ornament = 0; ornament < 5; ornament += 1) {
        const x = bounds.width * (0.12 + ornament * 0.19);
        const y = bounds.height * (0.2 + (ornament % 2) * 0.58);
        context.beginPath();
        context.arc(x, y, 13, 0, Math.PI * 2);
        context.stroke();
      }
    };

    paintSurface();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(paintSurface);
    observer?.observe(canvas);
    return () => observer?.disconnect();
  }, [index, revealed]);

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || checkingRef.current || revealed) return;
    checkingRef.current = true;
    window.requestAnimationFrame(() => {
      const context = canvas.getContext('2d');
      if (context) {
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparent = 0;
        let sampled = 0;
        for (let pixel = 3; pixel < pixels.length; pixel += 32) {
          sampled += 1;
          if (pixels[pixel] < 80) transparent += 1;
        }
        if (sampled > 0 && transparent / sampled > 0.48) setRevealed(true);
      }
      checkingRef.current = false;
    });
  };

  const eraseAt = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const context = canvas.getContext('2d');
    if (!context) return;
    context.save();
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(event.clientX - bounds.left, event.clientY - bounds.top, 29, 0, Math.PI * 2);
    context.fill();
    context.restore();
    checkProgress();
  };

  const startScratching = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    eraseAt(event);
  };

  const continueScratching = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (drawingRef.current) eraseAt(event);
  };

  const stopScratching = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <article className={`scratch-card scratch-card-${index + 1} ${revealed ? 'is-revealed' : ''}`} data-testid={`card-scratch-${index + 1}`}>
      <div className="scratch-card-top">
        <span className="scratch-card-label">{card.label}</span>
        <span className="scratch-card-icon"><Icon size={17} /></span>
      </div>
      <div className="scratch-reveal-window">
        <div className="scratch-message">
          <span className="scratch-message-kicker">{card.hint}</span>
          <p>{card.message}</p>
          <span className="scratch-message-mark">A &amp; D</span>
        </div>
        <canvas
          ref={canvasRef}
          className="scratch-surface"
          aria-label={`Scratch surface for ${card.title}`}
          onPointerDown={startScratching}
          onPointerMove={continueScratching}
          onPointerUp={stopScratching}
          onPointerCancel={stopScratching}
          data-testid={`canvas-scratch-${index + 1}`}
        />
        {!revealed && <span className="scratch-hint" aria-hidden="true">Scratch with your finger</span>}
      </div>
      <div className="scratch-card-bottom">
        <h3>{card.title}</h3>
        <button
          className="scratch-fallback"
          type="button"
          onClick={() => setRevealed(true)}
          disabled={revealed}
          aria-label={revealed ? `${card.title} revealed` : `Reveal ${card.title} without scratching`}
          data-testid={`button-reveal-scratch-${index + 1}`}
        >
          {revealed ? 'Revealed' : 'Reveal gently'}
        </button>
      </div>
      {revealed && <div className="scratch-complete" role="status">Revealed for you</div>}
    </article>
  );
}

function ScratchCardsSection() {
  return (
    <section className="scratch-section" id="surprise">
      <div className="section-wrap">
        <SectionReveal className="scratch-heading">
          <div>
            <span className="section-kicker">A little guest ritual</span>
            <h2 className="section-heading">Scratch to reveal<br /><em>a wedding surprise.</em></h2>
          </div>
          <p className="section-copy">Use a fingertip or mouse to clear the turmeric-gold surface. Each card is hiding a small note from our mandapam.</p>
        </SectionReveal>
        <div className="scratch-grid">
          {scratchCards.map((card, index) => <ScratchCard key={card.title} card={card} index={index} />)}
        </div>
        <p className="scratch-footnote"><span aria-hidden="true" /> Four small wishes, tucked away for the people who make this day complete. <span aria-hidden="true" /></p>
      </div>
    </section>
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
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
  const openingStartedRef = useRef(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (!invitationOpened) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [invitationOpened]);

  const openInvitation = () => {
    if (openingStartedRef.current || invitationOpened) return;
    openingStartedRef.current = true;
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
      'DTSTART:20261118T084700', 'DTEND:20261118T120000', 'SUMMARY:Arjun and Dharshini - Muhurtham',
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
      <AmbientMusicPlayer />
      <AnimatePresence mode="wait">
        {!invitationOpened && <OpeningGate onOpen={openInvitation} reduced={Boolean(prefersReducedMotion)} />}
      </AnimatePresence>
      <AnimatePresence>{celebrating && <CelebrationReveal reduced={Boolean(prefersReducedMotion)} />}</AnimatePresence>
      <div className="invitation-underlay" aria-hidden={!invitationOpened} inert={!invitationOpened}>
        <header className="wedding-nav">
          <button className="nav-mark" onClick={() => scrollToId('welcome')} aria-label="Back to the beginning" data-testid="button-home">
            <span className="nav-monogram">A<span>&amp;</span>D</span>
            <span className="nav-copy">Arjun &amp; Dharshini<small>Madurai · 18 November 2026</small></span>
          </button>
          <nav className="nav-links" aria-label="Wedding invitation navigation">
            <button onClick={() => scrollToId('functions')} data-testid="link-functions">Functions</button>
            <button onClick={() => scrollToId('details')} data-testid="link-details">Details</button>
            <button onClick={() => scrollToId('blessings')} data-testid="link-blessings">Families</button>
            <button onClick={() => scrollToId('surprise')} data-testid="link-surprise">Surprise</button>
          </nav>
          <button className="nav-cta" onClick={() => setRsvpOpen(true)} data-testid="button-nav-rsvp">RSVP <Heart size={13} /></button>
          <button className="nav-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-toggle-menu">{menuOpen ? <X size={17} /> : <Menu size={17} />}</button>
          <AnimatePresence>
            {menuOpen && (
              <motion.nav 
                className="nav-menu" 
                initial={{ opacity: 0, y: -8, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: -8, scale: 0.95 }} 
                transition={{ duration: 0.2 }}
                aria-label="Mobile navigation"
              >
                <button onClick={() => { scrollToId('functions'); setMenuOpen(false); }} data-testid="menu-functions">Functions</button>
                <button onClick={() => { scrollToId('details'); setMenuOpen(false); }} data-testid="menu-details">Venue &amp; timing</button>
                <button onClick={() => { scrollToId('gallery'); setMenuOpen(false); }} data-testid="menu-gallery">Memories</button>
                <button onClick={() => { scrollToId('surprise'); setMenuOpen(false); }} data-testid="menu-surprise">Guest surprise</button>
                <button onClick={() => { setRsvpOpen(true); setMenuOpen(false); }} data-testid="menu-rsvp">RSVP</button>
              </motion.nav>
            )}
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
            <div className="hero-date"><span>Wednesday, 18 November 2026</span><i /><span>Madurai</span></div>
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

        <ScratchCardsSection />

        <section className="details-section" id="details">
          <div className="section-wrap details-layout">
            <SectionReveal>
              <span className="section-kicker">Keep this close</span>
              <h2 className="section-heading">The <em>muhurtham</em><br />and the place.</h2>
              <div className="details-panel">
                <div className="detail-item"><CalendarDays size={20} /><div><small>Wedding day</small><strong>Wednesday, 18 November 2026</strong><p>Come early, settle in and share the morning coffee with us.</p></div></div>
                <div className="detail-item"><Clock3 size={20} /><div><small>Auspicious time</small><strong>8:47 AM · Thai Poosam</strong><p>Muhurtham beneath the jasmine mandapam, followed by lunch.</p></div></div>
                <div className="detail-item"><MapPin size={20} /><div><small>Wedding venue</small><strong>Thirumalai Mahal</strong><p>Melur Road, near Anna Nagar, Madurai, Tamil Nadu 625020.</p></div></div>
              </div>
              <button className="primary-button" onClick={addToCalendar} data-testid="button-add-calendar">Add to Calendar <CalendarDays size={15} /></button>
            </SectionReveal>
            <SectionReveal>
              <article className="venue-card">
                <div className="venue-top"><span>Madurai</span><span>18 · 11 · 26</span></div>
                <h3>Thirumalai<br />Mahal</h3>
                <p>A bright mandapam, tall brass lamps and enough room for every auntie, cousin and friend who made us who we are.</p>
                <button className="outline-button map-button" onClick={() => showToast('Directions: Melur Road, near Anna Nagar, Madurai.')} data-testid="button-view-directions"><Navigation size={15} /> View directions</button>
                <img src={mandapamImage} alt="Thirumalai Mahal mandapam interior" className="mandapam-image" />
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

        <MemoriesSection />

        <section className="rsvp-section" id="rsvp">
          <div className="section-wrap">
            <SectionReveal><span className="section-kicker">Your presence is our present</span><h2 className="section-heading">Will you come<br /><em>bless us?</em></h2><p className="section-copy">Please let us know before 31 October so we can keep your place at the mandapam and the dining leaf.</p><div className="rsvp-actions"><button className="primary-button" onClick={() => setRsvpOpen(true)} data-testid="button-open-rsvp">RSVP for the wedding <Heart size={15} /></button><button className="outline-button" onClick={addToCalendar} data-testid="button-calendar-rsvp">Save the date <CalendarDays size={15} /></button></div></SectionReveal>
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