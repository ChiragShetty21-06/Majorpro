import './app.css'
import Layout from './Layout.jsx'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/home.jsx'
import LegalExplainerPage from './pages/LegalExxplainer.jsx'
import ConstitutionPage from './pages/Constitution.jsx'
import CoursesPage from './pages/Course.jsx'
import QuerySubmitPage from './pages/QuerySubmit.jsx'
import ConsultationPage from './pages/consultation.jsx'
import CourseDetailPage from './pages/CourseDetails.jsx'
import FeedbackPage from './pages/Feedback.jsx'
import LawyerDashboard from './pages/LawyerDashboard.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import Login from './pages/Login.jsx'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/home" element={<Layout><HomePage /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/LegalExplainer" element={<Layout><LegalExplainerPage /></Layout>} />
      <Route path="/constitution" element={<Layout><ConstitutionPage /></Layout>} />
      <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
      <Route path="/courses/:id" element={<Layout><CourseDetailPage /></Layout>} />
      <Route path="/submit-query" element={<Layout><QuerySubmitPage /></Layout>} />
      <Route path="/consultation" element={<Layout><ConsultationPage /></Layout>} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
      <Route path="/feedback" element={<Layout><FeedbackPage /></Layout>} />
    </Routes>
  )
}

