import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { IoFlash, IoWater } from 'react-icons/io5'
import Scene from './components/Scene'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const scrollProgress = useRef(0)
  const overviewRef = useRef(null)
  const [hasGlb, setHasGlb] = useState(false)

  // Check if GLB exists
  useEffect(() => {
    fetch('/shaker.glb', { method: 'HEAD' })
      .then((res) => setHasGlb(res.ok))
      .catch(() => setHasGlb(false))
  }, [])

  useEffect(() => {
    // Lenis smooth scroll
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // Wait for DOM
    const ctx = gsap.context(() => {
      // Hero split text slide-up
      gsap.fromTo('.hero-char > span',
        { y: '100%' },
        { y: '0%', duration: 1, ease: 'power3.out', stagger: 0.03, delay: 0.2 }
      )
      // Hero other elements fade in
      const heroOther = [
        { el: '.hero-content p', y: 40 },
        { el: '.hero-cta', y: 30 },
        { el: '.hero-bottom', y: 0 },
        { el: '.hero-nav', y: -20 },
      ]
      heroOther.forEach(({ el, y }, i) => {
        gsap.fromTo(el,
          { y, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6 + 0.15 * i, clearProps: 'all' }
        )
      })

      // Model slides from right (hero) to center (product-overview)
      gsap.set('.model-container', { left: '25%' })
      ScrollTrigger.create({
        trigger: '.intro',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: ({ progress }) => {
          // Start offset 25% right, end at 0% (centered)
          const offset = 25 * (1 - progress)
          gsap.set('.model-container', { left: `${offset}%` })
        },
      })


      // Header 1 character reveal on enter
      const charSpans = document.querySelectorAll('.header-1 h1 .char > span')
      ScrollTrigger.create({
        trigger: '.product-overview',
        start: '75% bottom',
        onEnter: () =>
          gsap.to(charSpans, {
            y: '0%',
            duration: 1,
            ease: 'power3.out',
            stagger: 0.025,
          }),
        onLeaveBack: () =>
          gsap.to(charSpans, {
            y: '100%',
            duration: 1,
            ease: 'power3.out',
            stagger: 0.025,
          }),
      })

      const animOptions = { duration: 1, ease: 'power3.out', stagger: 0.025 }

      // Tooltip selectors with trigger points
      const tooltipSelectors = [
        {
          trigger: 0.7,
          elements: [
            '.tooltip:nth-child(1) .icon-inner',
            '.tooltip:nth-child(1) .title .line > span',
            '.tooltip:nth-child(1) .description .line > span',
          ],
        },
        {
          trigger: 0.85,
          elements: [
            '.tooltip:nth-child(2) .icon-inner',
            '.tooltip:nth-child(2) .title .line > span',
            '.tooltip:nth-child(2) .description .line > span',
          ],
        },
      ]

      // Main pinned ScrollTrigger
      ScrollTrigger.create({
        trigger: '.product-overview',
        start: 'top top',
        end: `+=${window.innerHeight * 10}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: ({ progress }) => {
          scrollProgress.current = progress

          // Phase 1: Header 1 slides left (0.0 – 0.15)
          const h1Progress = Math.max(0, Math.min(1, progress / 0.15))
          gsap.to('.header-1', {
            xPercent: -100 * h1Progress,
          })

          // Phase 2: Circular mask expands (0.15 – 0.25)
          const maskSize =
            progress < 0.15
              ? 0
              : progress > 0.25
              ? 100
              : 100 * ((progress - 0.15) / 0.1)

          // Phase 3: Header 2 slides in from right then out left (0.25 – 0.45) — on dark bg
          const h2Progress = Math.max(0, Math.min(1, (progress - 0.25) / 0.2))
          const header2XPercent =
            progress < 0.25
              ? 100
              : progress > 0.45
              ? -100
              : 100 - 200 * h2Progress
          gsap.set('.header-2', {
            xPercent: header2XPercent,
            opacity: progress >= 0.15 ? 1 : 0,
          })
          gsap.to('.circular-mask', {
            clipPath: `circle(${maskSize}% at 50% 50%)`,
          })

          // Phase 4: Tooltip divider scaleX (0.55 – 0.7)
          const scaleX =
            progress < 0.55
              ? 0
              : progress > 0.7
              ? 100
              : 100 * ((progress - 0.55) / 0.15)
          gsap.to('.tooltip .divider', { scaleX: `${scaleX}%`, ...animOptions })

          // Tooltip element reveals
          tooltipSelectors.forEach(({ trigger, elements }) => {
            gsap.to(elements.join(', '), {
              y: progress >= trigger ? '0%' : '125%',
              ...animOptions,
            })
          })

        },
      })
    })

    return () => {
      ctx.revert()
      lenis.destroy()
    }
  }, [])

  return (
    <div className="app">
      {/* Intro / Hero */}
      <section className="intro">
        <svg className="hero-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="none"
            stroke="#95D600"
            strokeWidth="2"
            d="M0,160 C180,80 360,240 540,160 C720,80 900,240 1080,160 C1260,80 1440,240 1440,160"
          />
          <path
            fill="none"
            stroke="#95D600"
            strokeWidth="1.5"
            opacity="0.4"
            d="M0,200 C180,120 360,280 540,200 C720,120 900,280 1080,200 C1260,120 1440,280 1440,200"
          />
          <path
            fill="none"
            stroke="#95D600"
            strokeWidth="1"
            opacity="0.2"
            d="M0,120 C180,40 360,200 540,120 C720,40 900,200 1080,120 C1260,40 1440,200 1440,120"
          />
        </svg>
        <nav className="hero-nav">
          <span className="hero-logo">monster energy</span>
          <span className="hero-menu">&#9776;</span>
        </nav>
        <div className="hero-content">
          <h1>
            {['unleash', 'the beast'].map((word, wi) => (
              <span key={wi} className="hero-line">
                {word.split('').map((char, ci) => (
                  <span key={ci} className="hero-char">
                    <span>{char === ' ' ? '\u00A0' : char}</span>
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p>Tear into a can of the meanest energy drink on the planet. Monster Energy — fuel your ambition, power your day.</p>
          <button className="hero-cta">Shop Monster <span className="arrow">&#8599;</span></button>
        </div>
        <div className="hero-bottom">
          <span className="hero-tags">explosive energy &bull; bold flavor &bull; zero compromise</span>
          <span className="hero-scroll">scroll down ——— 0%</span>
        </div>
      </section>

      {/* Product Overview - pinned */}
      <section className="product-overview" ref={overviewRef}>
        {/* Header 1 */}
        <div className="header-1">
          <h1>
            {'Fuel Your Fire With'.split('').map((char, i) => (
              <span key={i} className="char" style={{ display: 'inline-block', overflow: 'hidden' }}>
                <span style={{ display: 'block', transform: 'translateY(125%)', willChange: 'transform' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* Header 2 */}
        <div className="header-2">
          <h1>Monster Energy</h1>
          <div className="brand-line"></div>
        </div>

        {/* Circular mask */}
        <div className="circular-mask"></div>

        {/* Tooltips */}
        <div className="tooltips">
          <div className="tooltip">
            <div className="icon">
              <span className="icon-inner" style={{ display: 'block', transform: 'translateY(125%)', willChange: 'transform' }}>
                <IoFlash />
              </span>
            </div>
            <div className="divider"></div>
            <div className="title">
              <span className="line" style={{ display: 'inline-block', overflow: 'hidden' }}>
                <span style={{ position: 'relative', display: 'block', transform: 'translateY(125%)', willChange: 'transform' }}>
                  <h2>Ginseng</h2>
                </span>
              </span>
            </div>
            <div className="description">
              <span className="line" style={{ display: 'inline-block', overflow: 'hidden' }}>
                <span style={{ position: 'relative', display: 'block', transform: 'translateY(125%)', willChange: 'transform' }}>
                  <p>
                    A natural adaptogen used for centuries to fight fatigue and
                    sharpen focus. Pure energy from the root up.
                  </p>
                </span>
              </span>
            </div>
          </div>

          <div className="tooltip">
            <div className="icon">
              <span className="icon-inner" style={{ display: 'block', transform: 'translateY(125%)', willChange: 'transform' }}>
                <IoWater />
              </span>
            </div>
            <div className="divider"></div>
            <div className="title">
              <span className="line" style={{ display: 'inline-block', overflow: 'hidden' }}>
                <span style={{ position: 'relative', display: 'block', transform: 'translateY(125%)', willChange: 'transform' }}>
                  <h2>Taurine</h2>
                </span>
              </span>
            </div>
            <div className="description">
              <span className="line" style={{ display: 'inline-block', overflow: 'hidden' }}>
                <span style={{ position: 'relative', display: 'block', transform: 'translateY(125%)', willChange: 'transform' }}>
                  <p>
                    An amino acid that supports endurance, hydration, and
                    muscle recovery. The fuel behind every can.
                  </p>
                </span>
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* 3D Model - fixed overlay */}
      <div className="model-container">
        <Canvas
          camera={{ fov: 60, near: 0.1, far: 1000 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene scrollProgress={scrollProgress} useGlb={hasGlb} />
        </Canvas>
      </div>

      {/* Outro */}
      <section className="outro">
        <h1>Unleash The Beast Within</h1>
        <a href="https://weabers.com" target="_blank" rel="noopener noreferrer" className="buy-now">Buy Now <span className="arrow">&#8599;</span></a>
      </section>
    </div>
  )
}

export default App
