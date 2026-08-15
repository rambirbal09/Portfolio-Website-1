import { useEffect, useRef, useState, useCallback } from 'react'

/* =============================================
   INTERSECTION OBSERVER HOOK (triggers once)
   ============================================= */
function useRevealOnce(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

/* =============================================
   NAVBAR
   ============================================= */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navTo = useCallback((id: string) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-full-width">
          {/* Logo — far left */}
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="nav-logo-text">Prince Bal</span>
          </div>

          {/* Nav links — absolutely centered */}
          <ul className="nav-links">
            {[
              ['Home', 'hero'],
              ['Results', 'results'],
              ['Work', 'work'],
              ['About', 'about'],
              ['Reviews', 'reviews'],
            ].map(([label, id]) => (
              <li key={id}>
                <a href={`#${id}`} onClick={(e) => { e.preventDefault(); navTo(id) }}>{label}</a>
              </li>
            ))}
          </ul>

          {/* CTA — far right */}
          <div className="nav-right">
            <a href="https://lunacal.ai/princebal/meetings" target="_blank" rel="noopener noreferrer" className="nav-cta">
              Book a Call →
            </a>
            <div className="nav-hamburger" onClick={() => setMobileOpen(true)}>
              <span /><span /><span />
            </div>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>✕</button>
        {[
          ['Home', 'hero'],
          ['Results', 'results'],
          ['Work', 'work'],
          ['About', 'about'],
          ['Reviews', 'reviews'],
        ].map(([label, id]) => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); navTo(id) }}>{label}</a>
        ))}
        <a href="https://lunacal.ai/princebal/meetings" target="_blank" rel="noopener noreferrer" className="btn-primary mobile-nav-cta">
          Book a Call →
        </a>
      </div>
    </>
  )
}

/* =============================================
   HERO SECTION — clean, no floating cards
   ============================================= */
