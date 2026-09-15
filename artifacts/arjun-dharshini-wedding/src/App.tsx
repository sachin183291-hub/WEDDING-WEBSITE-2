import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, CalendarDays, ChevronDown, CirclePlay, Clock3, Heart, MapPin, Menu, Volume2, VolumeX, X } from 'lucide-react';

type SceneKind =
  | 'opening' | 'street' | 'city' | 'flowers' | 'home' | 'engagement' | 'dining' | 'bridal'
  | 'procession' | 'mandapam' | 'muhurtham' | 'garland' | 'thaali' | 'blessing' | 'journey'
  | 'details' | 'reception' | 'memories' | 'ending';

type Scene = { id: string; chapter: string; eyebrow: string; title: string; body: string; kind: SceneKind; palette: string; };

const scenes: Scene[] = [
  { id: 'dawn', chapter: '01 / 19', eyebrow: 'A wedding film from Madurai', title: 'The day begins\nwhere our story did.', body: 'A small, moving invitation for the people who made this possible.', kind: 'opening', palette: 'scene-dawn' },
  { id: 'street', chapter: '02 / 19', eyebrow: 'Before the city wakes', title: 'A lane. Two bicycles.\nOne familiar hello.', body: 'Some stories begin with a grand gesture. Ours began with a morning ride past the jasmine seller.', kind: 'street', palette: 'scene-street' },
  { id: 'madurai', chapter: '03 / 19', eyebrow: 'Madurai, in full colour', title: 'The city kept\nour secret well.', body: 'Under the shadow of the towers, Arjun found a reason to take the long way home.', kind: 'city', palette: 'scene-city' },
  { id: 'flowers', chapter: '04 / 19', eyebrow: 'The flower market', title: 'The air smelled\nlike a promise.', body: 'Jasmine for the hair. Kanakambaram for the doorway. A little gold thread for luck.', kind: 'flowers', palette: 'scene-flowers' },
  { id: 'home', chapter: '05 / 19', eyebrow: 'The old house in Anna Nagar', title: 'Every home has\na witness.', body: 'This one heard the first stories, served the strongest filter coffee, and opened its doors wide.', kind: 'home', palette: 'scene-home' },
  { id: 'engagement', chapter: '06 / 19', eyebrow: 'A quiet evening', title: 'Then, suddenly,\nthere was a ring.', body: 'On the terrace, beneath a sky turning apricot, two families became one circle.', kind: 'engagement', palette: 'scene-engagement' },
  { id: 'dining', chapter: '07 / 19', eyebrow: 'A Chettinad table', title: 'Come hungry.\nLeave with stories.', body: 'Long banana leaves, pepper in the air, and every auntie asking if you have eaten yet.', kind: 'dining', palette: 'scene-dining' },
  { id: 'bridal', chapter: '08 / 19', eyebrow: 'In the room next door', title: 'Dharshini gets ready\nfor the whole sky.', body: 'Jasmine pinned, silk pleats set, laughter travelling through the wooden shutters.', kind: 'bridal', palette: 'scene-bridal' },
  { id: 'procession', chapter: '09 / 19', eyebrow: 'The sound arrives first', title: 'Nadaswaram at the gate.\nThe day is official.', body: 'Follow the music. There is a groom somewhere inside the procession, trying not to smile too much.', kind: 'procession', palette: 'scene-procession' },
  { id: 'mandapam', chapter: '10 / 19', eyebrow: 'At the mandapam', title: 'A roof of flowers.\nA room full of light.', body: 'Take your seat. Keep your phone away for a minute. Look at everyone you love.', kind: 'mandapam', palette: 'scene-mandapam' },
  { id: 'muhurtham', chapter: '11 / 19', eyebrow: 'The muhurtham', title: 'The whole world\nholds its breath.', body: 'A sacred minute, held by drums, turmeric, and the steady hands of our parents.', kind: 'muhurtham', palette: 'scene-muhurtham' },
  { id: 'garlands', chapter: '12 / 19', eyebrow: 'A playful ritual', title: 'One garland.\nThen another.', body: 'A little teasing before forever. Please cheer loudly for the second attempt.', kind: 'garland', palette: 'scene-garland' },
  { id: 'thaali', chapter: '13 / 19', eyebrow: 'The golden thread', title: 'A small gold sun,\nclose to the heart.', body: 'The moment our two paths become one; witnessed by every face in the room.', kind: 'thaali', palette: 'scene-thaali' },
  { id: 'blessing', chapter: '14 / 19', eyebrow: 'At the temple', title: 'We carry your blessings\ninto the future.', body: 'Before the feast and the photographs, a quiet thank you at Meenakshi Amman.', kind: 'blessing', palette: 'scene-blessing' },
  { id: 'journey', chapter: '15 / 19', eyebrow: 'After the last bell', title: 'The road home\nlooks different now.', body: 'The sun slips behind the palms. The city keeps moving. We move with it, together.', kind: 'journey', palette: 'scene-journey' },
  { id: 'details', chapter: '16 / 19', eyebrow: 'Keep this close', title: 'Your place in\nour story.', body: 'Save the date, find the mandapam, and come ready to make a little noise.', kind: 'details', palette: 'scene-details' },
  { id: 'reception', chapter: '17 / 19', eyebrow: 'One more evening', title: 'Dinner, dancing,\nand your favourite people.', body: 'The film closes late. The music does not.', kind: 'reception', palette: 'scene-reception' },
  { id: 'memories', chapter: '18 / 19', eyebrow: 'Frames from the road', title: 'Keep a little\nof this with you.', body: 'There will be photos. There will be stories. There will be one more plate of payasam.', kind: 'memories', palette: 'scene-memories' },
  { id: 'ending', chapter: '19 / 19', eyebrow: 'With all our love', title: 'See you under\nthe Madurai sky.', body: 'Arjun & Dharshini · 18 January 2025', kind: 'ending', palette: 'scene-ending' },
];

