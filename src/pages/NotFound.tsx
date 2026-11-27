import { Link } from 'react-router-dom'
export default function NotFound() {
  return <section className="section"><div className="wrap text-center"><h1 className="h2 mx-auto">Page not found</h1><p className="lead mx-auto">The page you’re looking for doesn’t exist or has moved.</p><Link to="/" className="btn-p">Back to home</Link></div></section>
}
