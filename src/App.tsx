import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import InternshipTraining from './pages/InternshipTraining'
import ProgramDetail from './pages/ProgramDetail'
import LegalPage from './pages/LegalPage'
import AdminInternships from './pages/admin/AdminInternships'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolio/:slug" element={<ProjectDetail />} />
        <Route path="careers" element={<Careers />} />
        <Route path="internship-training" element={<InternshipTraining />} />
        <Route path="internship-training/:slug" element={<ProgramDetail />} />
        <Route path="privacy-policy" element={<LegalPage kind="privacy" />} />
        <Route path="terms-and-conditions" element={<LegalPage kind="terms" />} />
        <Route path="admin/internships" element={<AdminInternships />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
