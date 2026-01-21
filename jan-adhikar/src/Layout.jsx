import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/LegalExplainer', label: 'Legal Explainer' },
  { href: '/constitution', label: 'Constitution' },
  { href: '/courses', label: 'Courses' },
  { href: '/feedback', label: 'Feedback' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
    setIsLoaded(true);
  }, []);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('selectedRole');
    
    // Redirect to home
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  // Add role-specific nav links
  const allNavLinks = userRole === 'lawyer' 
    ? [...navLinks.filter(l => l.href !== '/feedback'), { href: '/lawyer-dashboard', label: 'Dashboard' }]
    : [...navLinks, { href: '/submit-query', label: 'Submit Query' }];

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Navigation */}
      <nav className="bg-white text-slate-900 p-4 sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo / Brand */}
          <Link 
            to="/" 
            className="font-bold text-xl md:text-2xl bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition"
          >
            Jan Adhikar
          </Link>

          {/* Hamburger Menu Button (Mobile) */}
          <button
            className="md:hidden text-slate-900 hover:text-indigo-600 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1 lg:gap-2">
            {allNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 lg:px-4 py-2 rounded text-sm lg:text-base transition-all duration-300 ${
                  location.pathname === link.href 
                    ? 'bg-indigo-600 font-semibold text-white' 
                    : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex gap-2 items-center ml-4">
            {isLoaded && user ? (
              <>
                <span className="text-sm text-slate-700 mr-2">
                  {user.firstName}
                  {userRole === 'lawyer' && <span className="ml-2 text-xs bg-purple-600 px-2 py-1 rounded text-white">Lawyer</span>}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 transition-all text-white"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4 space-y-2">
            {allNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={closeMenu}
                className={`block px-3 py-2 rounded text-sm transition-all ${
                  location.pathname === link.href
                    ? 'bg-indigo-600 font-bold text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-200 pt-2 mt-2 space-y-2">
              {isLoaded && user ? (
                <>
                  <div className="px-3 py-2 text-sm text-slate-700">
                    {user.firstName}
                    {userRole === 'lawyer' && <span className="ml-2 text-xs bg-purple-600 px-2 py-1 rounded text-white">Lawyer</span>}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm font-semibold flex items-center gap-2 transition-all text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
