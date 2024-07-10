import { NavLink } from 'react-router-dom'

export function HomePage() {
  return (
    <section className="home-page flex column align-center justify-center">
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

      <NavLink to={'/canvas'}>
        <button className="btn-cta">Get Started</button>
      </NavLink>
    </section>
  )
}