function Couple({ pose = 'walk', scale = 1 }: { pose?: string; scale?: number }) {
  return (
    <motion.div className={`couple couple-${pose}`} style={{ scale }} animate={{ y: [0, -3, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} aria-label="Illustration of Arjun and Dharshini">
      <svg viewBox="0 0 180 190" role="img">
        <g className="figure arjun">
          <circle cx="66" cy="53" r="16" fill="#9a573d" />
          <path d="M51 51c2-16 28-19 34 0-9-5-23-7-34 0Z" fill="#332422" />
          <path d="M55 72h24l10 57H48Z" fill="#224b4c" />
          <path d="m54 77-17 32 8 4 18-27m14-9 12 35-8 3-12-28" fill="#24494a" />
          <path d="M49 126h15v43H48Zm25 0h14v43H74Z" fill="#412d2a" />
          <path d="M47 169h18v5H44Zm26 0h19v5H72Z" fill="#1f2929" />
          <circle cx="61" cy="54" r="2" fill="#f3c48f" /><circle cx="71" cy="54" r="2" fill="#f3c48f" />
          <path d="M62 62q5 4 10 0" fill="none" stroke="#572e2a" strokeWidth="2" />
        </g>
        <g className="figure dharshini">
          <circle cx="119" cy="53" r="16" fill="#a9644b" />
          <path d="M103 55c0-21 32-25 34-2l-4 7-8-18-18 13Z" fill="#2b2225" />
          <path d="M104 72h30l15 72H95Z" fill="#b63d37" />
          <path d="m105 75-13 29 7 4 17-25m17-8 20 31-8 6-17-27" fill="#b63d37" />
          <path d="M100 140h16v32h-16Zm24 0h16v32h-16Z" fill="#e4b263" />
          <path d="M98 171h20v5H96Zm24 0h20v5h-20Z" fill="#553436" />
          <path d="M103 84q16 8 32 0" fill="none" stroke="#e5b55f" strokeWidth="4" />
          <circle cx="114" cy="54" r="2" fill="#f3c48f" /><circle cx="124" cy="54" r="2" fill="#f3c48f" />
          <path d="M114 62q5 4 10 0" fill="none" stroke="#572e2a" strokeWidth="2" />
        </g>
      </svg>
    </motion.div>
  );
}

function Palm({ side = 'left', tall = false }: { side?: string; tall?: boolean }) {
  return <div className={`palm palm-${side} ${tall ? 'palm-tall' : ''}`}><div className="palm-trunk" /><div className="palm-crown"><i /><i /><i /><i /><i /></div></div>;
}

function SceneArt({ kind }: { kind: SceneKind }) {
  const hills = <><div className="hill hill-back" /><div className="hill hill-front" /><Palm side="left" tall /><Palm side="right" /></>;
  if (kind === 'opening' || kind === 'journey' || kind === 'ending') return <div className="scene-art landscape-art"><div className="sun" /><div className="cloud cloud-a cloud-drift" /><div className="cloud cloud-b cloud-drift" />{hills}<div className="road" /><div className="film-line" /></div>;
  if (kind === 'street') return <div className="scene-art street-art"><div className="street-sky" /><div className="street-house house-a" /><div className="street-house house-b" /><div className="street-house house-c" /><div className="rangoli" /><div className="wire wire-a" /><div className="wire wire-b" /><div className="street-ground" /><div className="cycle" /><Palm side="right" /></div>;
  if (kind === 'city' || kind === 'blessing') return <div className="scene-art city-art"><div className="city-sun" /><div className={`gopuram ${kind === 'blessing' ? 'gopuram-large' : ''}`}><span /><span /><span /><span /><span /></div><div className="city-buildings" /><div className="city-street" /><div className="lamp lamp-left lamp-flicker" /><div className="lamp lamp-right lamp-flicker" /></div>;
  if (kind === 'flowers' || kind === 'bridal') return <div className="scene-art flower-art"><div className="market-awning" /><div className="flower-stall"><span className="flower-bundle pink" /><span className="flower-bundle yellow" /><span className="flower-bundle white" /></div><div className="flower-basket basket-a" /><div className="flower-basket basket-b" /><div className="floating-petal petal-a" /><div className="floating-petal petal-b" /><div className="floating-petal petal-c" /></div>;
  if (kind === 'home' || kind === 'dining') return <div className="scene-art home-art"><div className="home-wall" /><div className="home-roof" /><div className="home-door"><div className="door-panel" /><div className="door-panel" /></div><div className="kolam" /><div className="home-window" /><div className="hanging-lamp lamp-flicker" />{kind === 'dining' && <div className="banana-table"><span /><span /><span /><span /></div>}</div>;
  if (kind === 'engagement') return <div className="scene-art terrace-art"><div className="terrace-sky" /><div className="terrace-rail" /><div className="terrace-plant" /><div className="ring-orbit">A</div><div className="terrace-sun" /></div>;
  if (kind === 'garland') return <div className="scene-art floral-arch-art"><div className="arch" /><div className="hanging-flower h-one" /><div className="hanging-flower h-two" /><div className="hanging-flower h-three" /></div>;
  if (kind === 'procession') return <div className="scene-art procession-art"><div className="procession-sky" /><div className="procession-banner">நல்வரவு</div><div className="procession-arch" /><div className="nadaswaram" /><div className="drum" /><div className="dust" /></div>;
  if (kind === 'mandapam' || kind === 'muhurtham' || kind === 'thaali') return <div className="scene-art mandapam-art"><div className="mandapam-bg" /><div className="mandapam-roof" /><div className="pillar p-one" /><div className="pillar p-two" /><div className="pillar p-three" /><div className="fire-bowl"><div className="fire-fire lamp-flicker" /></div>{kind === 'thaali' && <div className="thaali-thread"><div /></div>}</div>;
  if (kind === 'reception') return <div className="scene-art reception-art"><div className="bokeh b-one" /><div className="bokeh b-two" /><div className="bokeh b-three" /><div className="stage-curtain curtain-left" /><div className="stage-curtain curtain-right" /><div className="stage-floor" /><div className="stage-light" /></div>;
  if (kind === 'memories') return <div className="scene-art memories-art"><div className="memory-frame frame-one" /><div className="memory-frame frame-two" /><div className="memory-frame frame-three" /><div className="memory-spark spark-one" /><div className="memory-spark spark-two" /></div>;
  return <div className="scene-art abstract-art"><div className="abstract-orb" /><div className="abstract-ring" /></div>;
}

function ParallaxScene({ scene, index, onOpenDetails }: { scene: Scene; index: number; onOpenDetails: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [50, -50]);
  const artY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-30, 30]);
  const isDark = ['opening', 'city', 'procession', 'muhurtham', 'journey', 'reception', 'ending'].includes(scene.kind);
  return (
    <section ref={ref} id={scene.id} className={`scene-shell ${scene.palette} ${isDark ? 'scene-dark' : ''}`} data-testid={`scene-${scene.id}`}>
      <motion.div className="scene-art parallax-art" style={{ y: artY }}><SceneArt kind={scene.kind} /></motion.div>
      <div className="scene-vignette" />
      <motion.div className={`scene-copy ${scene.kind === 'details' ? 'scene-copy-details' : ''}`} style={{ y: copyY }}>
        <div className="scene-meta"><span>{scene.chapter}</span><span className="scene-meta-rule" /><span>{scene.eyebrow}</span></div>
        <h2 className="scene-title">{scene.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
        <p className="scene-body">{scene.body}</p>
        {scene.kind === 'opening' && <motion.button className="story-button scroll-cta" onClick={() => document.getElementById('street')?.scrollIntoView({ behavior: 'smooth' })} whileTap={{ scale: .96 }} data-testid="button-begin-story">Begin the story <ArrowDown size={15} /></motion.button>}
        {scene.kind === 'details' && <DetailsCard onOpen={onOpenDetails} />}
        {(scene.kind === 'opening' || scene.kind === 'ending') && <Couple pose={scene.kind === 'opening' ? 'walk' : 'together'} scale={scene.kind === 'opening' ? .82 : .98} />}
        {scene.kind !== 'opening' && scene.kind !== 'details' && scene.kind !== 'ending' && ['street', 'city', 'flowers', 'home', 'engagement', 'dining', 'bridal', 'procession', 'mandapam', 'muhurtham', 'garland', 'thaali', 'blessing', 'journey', 'reception', 'memories'].includes(scene.kind) && <Couple pose={scene.kind} scale={scene.kind === 'thaali' ? .7 : .62} />}
        {scene.kind === 'ending' && <p className="ending-signature">With love,<br /><strong>Arjun &amp; Dharshini</strong></p>}
      </motion.div>
      <span className="scene-index">{String(index + 1).padStart(2, '0')}</span>
    </section>
  );
}

function DetailsCard({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="details-card" data-testid="card-invitation-details">
      <div className="detail-row"><CalendarDays size={16} /><div><span>Saturday, 18 January 2025</span><small>Save the date</small></div></div>
      <div className="detail-row"><Clock3 size={16} /><div><span>6:30 in the evening</span><small>Reception follows</small></div></div>
      <div className="detail-row"><MapPin size={16} /><div><span>Thirumalai Mahal</span><small>Madurai, Tamil Nadu</small></div></div>
      <button className="details-link" onClick={onOpen} data-testid="button-open-details">View the full invitation <ArrowUpRight size={15} /></button>
    </div>
  );
}

function FullDetails({ onClose }: { onClose: () => void }) {
  return (
    <motion.div className="details-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-testid="dialog-full-details">
      <motion.div className="details-modal" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
        <button className="modal-close" onClick={onClose} aria-label="Close invitation details" data-testid="button-close-details"><X size={18} /></button>
        <span className="modal-kicker">The invitation</span>
        <h3 className="font-display">A day made<br /><em>for togetherness.</em></h3>
        <div className="modal-divider" />
        <p>We would be honoured to have you with us as our families gather under the jasmine canopy.</p>
        <div className="modal-schedule">
          <div><span>01</span><strong>Jan 18, 2025</strong><small>Saturday evening</small></div>
          <div><span>02</span><strong>6:30 PM onwards</strong><small>Reception &amp; dinner</small></div>
          <div><span>03</span><strong>Thirumalai Mahal</strong><small>Melur Road, Madurai</small></div>
        </div>
        <button className="modal-action" onClick={onClose} data-testid="button-save-invitation">I will be there <Heart size={15} /></button>
      </motion.div>
    </motion.div>
  );
}

function App() {
  const [active, setActive] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const ids = useMemo(() => scenes.map((scene) => scene.id), []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const next = ids.indexOf(visible.target.id);
        if (next >= 0) setActive(next);
      }
    }, { threshold: [0.3, 0.6, 0.9] });
    ids.forEach((id) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, [ids]);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
    setStarted(true);
  };

  return (
    <main className="film-grain wedding-film">
      <header className={`film-nav ${active > 0 ? 'film-nav-scrolled' : ''}`}>
        <button className="wordmark" onClick={() => jumpTo('dawn')} data-testid="button-home"><span className="wordmark-mark">A<span>&amp;</span>D</span><span className="wordmark-copy">A Madurai<br />wedding film</span></button>
        <div className="nav-actions">
          <button className="sound-toggle" onClick={() => setSoundOn(!soundOn)} data-testid="button-toggle-sound">{soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>{soundOn ? 'Sound on' : 'Sound off'}</span></button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open story chapters" data-testid="button-toggle-menu">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </header>
      <aside className="story-progress" aria-label="Story progress">
        <div className="progress-label"><span>THE FILM</span><strong>{String(active + 1).padStart(2, '0')}</strong><span>/ {String(scenes.length).padStart(2, '0')}</span></div>
        <div className="progress-rail">{scenes.map((scene, index) => <button key={scene.id} className={active === index ? 'is-active' : ''} onClick={() => jumpTo(scene.id)} aria-label={`Go to ${scene.eyebrow}`} data-testid={`button-chapter-${index + 1}`}><span /></button>)}</div>
        <div className="progress-caption">scroll to travel</div>
      </aside>
      {menuOpen && <motion.nav className="chapter-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} data-testid="nav-chapters"><span className="menu-kicker">The chapters</span>{scenes.map((scene, index) => <button key={scene.id} onClick={() => jumpTo(scene.id)} className={active === index ? 'is-current' : ''} data-testid={`link-chapter-${index + 1}`}><span>{scene.chapter}</span>{scene.eyebrow}</button>)}</motion.nav>}
      {!started && <div className="scroll-hint"><ChevronDown size={16} /><span>Scroll slowly</span></div>}
      {scenes.map((scene, index) => <ParallaxScene key={scene.id} scene={scene} index={index} onOpenDetails={() => setDetailsOpen(true)} />)}
      <footer className="film-footer"><span>AD / 2025</span><span>Made with all our love in Madurai</span><button onClick={() => jumpTo('dawn')} data-testid="button-replay-film"><CirclePlay size={15} /> Replay the film</button></footer>
      {detailsOpen && <FullDetails onClose={() => setDetailsOpen(false)} />}
    </main>
  );
}

export default App;