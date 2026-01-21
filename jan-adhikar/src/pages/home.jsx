import { useState, useEffect } from 'preact/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Gavel, GraduationCap, Landmark, MessageSquare, Brain } from 'lucide-react';

const userFeatures = [
  {
    icon: MessageSquare,
    title: 'Submit Query',
    description: 'Submit your specific legal queries and get guidance from verified legal professionals.',
    href: '/submit-query',
    color: 'from-blue-500 to-blue-600',
    gradient: 'from-blue-50 to-blue-100'
  },
  {
    icon: Brain,
    title: 'AI Legal Explainer',
    description: 'Ask any legal question in simple language and get clear, AI-powered answers.',
    href: '/LegalExplainer',
    color: 'from-purple-500 to-purple-600',
    gradient: 'from-purple-50 to-purple-100'
  },
  {
    icon: Landmark,
    title: 'Constitution Explorer',
    description: 'Browse and understand the articles of the Indian Constitution with simplified explanations.',
    href: '/constitution',
    color: 'from-green-500 to-green-600',
    gradient: 'from-green-50 to-green-100'
  },
  {
    icon: GraduationCap,
    title: 'Interactive Courses',
    description: 'Learn about your rights and the legal system through engaging, easy-to-follow courses.',
    href: '/courses',
    color: 'from-orange-500 to-orange-600',
    gradient: 'from-orange-50 to-orange-100'
  },
];

const lawyerFeatures = [
  {
    icon: Gavel,
    title: 'My Dashboard',
    description: 'View pending queries assigned to you and provide expert legal guidance.',
    href: '/lawyer-dashboard',
    color: 'from-blue-500 to-blue-600',
    gradient: 'from-blue-50 to-blue-100'
  },
  {
    icon: Brain,
    title: 'AI Legal Explainer',
    description: 'Research legal topics and get AI-powered legal insights.',
    href: '/LegalExplainer',
    color: 'from-purple-500 to-purple-600',
    gradient: 'from-purple-50 to-purple-100'
  },
  {
    icon: Landmark,
    title: 'Constitution Explorer',
    description: 'Reference the Indian Constitution for accurate legal information.',
    href: '/constitution',
    color: 'from-green-500 to-green-600',
    gradient: 'from-green-50 to-green-100'
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('user');
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const role = localStorage.getItem('role') || localStorage.getItem('selectedRole') || 'user';
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
    
    setUserRole(role);
    setIsReady(true);
  }, []);

  const features = userRole === 'lawyer' ? lawyerFeatures : userFeatures;

  return (
    <div className="min-h-screen bg-white text- slate-900">
      {!isReady ? (
        <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
            <div className="max-w-6xl mx-auto">
              <div className="mb-4">
                {user && (
                  <p className="text-slate-600 text-sm font-medium">Welcome back,</p>
                )}
                <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {user ? `${user.firstName || user.name || 'User'}` : 'Jan Adhikar'}
                </h1>
                {user && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                      {userRole === 'lawyer' ? '⚖️ Lawyer Account' : '👤 User Ac   1count'}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-lg text-slate-700 mb-8 max-w-3xl">
                Your trusted platform for legal guidance and constitutional knowledge. Get expert advice, explore laws, and understand your rights.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    if (user) {
                      if (userRole === 'lawyer') {
                        navigate('/lawyer-dashboard');
                      } else {
                        navigate('/submit-query');
                      }
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-8 py-4 text-lg rounded-lg font-semibold shadow-lg shadow-indigo-600/50 text-white cursor-pointer"
                >
                  {user ? (userRole === 'lawyer' ? 'View Dashboard' : 'Submit Query') : 'Get Started'} 
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <h2 className="text-4xl font-bold mb-2">Explore Our Services</h2>
                <p className="text-slate-600 text-lg">
                  Everything you need for legal guidance and education
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Link
                      key={feature.title}
                      to={feature.href}
                      className="group h-full bg-white border-2 border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 rounded-lg p-6 overflow-hidden"
                    >
                      <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300 inline-flex items-center justify-center`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-600 mb-6 text-sm">{feature.description}</p>
                      <div className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition font-semibold group">
                        Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-y border-slate-200">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: '800+', label: 'Expert Lawyers' },
                  { number: '50K+', label: 'Cases Resolved' },
                  { number: '100+', label: 'Legal Topics' },
                  { number: '98%', label: 'Satisfaction' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">{stat.number}</p>
                    <p className="text-slate-700 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 text-slate-900">
                Need Legal Help Right Now?
              </h2>
              <p className="text-xl text-slate-700 mb-10">
                Connect with a verified lawyer in minutes and get expert guidance on your legal matters.
              </p>
              <Link
                to="/submit-query"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-4 text-lg rounded-lg font-semibold shadow-lg shadow-indigo-600/50 text-white"
              >
                Submit Query
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}