function HeroSection() {
  return (
    <section className="hero" id="hero">
      {/* Static base glow */}
      <div className="hero-glow" />
      {/* Bottom section fade — ::after is used by purple glow orb */}
      <div className="hero-bottom-fade" />

      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Available for New Projects
          </div>

          <h1 className="hero-title">
            Generated Over<br />
            100M+ Views For<br />
            <span className="gradient-text">Creators & Brands</span>
          </h1>

          <p className="hero-subtitle">
            Prince Bal is a professional video editor specializing in YouTube long-form content,
            short-form reels, and podcast edits that drive views and grow audiences.
          </p>

          <div className="hero-actions">
            <a
              href="https://lunacal.ai/princebal/meetings"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <span>Book a Call →</span>
            </a>
            <button
              className="btn-outline"
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work →
            </button>
          </div>

          <div className="trusted-by">
            <div className="trusted-by-label">Trusted by</div>
            <div className="trusted-by-cards">
              {[
                {
                  img: '/images/client-keshav.jpg',
                  name: 'Keshav Grower',
                  role: 'Content Creator',
                  followers: '155K Followers',
                },
                {
                  img: '/images/client-govind.jpg',
                  name: 'Govind Rai',
                  role: 'Content Creator',
                  followers: '27K Followers',
                },
                {
                  img: '/images/client-scaler.jpg',
                  name: 'Scaler School of Business',
                  role: 'Business School',
                  followers: '30K Followers',
                },
              ].map((client) => (
                <div key={client.name} className="trusted-client-card">
                  <img
                    src={client.img}
                    alt={client.name}
                    className="trusted-client-avatar"
                  />
                  <div className="trusted-client-info">
                    <div className="trusted-client-name">
                      {client.name}
                      <svg className="verified-badge verified-badge-trusted" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9" cy="9" r="9" fill="#1E88E5"/>
                        <polyline points="5,9 8,12 13,6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="trusted-client-role">{client.role}</div>
                    <div className="trusted-client-followers">{client.followers}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =============================================
   CUSTOM VIDEO PLAYER — Revamp Media style
   ============================================= */
function CustomVideoPlayer({ videoId, title, aspectRatio = '9/16' }: { videoId: string; title: string; aspectRatio?: '9/16' | '16/9' }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [imgSrc, setImgSrc] = useState(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&controls=1&autoplay=1&iv_load_policy=3`

  useEffect(() => {
    setImgSrc(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
    setIsPlaying(false)
  }, [videoId])

  if (isPlaying) {
    return (
      <div className="video-wrapper" style={{ aspectRatio }} data-embed={embedUrl}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      </div>
    )
  }

  return (
    <div 
      className="video-wrapper" 
      onClick={() => setIsPlaying(true)} 
      style={{ aspectRatio }}
      data-embed={embedUrl}
    >
      {/* Thumbnail background */}
      <img 
        className="video-thumbnail" 
        src={imgSrc} 
        alt={title}
        onError={() => setImgSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)}
      />
      
      {/* Custom play button overlay */}
      <div className="play-overlay">
        <div className="play-btn">
          <svg width="68" height="48" viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg">
            <rect width="68" height="48" rx="12" fill="rgba(255,255,255,0.18)"/>
            <polygon points="26,14 50,24 26,34" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

/* =============================================
   RESULTS SECTION — Revamp-style featured client card
   ============================================= */
function ResultsSection() {
  const { ref: headRef, visible: headVisible } = useRevealOnce()
  const { ref: cardRef, visible: cardVisible } = useRevealOnce()

  useEffect(() => {
    const statsContainer = document.querySelector('.stats-container')
    const viewsEl = document.querySelector('.stats-views-value') as HTMLElement
    const followersEl = document.querySelector('.stats-followers-value') as HTMLElement
    const engagementEl = document.querySelector('.stats-engagement-value') as HTMLElement
    const badges = document.querySelectorAll('.fc-stats-row .fc-stat-badge')

    if (!statsContainer || !viewsEl || !followersEl || !engagementEl) return

    function countUp(element: HTMLElement, start: number, end: number, duration: number, suffix: string) {
      const startTime = performance.now()
      function update(currentTime: number) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 4) // easeOutQuart
        const current = start + (end - start) * eased
        element.textContent = current.toFixed(end % 1 !== 0 ? 1 : 0) + suffix
        if (progress < 1) {
          requestAnimationFrame(update)
        }
      }
      requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(viewsEl, 0, 70, 2000, 'M+')
          countUp(followersEl, 0, 150, 2000, 'K+')
          countUp(engagementEl, 0, 11.4, 2000, '%')

          // Fade in the badges after 2000ms
          setTimeout(() => {
            badges.forEach(badge => {
              badge.classList.add('animate-fade-in')
            })
          }, 2000)

          observer.disconnect()
        }
      })
    }, { threshold: 0.5 })

    observer.observe(statsContainer)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section className="results" id="results">
      <div className="container">

        {/* Section header row — label + headline left, CTA right */}
        <div
          ref={headRef as React.RefObject<HTMLDivElement>}
          className={`results-header reveal ${headVisible ? 'visible' : ''}`}
        >
          <div className="results-header-left">
            <div className="glass-section-label">
              Results <span className="arrow-blue">↓</span>
            </div>
            <h2 className="section-headline" style={{ marginBottom: 0 }}>Here's what Keshav had to say</h2>
          </div>
          <a
            href="https://lunacal.ai/princebal/meetings"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary results-cta"
          >
            <span>Scale Your Brand →</span>
          </a>
        </div>

        {/* Featured client card */}
        <div
          ref={cardRef as React.RefObject<HTMLDivElement>}
          className={`featured-client-card reveal reveal-delay-1 ${cardVisible ? 'visible' : ''}`}
        >
          {/* LEFT — vertical video embed */}
          <div className="fc-video-col">
            <div className="fc-video-glow-frame">
              <CustomVideoPlayer
                videoId="mxWi5cf7CeY"
                title="Keshav Grower Testimonial"
                aspectRatio="9/16"
              />
            </div>
          </div>

          {/* RIGHT — client info */}
          <div className="fc-info-col">

            {/* Profile badge top-right */}
            <div className="fc-profile-badge">
              <img src="/images/client-keshav.jpg" alt="Keshav Grower" className="fc-badge-avatar" />
              <div className="fc-badge-text">
                <div className="fc-badge-name">
                  Keshav Grower
                  <svg className="verified-badge verified-badge-results-profile" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9" r="9" fill="#1E88E5"/>
                    <polyline points="5,9 8,12 13,6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="fc-badge-followers">155K followers</div>
              </div>
            </div>

            {/* Name + identity */}
            <div className="fc-client-identity">
              <div className="fc-client-name">
                Keshav Grower
              </div>
              <div className="fc-client-desc">→ Content Creator With 155K Followers</div>
            </div>

            {/* Social links */}
            <div className="fc-social-links">
              <a
                href="https://www.instagram.com/keshavgrower"
                target="_blank"
                rel="noopener noreferrer"
                className="fc-social-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'url(#ig-grad-results)' }}>
                  <defs>
                    <linearGradient id="ig-grad-results" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f89e37" />
                      <stop offset="50%" stopColor="#eb495a" />
                      <stop offset="100%" stopColor="#a937b2" />
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>
            </div>

            {/* Stats row */}
            <div className="fc-stats-row stats-container">
              <div className="fc-stat-box">
                <div className="fc-stat-label">Views Gained</div>
                <div className="fc-stat-value stats-views-value">70M+</div>
                <div className="fc-stat-badge">+580%</div>
              </div>
              <div className="fc-stat-box">
                <div className="fc-stat-label">Follower Growth</div>
                <div className="fc-stat-value stats-followers-value">150K+</div>
                <div className="fc-stat-badge">+240%</div>
              </div>
              <div className="fc-stat-box">
                <div className="fc-stat-label">Engagement Rate</div>
                <div className="fc-stat-value stats-engagement-value">11.4%</div>
                <div className="fc-stat-badge">+5x</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}


/* =============================================
   WORK SECTION — Short-Form FIRST, then YouTube
   ============================================= */

/* Short-Form Reels — real YouTube Shorts embeds */
const shortReels = [
  { id: 'mxWi5cf7CeY', title: 'Viral Reel Edit #1', views: '170K+ VIEWS' },
  { id: 'B2mrTVZz_vs', title: 'Viral Reel Edit #2', views: '52K+ VIEWS' },
  { id: 'k_0655E-OrI', title: 'Viral Reel Edit #3', views: '1.3M+ VIEWS' },
  { id: 'h1rD-ENiQDw', title: 'Viral Reel Edit #4', views: '600K+ VIEWS' },
]

function ReelsSection() {
  const { ref: headRef, visible: headVisible } = useRevealOnce()
  const { ref: gridRef, visible: gridVisible } = useRevealOnce()

  return (
    <section className="work-sub-section" id="work">
      <div className="container">
        <div
          ref={headRef as React.RefObject<HTMLDivElement>}
          className={`reveal ${headVisible ? 'visible' : ''}`}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px' }}
        >
          <div className="glass-section-label">
            Work <span className="arrow-blue">↓</span>
          </div>
          <h2 className="section-headline">See The Edits That Drive Results</h2>
        </div>

        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className={`reveal reveal-delay-1 ${gridVisible ? 'visible' : ''}`}
        >
          <h3 className="work-subsection-heading">Reels</h3>
        </div>

        <div className="reels-grid">
          {shortReels.map((reel, i) => (
            <ReelColumn key={`${reel.id}-${i}`} reel={reel} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ReelColumn({ reel, delay }: { reel: typeof shortReels[0]; delay: number }) {
  const { ref, visible } = useRevealOnce()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reel-column reveal reveal-delay-${delay} ${visible ? 'visible' : ''}`}
    >
      <div className="reel-embed-card reel-card">
        <CustomVideoPlayer videoId={reel.id} title={reel.title} aspectRatio="9/16" />
      </div>
      <div className="reel-stat-card">
        <div className="reel-stat-views">{reel.views}</div>
      </div>
    </div>
  )
}

/* YouTube Long-Form — 1 featured embed + placeholder cards */
function YoutubeSection() {
  const { ref: headRef, visible: headVisible } = useRevealOnce()
  const { ref: featRef, visible: featVisible } = useRevealOnce()
  const { ref: moreRef, visible: moreVisible } = useRevealOnce()


  return (
    <section className="work-sub-section work-yt-section">
      <div className="container">
        <div
          ref={headRef as React.RefObject<HTMLDivElement>}
          className={`reveal ${headVisible ? 'visible' : ''}`}
        >
          <h3 className="work-subsection-heading">YouTube Long-Form</h3>
        </div>

        {/* Featured embed */}
        <div
          ref={featRef as React.RefObject<HTMLDivElement>}
          className={`yt-featured reveal reveal-delay-1 ${featVisible ? 'visible' : ''}`}
        >
          <CustomVideoPlayer videoId="XRPsoJeZ7XI" title="Featured YouTube Video" aspectRatio="16/9" />
        </div>

        {/* Placeholder cards */}
        <div
          ref={moreRef as React.RefObject<HTMLDivElement>}
          className={`yt-placeholders reveal reveal-delay-2 ${moreVisible ? 'visible' : ''}`}
        >
          {/* First slot: Previous featured video moved down */}
          <div className="yt-placeholder-card">
            <CustomVideoPlayer videoId="PpQTIDusrQI" title="Salary Growth Story" aspectRatio="16/9" />
            <div className="yt-placeholder-info">
              <div className="yt-placeholder-title">Salary Growth Story</div>
            </div>
          </div>

          {/* Second slot: COMING SOON - untouched */}
          <div className="yt-placeholder-card">
            <div className="yt-placeholder-thumb">
              <div className="placeholder-play-btn" />
              <div className="yt-coming-soon">Coming Soon</div>
            </div>
            <div className="yt-placeholder-info">
              <div className="yt-placeholder-title">Upcoming Project Reveal</div>
            </div>
          </div>
        </div>

        <div className="work-cta">
          <a
            href="https://lunacal.ai/princebal/meetings"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <span>Scale Your Brand →</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* =============================================
   ABOUT SECTION
   ============================================= */
const skills = [
  { label: 'YouTube Long-Form Editor', color: '#1E88E5' },
  { label: 'Short-Form Reels Specialist', color: '#7C3AED' },
  { label: 'Content Strategist', color: '#EF4444' },
  { label: 'Growth-Focused Creator Partner', color: '#42A5F5' },
]

function AboutSection() {
  const { ref: leftRef, visible: leftVisible } = useRevealOnce()
  const { ref: rightRef, visible: rightVisible } = useRevealOnce()

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-inner">
          <div
            ref={leftRef as React.RefObject<HTMLDivElement>}
            className={`reveal ${leftVisible ? 'visible' : ''}`}
          >
            <div className="glass-section-label">
              About <span className="arrow-blue">↓</span>
            </div>
            <h2 className="section-headline">Prince Bal</h2>
            <div className="about-label-sub">
              VIDEO EDITOR | CONTENT STRATEGIST | CREATIVE DIRECTOR
            </div>
            <p className="about-bio">
              From a passion for storytelling to mastering the craft of video editing — Prince Bal
              delivers cinematic, high-retention edits for creators and brands who want to grow.
              Specializing in YouTube long-form, short-form reels, and podcast content across
              Instagram and YouTube.
            </p>
            <div className="about-skills">
              {skills.map((s) => (
                <div key={s.label} className="skill-item">
                  <div className="skill-dot" style={{ background: s.color }} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          <div
            ref={rightRef as React.RefObject<HTMLDivElement>}
            className={`about-card-visual reveal reveal-delay-2 ${rightVisible ? 'visible' : ''}`}
          >
            <img className="about-profile-img" src="/images/Profile_Picture.jpg" alt="Prince Bal" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* =============================================
   REVIEWS SECTION
   ============================================= */
const reviews = [
  {
    name: 'Keshav Grower',
    handle: '@keshavgrower',
    followers: '155K Followers',
    img: '/images/1.jpg',
    quote: 'Prince transformed our content quality completely. Our reels started performing 3x better after working with him. The retention-focused editing style made all the difference.',
  },
  {
    name: 'Govind Rai',
    handle: '@ca_govindrai',
    followers: '27K Followers',
    img: '/images/2.jpg',
    quote: 'Incredible attention to detail. Prince understands finance content and makes it engaging and visual. Our complex tax topics finally became watchable — and viral.',
  },
  {
    name: 'Scaler School Of Business',
    handle: '@scalerschool_of_business',
    followers: '30K Followers',
    img: '/images/3.jpg',
    quote: 'Professional, fast, and creative. Our business content has never looked this good. Prince delivers premium quality consistently, every single time.',
  },
  {
    name: 'Mehakdeep Singh',
    handle: '@mehak.shokar',
    followers: '5.5K Followers',
    img: '/images/6.jpg',
    quote: "Prince transformed my reels completely — clean edits, fast-paced, and high retention. My engagement shot up after just the first few videos. Highly recommend.",
  },
]

type ReviewData = typeof reviews[0]
function ReviewCard({ review: r, delay }: { review: ReviewData; delay: number }) {
  const { ref, visible } = useRevealOnce()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`review-card reveal reveal-delay-${delay} ${visible ? 'visible' : ''}`}
    >
      <div className="review-header">
        <img src={r.img} alt={r.name} className="review-avatar" />
        <div>
          <div className="review-name">
            {r.name}
            <svg className="verified-badge verified-badge-review" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="9" fill="#1E88E5"/>
              <polyline points="5,9 8,12 13,6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="review-handle">{r.handle}</div>
          <div className="review-followers">{r.followers}</div>
        </div>
      </div>
      <div className="review-stars">
        {'★★★★★'.split('').map((s, j) => <span key={j} className="star">{s}</span>)}
      </div>
      <p className="review-quote">"{r.quote}"</p>
    </div>
  )
}

function ReviewsSection() {
  const { ref: headRef, visible: headVisible } = useRevealOnce()

  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div
          ref={headRef as React.RefObject<HTMLDivElement>}
          className={`reveal ${headVisible ? 'visible' : ''}`}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px' }}
        >
          <div className="glass-section-label">
            Reviews <span className="arrow-blue">↓</span>
          </div>
          <h2 className="section-headline">Here's what clients had to say</h2>
        </div>

        {/* Horizontal auto-scrolling carousel */}
        <div className="reviews-slider-wrapper">
          <div className="reviews-slider-track">
            {/* Original cards */}
            {reviews.map((r, i) => (
              <ReviewCard key={`orig-${r.handle}`} review={r} delay={i + 1} />
            ))}
            {/* Duplicate cards for seamless loop */}
            {reviews.map((r, i) => (
              <ReviewCard key={`dup-${r.handle}`} review={r} delay={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}



/* =============================================
   CONTACT SECTION
   ============================================= */
function ContactSection() {
  const { ref, visible } = useRevealOnce()

  return (
    <section className="contact" id="contact">
      <div className="contact-glow" />
      <div className="container">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`reveal ${visible ? 'visible' : ''}`}
        >
          <h2>Ready to Scale Your Brand?</h2>
          <p>Book a free strategy call and let's talk about growing your channel.</p>

          <div className="contact-actions">
            <a href="https://lunacal.ai/princebal/meetings" target="_blank" rel="noopener noreferrer" className="contact-btn">
              Book a Call →
            </a>
          </div>

          <div className="social-links">
            <a
              href="https://www.instagram.com/prince.bal13?igsh=MTNzdXR4bHc0eDBueQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="http://www.linkedin.com/in/princebal"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a
              href="https://x.com/prince_bal13?s=11"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="Twitter / X"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="mailto:princebal13013@gmail.com"
              className="social-link"
              title="Email"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =============================================
   FOOTER
   ============================================= */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/images/nav_avatar.jpg" alt="Prince Bal" className="footer-logo-img" />
          </div>
          <div className="footer-copy">© 2026 Prince Bal. All rights reserved.</div>
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }) }}>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }) }}>Work</a>
            <a href="https://lunacal.ai/princebal/meetings" target="_blank" rel="noopener noreferrer">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* =============================================
   BACK TO TOP BUTTON
   ============================================= */
function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      ↑
    </button>
  )
}

/* =============================================
   ROOT APP
   ============================================= */
export default function App() {
  return (
    <>
      {/* Global animated background orbs — position: fixed, GPU accelerated */}
      <div className="bg-orb bg-orb-1" aria-hidden="true" />
      <div className="bg-orb bg-orb-2" aria-hidden="true" />
      <div className="bg-orb bg-orb-3" aria-hidden="true" />

      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />
      <main>
        <HeroSection />
        <ResultsSection />
        <ReelsSection />
        <YoutubeSection />
        <AboutSection />
        <ReviewsSection />
        <ContactSection />
        <Footer />
      </main>
      <BackToTop />
    </>
  )
}
