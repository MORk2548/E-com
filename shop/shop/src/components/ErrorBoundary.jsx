import { Component } from 'react'
// Last line of defence: a render crash shows a friendly page instead of a blank screen.
export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { console.error(error) }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="container page-center" role="alert">
        <h1>Something went wrong.</h1>
        <p className="muted">An unexpected error occurred. Reloading the page usually fixes it.</p>
        <button className="btn btn--primary btn--md" onClick={() => window.location.assign('/')}>Back to home</button>
      </div>
    )
  }
}
