import { useRef } from 'react'
import { useNavigate } from 'react-router'
import { utilService } from '../services/util.service'

export function HomePage() {
  const homePageRef = useRef(null)
  const navigate = useNavigate()

  function onGetStarted() {
    utilService.animateCSS(homePageRef.current, 'slideOutLeft')
    setTimeout(() => navigate('/canvas'), 450)
  }

  return (
    <section
      ref={homePageRef}
      className="home-page flex column align-center justify-center animate__animated animate__slideInLeft"
    >
      <div className="heading-container flex column align-center">
        <h1 className="main-heading">
          Welcome to
          <span>
            <span className="logo">
              &nbsp;Sketch<span>M</span>ate
            </span>
          </span>
          &nbsp;- Your friendly companion for creative drawing.
        </h1>
        <h3 className="secondary-heading">
          Discover the Power of SketchMate – Your Professional Tool for Exceptional Drawings.
          Unleash your imagination and create beautiful sketches effortlessly.
        </h3>
      </div>

      <button className="btn-cta" onClick={onGetStarted}>
        Get Started
      </button>
    </section>
  )
}
