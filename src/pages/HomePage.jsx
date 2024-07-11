import { useRef } from 'react'
import { useNavigate } from 'react-router'
import { utilService } from '../services/util.service'
import { AppHeader } from '../components/general/AppHeader'
import { useTheme } from '../customHooks/useTheme'

export function HomePage() {
  const homePageRef = useRef(null)
  const navigate = useNavigate()
  const { getThemeClass } = useTheme()

  function onGetStarted() {
    utilService.animateCSS(homePageRef.current, 'slideOutLeft')
    setTimeout(() => navigate('/canvas'), 800)
  }

  return (
    <section
      ref={homePageRef}
      className={`home-page flex column animate__animated animate__slideInLeft ${getThemeClass()}`}
    >
      <AppHeader />

      <section className="hero-section flex column align-center justify-center">
        <div className="main-content flex column align-center justify-center">
          <div className="heading-container flex column align-center justify-center">
            <h1 className="main-heading">
              Welcome to
              <span>
                <span className="logo">
                  &nbsp;<span>S</span>ketch<span>M</span>ate
                </span>
              </span>
              &nbsp;- Your friendly companion for creative drawing
            </h1>
            <h3 className="secondary-heading">
              Discover the Power of SketchMate – Your Professional Tool for Exceptional Drawings.
              Unleash your imagination and create beautiful sketches effortlessly.
            </h3>
          </div>

          <button className="btn-cta" onClick={onGetStarted}>
            Get Started
          </button>
        </div>

        <img src={`/assets/img/hero-light.png`} alt="Drawing studio" className="hero-img" />
      </section>
    </section>
  )
}
